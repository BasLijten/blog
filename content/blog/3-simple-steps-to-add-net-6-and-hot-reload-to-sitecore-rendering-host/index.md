---
title: "Convert your Sitecore asp.net rendering host to net6 and get hot reload for free"
date: "2021-11-19"
category: 
- "net 6"
- "Sitecore"
description: "How to add net6 and the hot reload functionality to your Sitecore asp.net renderinghost"
img: ./images/hot.jpg
tags:
- "net 6"
- "Sitecore"
---
In this blogpost I'll explain how to convert the existing Asp.Net core 3.1 endering host to .net 6. This is not only faster, but you will get the awesome hot reload functionality for free as well. In addition to this hot reload functionality, I converted the main template to use [top level statements](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/top-level-statements).  While Sitecore's main focus currently is on Nextjs and Static Site generation, there are a lot of use cases where the .Net rendering host has a place. The main theme is all about offloading serverside logic from Sitecore to *another* platform, and with organizations which have heavily invested in their .Net development capacity, the Sitecore Asp.Net rendering host has a place.

## The result 
The result is not different from [the video](https://www.youtube.com/watch?v=4S3vPzawnoQ&ab_channel=ScottHanselman) published by [scott hanselman](https://www.hanselman.com/), I wrote this blogpost only to show how to convert the existing asp.net core 3.1 rendering host project to .Net 6, to achieve the same result. This can be seen in the video below:

video: [youtube](https://youtu.be/p0zPYYZO8cw)
`youtube: https://youtu.be/p0zPYYZO8cw

## The changes
Just three actions are need:

### 1. Update the csproj file
In order to be able to use the .Net6 framework, the ```.csproj``` file needs to be updated to use the TargetFramework, as seen below. 

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <UserSecretsId>0dd80cb0-354b-425e-aa55-eb26c6f571fc</UserSecretsId>
	<ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>MyProject</RootNamespace>
    <AssemblyName>MyProject</AssemblyName>
	<Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

### 2. Update the program.cs file and remove the Startup.cs
The second required action, was to *update* the program.cs file.The complete update to the program.cs file is as follows: please note that the namespacing and class definitions are gone. At first, it looked a bit chaotic and messy to me, but after working several hours with this new notation, I started to love it!

The startup.cs file *needs* to be removed when using the approach above, otherwise certain middlewares get injected multiple times, which will give a runtime error.

```csharp
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Sitecore.AspNet.ExperienceEditor;
using Sitecore.AspNet.RenderingEngine.Extensions;
using Sitecore.AspNet.RenderingEngine.Localization;
using Sitecore.AspNet.Tracking;
using Sitecore.LayoutService.Client.Extensions;
using Sitecore.LayoutService.Client.Newtonsoft.Extensions;
using Sitecore.LayoutService.Client.Request;
using System.Globalization;
using MyProject.Configuration;
using MyProject.Models;

var _defaultLanguage = "en";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRouting().AddLocalization().AddMvc().AddNewtonsoftJson(o => o.SerializerSettings.SetDefaults());

SitecoreOptions Configuration = builder.Configuration.GetSection(SitecoreOptions.Key).Get<SitecoreOptions>();

builder.Services.AddSitecoreLayoutService().WithDefaultRequestOptions(request =>
{
    request
        .SiteName(Configuration.DefaultSiteName)
        .ApiKey(Configuration.ApiKey);
})
    .AddHttpHandler("default", Configuration.LayoutServiceUri)
    .AsDefaultHandler();

builder.Services.AddSitecoreRenderingEngine(options =>
{
    //Register your components here
    options
        .AddModelBoundView<ContentBlockModel>("ContentBlock")
        .AddDefaultPartialView("_ComponentNotFound");
})
               // Includes forwarding of Scheme as X-Forwarded-Proto to the Layout Service, so that
               // Sitecore Media and other links have the correct scheme.
               .ForwardHeaders()
               // Enable forwarding of relevant headers and client IP for Sitecore Tracking and Personalization.
               .WithTracking()
               // Enable support for the Experience Editor.
               .WithExperienceEditor();


var app = builder.Build();

app.UseForwardedHeaders(ConfigureForwarding(app.Environment));

ForwardedHeadersOptions ConfigureForwarding(IWebHostEnvironment env)
{
    var options = new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    };
    if (env.IsDevelopment())
    {
        // Allow forwarding of headers from Traefik in development
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    }
    // ReSharper disable once RedundantIfElseBlock
    else
    {
        // TODO: You should configure forwarding options here appropriately based on your test/production environments.
        // https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-3.1
    }
    return options;
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    //app.UseHsts();
}



if (Configuration.EnableExperienceEditor)
{
    // Enable the Sitecore Experience Editor POST endpoint.
    app.UseSitecoreExperienceEditor();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.UseRequestLocalization(options =>
{
    // If you add languages in Sitecore which this site / Rendering Host should support, add them here.
    var supportedCultures = new List<CultureInfo> { new CultureInfo(_defaultLanguage) };
    options.DefaultRequestCulture = new RequestCulture(_defaultLanguage, _defaultLanguage);
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
    // Allow culture to be resolved via standard Sitecore URL prefix and query string (sc_lang).
    options.UseSitecoreRequestLocalization();
});

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        "error",
        "error",
        new { controller = "Default", action = "Error" }
    );
    // Enables the default Sitecore URL pattern with a language prefix.
    endpoints.MapSitecoreLocalizedRoute("sitecore", "Index", "Default");
    // Fall back to language-less routing as well, and use the default culture (en).
    endpoints.MapFallbackToController("Index", "Default");
});

