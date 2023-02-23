---
title: "Set the SignalR UserID without authentication"
date: "2023-02-22"
category: 
- "javascript"
- ".Net"
- "Azure Functions"
- "SignalR"
- "Azure"
- "Personalization"
description: "How to set the userid in your browser, without having to authenticate your users"
img: ./images/signalR-userid.jpg
tags:
- "javascript"
- ".Net"
- "Azure Functions"
- "SignalR"
- "Azure"
- "Personalization"
---
SignalR is a great service provided by Microsoft, which enables to send updates to a browser from a server through the websocket protocol. A great usecase is to use this technique to personalize the web experience, [I spoke about this subject](https://www.youtube.com/watch?v=zT2uT1zSGuE) years ago, however, I never blogged about this subject. This blogpost will just be a short blogpost about setting a unqiue userid, which can be used by your personalization/decision engine to notify a connected client with an update whenever there is one available.

> Disclaimer: In order to use personalization, track users, or whatsoever, you might or might have to obey your national regulations. Please consult your legal department ;)


## Architecture

In this specific example, 5 main actors exist, for the sake of simplicity. the CDP/personalization engine provides a unqiue userID, which will be used for registration in SignalR

- Browser
- Azure SignalR
- Azure Functions
- CDP / Personalization engine
- Backend

![diagram](./images/diagram.excalidraw.png)


In a regular anonymous, serverless scenario, a browser doesn't subscribe to SignalR itself, but through an Azure function, as a (secret) accesstoken is needed in order to be able to connect to signalR. As this accesstoken is secret, it shouldn't be provided to the browser; here is where the azure function "negotiate" comes in. This one is anonymous accessible and handles the negotiation between the browser and signalR. In most examples, no userID is provided, and after the negotiation phase, a response is being returned with a signalR endpoint and a unique, personal jwt token. this token is used to identify the browser to the signalR service:

```json
{
  "url": "https://xxx.service.signalr.net/client/?hub=serverless",
  "accessToken": "eyJhbGciOiJIUzI1NiIsImtpZCI6IjExOTg2MDcyOTMiLCJ0eXAiOiJKV1QifQ.eyJh...WI9c2VydmVybGVzcyJ9.t2JEGomrl4h-YAwyrfqisVehYbIMqMf6_MadMUUj3pU"
}
```

the jwt token contains the following information:

```json
{
  "alg": "HS256",
  "kid": "-1521035073",
  "typ": "JWT"
}.{
  "nbf": 1677161721,
  "exp": 1677165321,
  "iat": 1677161721,
  "aud": "https://xxx.service.signalr.net/client/?hub=serverless"
}.[Signature]
```

the JWT token doesn't contain any information on the user, but is used for authentication towards the signalR service. Once a connection has been setup, broadcast messages or connection specific messages can be send via signalR to the client, but User specific messages aren't possible anymore

In order to be able to send specific messages towards "users" (well, browsers with users with a specific ID, to be clear ;), the UserID has to be set. There are existing examples on the web, but they are all based on authentication methods using github, facebook, microsoft and they expect to have a specific header in order to be able to use it. 

## Obtaining an User ID
The first import step is to acquire a userid. A lot of signalR examples do use some kind of authentication in order to acquire a UserID, but, especially on commercial websites, people often don't log in. Most of the SignalR examples, which explain how user specific updates work, do require some kind of authentication. Information from this token is being used by SignalR in order to be able to send specific updates to a user. As we are working with anonymous users, this is not an option. As a lot of websites, however, do track users, the UserID of the CDP could be used, but how could it be Send to SignalR?



