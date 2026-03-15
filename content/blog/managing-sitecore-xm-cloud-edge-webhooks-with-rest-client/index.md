---
title: "Managing Sitecore XM Cloud Edge Webhooks with REST Client"
date: "2026-03-15"
categories: ["Sitecore", "XM Cloud", "REST Client", "Webhooks", "VS Code"]
description: "A walkthrough of managing Sitecore XM Cloud Experience Edge webhooks using a single .http file with the VS Code REST Client extension — from getting credentials to creating, listing, and deleting webhooks."
img: ./images/restclient-webhooks.png
---

At Achmea we use Sitecore XM Cloud Experience Edge webhooks to trigger ISR revalidation in our Next.js front-ends. Setting up and managing those webhooks is something I've had to do a few times now — and every time I found myself digging through the API docs to remember the exact calls. So I put everything into a single `.http` file using the VS Code REST Client extension. What I really like about REST Client is that it lets you reuse the response of a previous request in subsequent calls — so you authenticate once, and every request after that just picks up the access token automatically. No copy-pasting tokens between calls. In this post I'll walk you through it: from getting your Edge Administration credentials to creating, listing, and deleting webhooks — without ever leaving your editor.

In this post I'll cover:
- Where to get your Edge Administration credentials from XM Cloud Deploy
- How to store them in an `.env` file
- How the `get_token` request works and how subsequent calls reuse it automatically
- The full set of webhook management requests

## Getting your Edge Administration Credentials from Sitecore

Before you can call any Edge Administration API, you need a client ID and secret. You create these in **XM Cloud Deploy**:

1. Open XM Cloud Deploy and navigate to your project
2. Go to **Credentials** → **Environment** tab
3. Click **Edge Administration** and generate a new credential set
4. Copy the `Client ID` and `Client Secret` — you won't see the secret again after closing the dialog

These credentials use the OAuth 2.0 `client_credentials` flow against `https://auth.sitecorecloud.io`. The resulting access tokens are valid for **24 hours**.

## Storing credentials safely in `.env`

The REST Client extension supports reading variables from a `.env` file in the same workspace. Create a `.env` file at the root of your project:

```dotenv
CLIENT_ID=your-client-id-here
CLIENT_SECRET=your-client-secret-here
WEBHOOK_ID=the-id-of-a-webhook-you-want-to-delete
WEBHOOK_GUID=your-webhook-site-test-guid
```

Make sure `.env` is in your `.gitignore` — you never want real credentials in source control. The `.http` file references these using the `{{$dotenv VARIABLE_NAME}}` syntax, so the secrets stay out of the file itself. This feature is documented, but honestly — every time I need it, I can't find it. Hence this blogpost ;).

## Step 1: Get the Access Token with `get_token`

The first request in the `.http` file fetches an access token:

```http
@auth_base = https://auth.sitecorecloud.io
@edge_base = https://edge.sitecorecloud.io

###
# Get Access Token (OAuth client_credentials)
# @name get_token
POST {{auth_base}}/oauth/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

audience=https://api.sitecorecloud.io
&grant_type=client_credentials
&client_id={{$dotenv CLIENT_ID}}
&client_secret={{$dotenv CLIENT_SECRET}}
```

When you click **Send Request** above this block, the auth endpoint returns a JSON response like this:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

### How named requests work — and why `# @name get_token` matters

The line `# @name get_token` is a REST Client directive that tells the extension: _"store this request and its response under the name `get_token`"_. After you send the request, the full response — headers, status code, and body — is kept in memory for the lifetime of your VS Code session.

You can then reference any part of that stored response in other requests using this syntax:

```
{{requestName.response.body.$.jsonPath}}
```

Breaking it down:
- `get_token` — the name you gave the request with `# @name`
- `.response.body` — targets the response body
- `.$` — the root of the JSON document (JSONPath syntax)
- `.access_token` — the field you want to extract

So `{{get_token.response.body.$.access_token}}` resolves to the raw JWT string from the auth response body. REST Client injects it inline wherever you use it — including inside an `Authorization` header:

```http
Authorization: Bearer {{get_token.response.body.$.access_token}}
```

This means you click **Send Request** on `get_token` once, and all other requests in the file are immediately authorized for the rest of that VS Code session (or until the 24-hour token expires). No manual copy-pasting of tokens. You can go even deeper with JSONPath if the response is more complex — for example `{{get_token.response.body.$.user.roles[0]}}` — but for our purposes the access token is all we need.

## Step 2: Manage Webhooks

With a live token in `get_token`'s response, you can now run any of the following:

### List all webhooks

```http
###
# List Webhooks
GET {{edge_base}}/api/admin/v1/webhooks HTTP/1.1
Authorization: Bearer {{get_token.response.body.$.access_token}}
```

Good first call to make — shows you what's already registered so you don't create duplicates.

### Create a webhook (OnUpdate)

```http
###
POST {{edge_base}}/api/admin/v1/webhooks HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{get_token.response.body.$.access_token}}

{
    "label": "ContentUpdate - OnUpdate",
    "uri": "https://webhook.site/{{$dotenv WEBHOOK_GUID}}",
    "method": "POST",
    "headers": { "acme": "ContentUpdate" },
    "createdBy": "ga",
    "executionMode": "OnUpdate"
}
```

`OnUpdate` fires per-batch during publishing with details about which entities changed — useful for selective ISR. Note that Edge fills the body automatically here; you cannot provide a custom body for `OnUpdate` webhooks.

### Create a webhook (OnEnd)

Change `executionMode` to `"OnEnd"` and you get a webhook that fires once after the entire publish job is done. All content is guaranteed to be on Edge at that point, making it ideal for a full revalidation trigger.

### Delete a webhook

```http
###
DELETE {{edge_base}}/api/admin/v1/webhooks/{{$dotenv WEBHOOK_ID}} HTTP/1.1
Authorization: Bearer {{get_token.response.body.$.access_token}}
```

Put the webhook ID you want to remove in `WEBHOOK_ID` in your `.env`. Handy for cleaning up test webhooks — which I seem to create a lot of (and an unwilling admin sometimes too ;)).

### Bonus: Clear Cache and Delete Content

The file also includes two admin calls that are useful during development:

```http
# Clear Cache
DELETE {{edge_base}}/api/admin/v1/cache HTTP/1.1
Authorization: Bearer {{get_token.response.body.$.access_token}}

# Delete Content
DELETE {{edge_base}}/api/admin/v1/content HTTP/1.1
Authorization: Bearer {{get_token.response.body.$.access_token}}
```

Use these with care — and only on non-production environments.

## The Complete .http File

The full file is available in the GitHub repo: [BasLijten/sitecore-ai-webhooks](https://github.com/BasLijten/sitecore-ai-webhooks). Clone it, add your `.env`, and you have a ready-to-go webhook management toolkit.

## Conclusion

Right now the file covers the basics well, on how to register the sitecore experience edge webhooks, in conjunction with the vscode restclient extension. By just having to update the clientid/clientsecret, it saves a lot of effort while testing and removing endpoints.
