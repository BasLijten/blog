---
title: "how to handle errors and prevent exposure of information when using outputbinding in .net isolated azure functions"
date: "2023-05-04"
category: 
- "Azure"
- "Azure Functions"
- "dotnet"
description: "When sending messages to SignalR using dotnet Isolated Azure functions, you might run into the situation that you want to handle errors AND do not want to expose success information. This blogposts describes how to handle this situation"
img: ./images/banner.png
tags:
- "Azure"
- "Azure Functions"
- "dotnet"
---

The solution in this blogpost serves to goals: handle error situations when using azure functions output bindings and prevent the exposure of to much information. In this specific situation a Azure function was created to send a SignalR message to a [specific user](../an-update-on-setting-the-signalr-userid-without-authentication/)specific user. When posting a message to '/api/SendMessage/<userid>', the Azure function tries to send a specific message via SignalR to that specific user. The [default examples](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-output?pivots=programming-language-csharp&tabs=isolated-process#tabpanel_2_in-process) do not offer a solution to my issues.

## The default example

The example below accepts an empty POST to `api/SendMessage/<userid>`. It creates a SignalRMessage for the specific userid and sends this to the configured signalR service. As this is also a HTTPTrigger input binding, the output is also send back to the calling system.

```csharp
[Function("SendMessage")]
[SignalROutput(HubName = "chat", ConnectionStringSetting = "SignalRConnection")]
    {
public static SignalRMessageAction SendMessage([HttpTrigger(AuthorizationLevel.Function, "post", Route = "SendMessage/{userid}" )] HttpRequestData req, string userid)
{    
    return new SignalRMessageAction("newMessage")
    {
        Arguments = new[] { bodyReader.ReadToEnd() },
        UserId = userid,
    };
}
```

This causes two issues:

- every kind of userid is accepted, and thus being send to signalR:
- information about the SignalR connection is being exposed

### userid issues

See the request and response below:

```http
### send malformed request
POST http://localhost:7072/api/SendMessage/*$(%&@#_)$#%&#$&# HTTP/1.1
content-type: application/json
```

```http
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain; charset=utf-8
Date: Wed, 03 May 2023 14:38:13 GMT
Server: Kestrel
Transfer-Encoding: chunked

{
  "ConnectionId": null,
  "UserId": "*$(%&@",
  "GroupName": null,
  "Target": "newNba",
  "Arguments": [
    ""
  ],
  "Endpoints": null
}
```

There is an obious malformed userid input. This should always be prevented, from a security perspective, but also from a costs perspective: every signalR request may lead to additional costs, so these should be filtered. Using a very rudimentary validation, for example a regular expression, will enable the userid validation. The ```SignalRMessageAction``` is required for the SignalROutput, and it could be made ```<nullable>``` When the same request will be sent, the output is as follows:

```http
HTTP/1.1 204 No Content
Content-Length: 0
Connection: close
Date: Wed, 03 May 2023 14:49:24 GMT
Server: Kestrel
```

But this doesn't solve the issue of exposing to much information:

```http
### send correct request
POST http://localhost:7072/api/SendMessage/henk HTTP/1.1
content-type: application/json
```

```http
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain; charset=utf-8
Date: Wed, 03 May 2023 14:51:10 GMT
Server: Kestrel
Transfer-Encoding: chunked

{
  "ConnectionId": "connection-id-information",
  "UserId": "henk",
  "GroupName": null,
  "Target": "newNba",
  "Arguments": [
    ""
  ],
  "Endpoints": null
}
```

This happens due to the behaviour of the output binding, in combination with the HttpTrigger input binding. When there is a HTTPTriggerBinding, the output is automatically send as HttpResponseData.

## The solution

This can be solved by using a custom ReturnObject and moving the Outputbinding into this object. Take note of the SignalROutput binding attribute above the SignalRMessageAction. This Action has been made ```nullable```, for the case where the userid is invalid and SignalR shouldn't be triggered.

```csharp
namespace Models 
{
    public class ReturnObject {
        public HttpResponseData response {get;set;}
        
        [SignalROutput(HubName = "serverless", ConnectionStringSetting = "AzureSignalRConnectionString")]
        public SignalRMessageAction? message {get;set;}
    }
}
```

This enables us to write 'proper' validation within the actual function and send our own custom HttpResponse, based on the outcome of the validation:

```csharp
// rudimentary validation on userid
private static readonly Regex regex = new Regex("^[a-zA-Z0-9-]*$"); 

    [Function("SendMessage")]    
    public static ReturnObject SendMessage([HttpTrigger(AuthorizationLevel.Function, "post", Route = "SendMessage/{userid}" )] HttpRequestData req, string userid)
    {        
        // validate userid
        var result = regex.IsMatch(userid);         
        var returnObject = new ReturnObject();
        if(!result)
            returnObject.response = req.CreateResponse(HttpStatusCode.BadRequest);

        else
        {
            returnObject.response = req.CreateResponse(HttpStatusCode.Accepted);
            returnObject.message = new SignalRMessageAction("newNba")
            {
                Arguments = new[] {string.Empty},
                UserId = userid
            };
        }

        return returnObject;        
    }
```

This leads to the following responses. The Http Response code has been modfied (202/400 vs the default 200/201 code) and the body doesn't contain any information anymore.

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Connection: close
Date: Wed, 03 May 2023 15:08:16 GMT
Server: Kestrel

HTTP/1.1 400 Bad Request
Content-Length: 0
Connection: close
Date: Wed, 03 May 2023 15:08:38 GMT
Server: Kestrel
```

## Summary

As I was new to isolated Azure Functions, Figuring out how to return a proper, custom HttpResponse and do some neat validation, costed me a bit of my time to figure out. It turned out that creating a custom ReturnObject which can be used with the Output bindings solved my issue.