app.Run();
```

### 3. Update the package references
Of course, with a new framework version, new dependency versions are introduced as well. THe package.props file got an update to point to the .net 6 versions of the packages. 

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--
  These props are used by Central Package Versions to ensure consistent NuGet
  package versions in your Visual Studio projects.
  https://github.com/microsoft/MSBuildSdks/tree/master/src/CentralPackageVersions
-->
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <PlatformVersion>10.2.0</PlatformVersion>
    <SitecoreAspNetVersion>19.0.0</SitecoreAspNetVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Update="Sitecore.Kernel" Version="$(PlatformVersion)" />
    <PackageReference Update="Sitecore.ContentSearch" Version="$(PlatformVersion)" />
    <PackageReference Update="Sitecore.ContentSearch.Linq" Version="$(PlatformVersion)" />
    <PackageReference Update="Sitecore.LayoutService" Version="8.0.0" />
    <PackageReference Update="Sitecore.Assemblies.Platform" Version="$(PlatformVersion)" />
    <PackageReference Update="Sitecore.Assemblies.SitecoreHeadlessServicesServer" Version="$(SitecoreAspNetVersion)" />

    <PackageReference Update="Sitecore.AspNet.ExperienceEditor" Version="$(SitecoreAspNetVersion)" />
    <PackageReference Update="Sitecore.AspNet.Tracking" Version="$(SitecoreAspNetVersion)" />
    <PackageReference Update="Sitecore.AspNet.Tracking.VisitorIdentification" Version="$(SitecoreAspNetVersion)" />
    <PackageReference Update="Sitecore.LayoutService.Client" Version="$(SitecoreAspNetVersion)" />
    <PackageReference Update="Sitecore.AspNet.RenderingEngine" Version="$(SitecoreAspNetVersion)" />
    <PackageReference Update="Microsoft.AspNetCore.Mvc.NewtonsoftJson" Version="6.0.0" />
    <PackageReference Update="Microsoft.Extensions.DependencyInjection.Abstractions" Version="6.0.0" />
    <PackageReference Update="Microsoft.Extensions.Http" Version="6.0.0" />
    <PackageReference Update="Microsoft.VisualStudio.Web.CodeGeneration.Design" Version="6.0.0" />
  </ItemGroup>
</Project>
```

### 4. Enjoy
run your application using ```dotnet watch run``` and you are good to go. Update your code, styling or razorviews, the .net 6 framework automagically detects the changes and forces a reload in the browser.

## Summary
Migrating to .net6 is not hard. In three little steps you will be able to work with a faster framework which adds a little bit of extra developer satisfaction as well. Especially when you compare this to the regular serverside Sitecore MVC approach ;) 