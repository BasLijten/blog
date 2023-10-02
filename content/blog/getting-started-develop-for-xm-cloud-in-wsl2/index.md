---
title: "Getting started: Develop in WSL2 for XM Cloud - the benefits"
date: "2023-10-02"
category:
- "Frontend"
- "XMCloud"
- "Sitecore"
- "NodeJS"
- "Nextjs"
- "WSL2"
description: "A small performnance comparison between developing in WSL2 and Windows 11"
img: ./images/windows-linux.jpg
tags:
- "Frontend"
- "XMCloud"
- "Sitecore"
- "NodeJS"
- "Nextjs"
- "WSL2"
---

This blogpost makes a small comparison between the performance of developing in WSL2 (Ubuntu 22.04) and Windows 11. The results are based on a few test runs on a XMCloud NextJS starterkit and the XMCloud playsummit website. In my WSL installation, I cloned the repository in the WSL filesystem, and in Windows, I cloned the repository on the Windows filesystem. With other words, I didn't run the test on the mounted disk. I also natively installed the tooling in Ubuntu, and didn't referenfe any binary in Windows. The reason no mounted disks are used, is that this is significantly slower as any other option. The combination of the faster filesystem and the native tooling shows that it is faster to develop "natively" in WSL2 than on Windows 11. Read [this blogpost](../getting-started-develop-for-xm-cloud-in-wsl2/) for more information on how to setup WSL2 for XMCloud development.

All times where measured the following way:

* Linux: ```time {command}```, e.g ```time npm install```
* Windows: ```Measure-Command {start-process command -Wait}```, e.g. ```Measure-Command {start-process npm 'run build' -Wait}```

The table below shows that WSL2 has better performance in all of the usecases. Althoug it's just a few seconds, it adds up during the day. I didn't run these numbers on a large codebase yet, but I expect that the difference will be even bigger. As a reference I use a realworld example of my employer. If I compare buildtimes of our angular codebase, I see that the buildtime on Linux agents is much, much faster as opposed to windows, in terms of restoring packages and building the code. I do expect that the same will apply for WSL2. When I have more numbers, I'll update this blogpost.

command | Windows 11 (s)| WSL2 (s) 
--- | --- | ---
xmcloud starter - npm install on clean repo |  11.9s | 5.5
xmcloud starter - npm install | 3.2 | 1.6
xmcloud starter - npm run build - clean install | 22.5 | 18.4
xmcloud starter - npm run build | 11.32 | 8.16
playsummit npm install - clean | 17.8 | 12
playsummit npm install | 4.67 | 2.49
playsummit npm run build - clean | 32.9 | 27.6 
playsummit npm run build | 17.5 | 11.1 




