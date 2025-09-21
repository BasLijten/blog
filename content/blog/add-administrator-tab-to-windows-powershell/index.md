---
title: 'Add a tab with admin privileges to Windows Terminal using gsudo'
date: '2023-04-21'
category:
  - 'Powershell'
  - 'Sitecore'
description: 'When working with windows powershell you sometimes have to switch to a console with admin privleges. With the default behaviour, a new window will be opened. This blogpost explains how to make this possible within a new tab'
img: ./images/banner.png
tags:
  - 'PowerShell'
  - 'Sitecore'
---

For the platform that I often work with, it is required that some tasks are run with administrative privileges. I often forget to open my windows terminal with admin privileges, or to open vscode with admin privileges. Aside from forgetting it, I dislike that from a security perspective as well. When admin privileges are required, vscode or Windows terminal often gets opened with these privileges and is not closed afterwards. There are a few solutions to overcome this: 1) Windows terminal, does support to open a new console with administrative privileges, however, this will end up into a new windows terminal being opened, or 2) a tool called `gsudo` can be used to run a certain script, shell or command with admin privleges.

In some cased, I'd like just to open an extra tab with extra privileges instead of a second terminal with these permissions. This blogpost explains how to combine Windows Terminal with `gsudo` in order to open a tab in WIndows terminal with these permissions. In the end it is even possible to run a regular shell and elevated shell side by side. This blogpost explains how to do this.

![running shells side by shell](./images/2023-04-21_16-44-07.gif)

## required software - gsudo

In orde to make this possible, the tool [gsudo](https://github.com/gerardog/gsudo) needs to be installed.

> `Gsudo` is a `sudo` equivalent for windows. equivalent for Windows, with a similar user-experience as the original Unix/Linux sudo. Allows to run commands with elevated permissions, or to elevate the current shell, in the current console window or a new one.

The `elevate the current shell` is where the power of this tool lies. using `gsudo powershell` the elevated console can be opened. And the cool part, it is not strictly bound to only powershell, but `bash`, `cmd` and other shells can be run under elevated privileges as well! This tool can easily be installed with the following command:

```powershell
winget install gerardog.gsudo
```

## How to add the tab with administrator privileges

After installation of this tool, the next step is to configure Windows terminal to add a configuration with the administrator privileges. When that specific configuration is used, a new tab with a console with elevated will be opened, as can be seen in the animation below.

![elevated privileges in a new tab](./images/2023-04-21_16-33-13.gif)

### how to add the configuration

The configuration can be added using the UI and by changing the `settings.json`, in this post I will stick to the configuration in json. Running a shell with elevated privileges using gsudo is as easy by executing

```powershell
gsudo powershell
```

nothing more ;).
In this example I have chosen to recolor the tab to a shade red, to emphasize it is running under admin privileges. By adding the configuration below to the `profiles.list` array, the privileged shell will be added.

```json
{
  "altGrAliasing": true,
  "antialiasingMode": "grayscale",
  "closeOnExit": "graceful",
  "colorScheme": "Campbell",
  "commandline": "gsudo powershell",
  "cursorShape": "bar",
  "font": {
    "face": "CaskaydiaCove Nerd Font",
    "size": 12.0
  },
  "guid": "{340de3b5-f6c7-4de5-85b3-374267ce9507}",
  "hidden": false,
  "historySize": 9001,
  "icon": "ms-appx:///ProfileIcons/{61c54bbd-c2c6-5271-96e7-009a87ff44bf}.png",
  "name": "PowerShell (Admin) - gsudo",
  "padding": "8, 8, 8, 8",
  "snapOnInput": true,
  "startingDirectory": "c:\\git\\",
  "tabColor": "#A51143",
  "useAcrylic": false
}
```

## Open in split pane view

This last section is all about opening the elevated shell side by side in a pane:

![running shells side by shell](./images/2023-04-21_16-44-07.gif)

This can be done by holding the left `alt` button and selecting the profile `PowerShell (Admin) - gsudo`, the new pane will be added to the current tab. The pane can be closed py pressing `ctrl + shift + w`

## Summary

There are situations where it is preferred to open a new tab rather than opening a new windows to execute powershell commands with admin privileges. This blogpost explained that this can be done using the tool `gsudo`, in combination with a custom profile
