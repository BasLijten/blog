---
title: 'A small Quality of Life improvement for the up.ps1 to run Sitecore in containers'
date: '2023-02-11'
category:
  - 'PowerShell'
  - 'docker'
  - 'Sitecore'
  - 'Automation'
description: 'How often do you forget to switch from Linux containers to windows containers? This small fix will save you tons of time'
img: ./images/windows-linux.jpg
tags:
  - 'PowerShell'
  - 'docker'
  - 'Sitecore'
  - 'Automation'
---

Running Sitecore containers do have a few prerequisites, apart from the [software prerequisites](https://doc.sitecore.com/xmc/en/developers/xm-cloud/walkthrough--setting-up-your-full-stack-xm-cloud-local-development-environment.html): There shouldn't be a process running which occupies port 443, and you should be admin. I can't recall the number of times where I found out that I had to stop IIS (especially after a reboot of my machine) and where I forgot to start Windows Terminal with administrator privileges. The third one, to complete my top 3 of "stupid mistakes that can be solved and shouldn't be made again", is that I have my Docker Desktop running in Linux container mode. This often happens after a restart, upgrade or when I am building applications which can run on linux containers. The error you'll generally see is the following:

> failed to solve: rpc error: code = Unknown desc = failed to solve with frontend dockerfile.v0: failed to create LLB definition: no match for platform in manifest sha256

Although there is a long time [feature request](https://github.com/docker/roadmap/issues/79) by Bart Plasmeijer (since 29 april 2020), this still hasn't been fixed. (Well, it can be done with some workarounds, but that is not a feasable approach imho).

# The quality of life improvment

I updated my up.ps1 scripts with a simple fix

- check with the docker-cli what the current OStype is.
- if this isn't windows, offer to switch the mode to windows

that's all ;)

simply put this check between the start of the script and the first docker command to pull images, and you are good to go:

```powershell
$osType = docker info --format '{{ .OSType }}'
if($osType -ne 'Windows') {
  $title   = 'Switch platform'
  $msg     = 'Do you want to switch to Windows containers?'
  $options = '&Yes', '&No'
  $default = 0  # 0=Yes, 1=No

    $response = $Host.UI.PromptForChoice($title, $msg, $options, $default)
    if ($response -eq 0) {
        & $Env:ProgramFiles\Docker\Docker\DockerCli.exe -SwitchWindowsEngine
        Write-Host "Switched to Windows containers"
    }

    if ($response -eq 1) {
      Write-Host "Script will run into errors, because the platform will not be set to Windows containers"
    }
}
```
