---
title: "how to token replacement using the file transform task inside web deployment packages"
date: "2021-05-05"
category: 
- "Azure Devops"
- "Azure Pipelines"
description: "Blogpost about how to use the separate file transformation task in conjunction with a web deployment package "
img: ./images/GearsAndConfiguration.jpg
tags:
- Azure Devops
- Azure Pipelines
- msdeploy
---
In our company, we have build literally hundreds of webapis over the years, which are still being used and under active development. During these years, a practice was developed to automatically build and deploy those webapis using msdeploy. Part of the process is to replace parameters inside the packages, using the [parameters/setparameter.xml](https://docs.microsoft.com/en-us/aspnet/web-forms/overview/deployment/web-deployment-in-the-enterprise/configuring-parameters-for-web-package-deployment) approach. This work is cumbersome, complex, error-prone, but was, for a long time, the only (supported) way of working. It also became part of a solid process which hasn't been evaluated for years. However, configuration is one of the main timesinks, so it was time to re-evaluate to find out if things could be simplified

> this blogpost has been written with the .Net 4.7.1 in mind

## Downsides
Using msdeploy with parameters and setparameters.xml has two downsides:

1. This method is cumbersome, especially when working with *loads* of variables. For every variable, a location in the package, a parameters.xml entry, a setparameters.xml entry and an XPath query has to be made. 
2. For local deployments, this process could be used (by altering the publishin profile), but this process is error-prone and requires often a lot of trial and error. Developers tend to choose a shortcut and include default values inside the web.config, with a chance of committing or checking in unwanted configuration their repository.

A web.config often looks like the snippet below:

```xml
<appSettings>
  <add key="property1" value="username1" />
  <add key="property2" value="pass@w0rd1" />
  <add key="property3" value="http://someendpoint" />
</appSettings>

```

## The solution
A specific Azure Devops Task, called the [File Transform task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/file-transform?view=azure-devops) offers a much easier approach to replace variables, by using tokens: within the connectionstrings and appSettings section of an xml file, every token which has been pre- and post-fixed by double underscores __ (example: ```__token__```) can be replaced by an evironment variable. However, the use of this tasks is not as trivial as it looks like. Specifying the targetfiles requires extra effort and working with the local settings doesn't work the same way as before anymore, as the defaultvalues should be replaced by the various  ```__tokens__``` which need to be replaced. 

```xml
<appSettings>
  <add key="property1" value="__property1__" />
  <add key="property2" value="__property2__" />
  <add key="property3" value="__property3__" />
</appSettings>
```
The configuration needs to be changed as displayed above. The default values have disappeared, another solution needs to be found to solve the local configuration approach. 

> moving away from default values in your web.config isn't a bad thing. Developers often (temporarily) store usernames, passwords or other sensitive information, which may end up in your repository

### How Specify the targetfile for variable substitution

As seen in task description below, the targetFiles which are used for "variable substitution" must be specified.

```yaml
# File transform
# Replace tokens with variable values in XML or JSON configuration files
- task: FileTransform@1
  inputs:
    #folderPath: '$(System.DefaultWorkingDirectory)/**/*.zip' 
    #enableXmlTransform: # Optional
    #xmlTransformationRules: '-transform **\*.Release.config -xml **\*.config-transform **\*.$(Environment.Name).config -xml **\*.config' # Optional
    #fileType: # Optional. Options: xml, json
    #targetFiles: # Optional
```

The challenge lies in the way in the structure of a webdeployment package. When this package is build, the location of the website inside this package varies; this location reflects the working folder of the msbuild/msdeploy command. Thus "simply" configuring the targetFile is not possible. Retrieving this location is easy, by simply search the zip-archive for this web.config. the result is set as the environment variable ```webconfigFilePath``` in the pipeline for further use

> In the example below I explicitly look for the Web.Config in the root of the website. my pipeline artifact "wapi/wapi1.zip" was downloaded to ```$(System.DefaultWorkingDirectory)/artifacts/wapi/wapi1.zip```. The default behaviour of msbuild always uses the PackageTmp location, so it is safe to search for PackageTmp/Web.config pattern. A better approach may exist ;)

```powershell
$Path = "$(System.DefaultWorkingDirectory)/artifacts/wapi/wapi1.zip"
$filter = "web.config"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
$a = $zip.Entries | where {$_.FullName -match "PackageTmp/Web.config" }
## set the environment variable to the location found
Write-Host "##vso[task.setvariable variable=webconfigFilePath;]$a"
```

The next step is to simply execute the ```Filetransform``` task and specify the ```webconfigFilePath``` environment variable as input for the targetFiles

```yaml
- task: FileTransform@1
  displayName: 'File Transform: Web.config'
  inputs:
    folderPath: '$(System.DefaultWorkingDirectory)/artifacts/wapi/wapi1.zip' 
    fileType: xml
    targetFiles: $(webconfigFilePath) 
```

### Working with local variables

Working with local variables has become very easy since .Net 4.7.1, with the introduction of the ConfigurationBuilder. The [Configuration Builder](https://docs.microsoft.com/en-us/aspnet/config-builder) allows to configure extra sources of configuration (although, not the in same way as [configuration _providers_](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-5.0#cp) work in .Net)

One example is the use of the [User Secrets Configuration Builder](https://docs.microsoft.com/en-us/aspnet/config-builder#usersecretsconfigbuilder). this approach allows to specify a specific file which is outside your repository and add configuration to it. Below the main actions are shown (although not ALL, read the linked article to find out what needs to be done)

```xml
<add name="UserSecrets" userSecretsId="{secret string, typically a GUID}" userSecretsFile="~\secrets.file" type="Microsoft.Configuration.ConfigurationBuilders.UserSecretsConfigBuilder, Microsoft.Configuration.ConfigurationBuilders.UserSecrets" />
```

Any kind of key-value will work, although it is named "secrets":

```xml
<?xml version="1.0" encoding="utf-8" ?>
<root>
  <secrets ver="1.0">
    <secret name="secret key name" value="secret value" />
  </secrets>
</root>
``` 
The last action is to simply add this Configuration builder as source to your appSettings:

```xml
<appSettings configBuilders="UserSecrets">
```

## Summary
Without any code,change, but with some configuration changes, we were able to ditch sensitive information from the codebase, simplify the configuration-process, and keep the "F5" experience.