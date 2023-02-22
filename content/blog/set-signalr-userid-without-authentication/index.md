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
- Azure SignalR
- Azure Functions

### Azure SignalR

### Azure Functions

## Obtaining an User ID
The first import step is to acquire a userid. A lot of signalR examples do use some kind of authentication in order to acquire a UserID, but, especially on commercial websites, people often don't log in. Most of the SignalR examples, which explain how user specific updates work, do require some kind of authentication. Information from this token is being used by SignalR in order to be able to send specific updates to a user. As we are working with anonymous users, this is not an option. As a lot of websites, however, do track users, the UserID of the CDP could be used, but how could it be Send to SignalR?



