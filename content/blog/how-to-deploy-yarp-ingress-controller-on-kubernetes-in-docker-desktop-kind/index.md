---
title: "Dapr NextJS"
date: "2024-03-13"
category: 
- "NextJS"
- "Dapr"
description: "nextJS dapr"
img: ./images/yarp.png
tags:
---

1) Install:
```powershell
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
```

2) Verification
```powershell
dapr -h
```

init dapr outside docker
```powershell
dapr init --slim
```

sample: [dapr slim](https://docs.dapr.io/operations/hosting/self-hosted/self-hosted-no-docker/)


