---
title: Docker challenge - how to copy assets from windows containers to linux containers 
description: copying files, as part of a multi stage docker build strategy, is a common practice. However, whenever copying files from a windows based container to a linux based container, things get complicated
date: 2021-05-01
img: "./images/Container-boxes3-1.jpg"
tags: 
- docker
---

In a previous project some build artifacts were produced by a separated docker build container, and thus stored inside this image. By using smart use of separate, small docker images and [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/), it's possible to assign different docker files for different tasks, keep the Dockerfiles clean and small, while there is a maximum usage of build caching. However, some build steps require a windows image, while for other workloads, linux is the best option. When mixing up these types of images in a docker build, things get complicated. At least, I wasn't aware of the action that had to be taken, nor could I found it on the world wide web ;)
## An example
In our (simplified) scenario, some artifacts where provided in a *windows*-container, while our build, required Linux as a runtime. In a normal scenario, copying files between images, is not hard. The example below, works for copying assets **between** windows containers or linux containers. In the specific case below, it copies artifacts from the "\artifacts\sitecore\" directory (which can be ```C:\``` as well!) to the current working directory. The second copy instruction is (of course) windows specific and doesn't work on linux.

```dockerfile
ARG BASE_IMAGE
ARG SOLUTION_IMAGE

# use Base image as base
FROM ${BASE_IMAGE}

# copy artifacts from the solution image
COPY --from=solution \artifacts\ .\

# example for windows specific containers
COPY --from=solution \artifacts\ c:\temp\

# execute further build actions
RUN example.ps1
```

But when mixing up OS-types, things 'get complicated': Trying to copy from a Windows image to a linux image, the line ```COPY --from=solution \artifacts\ .\``` throws an error:

!["Error copying files"](.\images\copy-error.jpg)

The specific error ```failed to compute cache key: "/artifacts" not found: not found``` points to a directory that couldn't be found. Changing this to "c:\artifacts" throws almost the same error:

```failed to compute cache key: "/c:/artifacts" not found: not found```

The conclusion was almost drawn that copying files between windows and linux was not possible. However, the following line worked, it was changed to the current directory of the "from"-image:

```COPY --from={SOLUTION_IMAGE} . /cb/style/dist/```

This gave the opprtunity to run the container, login into a shell and find out what files had been copied over

```bash
docker run -it {image} /bin/bash
```

The screenshot shows three directories: ```"Files", "Hives" and "UtilityVM"```

!["the directories that were copied"](.\images\file-overview.jpg)

This basically means, that on "a" location on the windows-image, three folder exists which are copied over. Listing the content of the "Files" directory, showed the required artifacts directory:

!["The artifact folder exists in the Files directory"](.\images\files-listing.jpg)

Changing the copy action from "." to "Files\artifacts" brought the expected result

```dockerfile
ARG BASE_IMAGE
ARG SOLUTION_IMAGE

# use Base image as base
FROM ${BASE_IMAGE}

# copy artifacts from the solution image
COPY --from=solution Files\artifacts\ .\

# execute further build actions
RUN example.ps1
```

## Summary
Copying files between windows and Linux containers is possible, but the "c:\" directory, nor the "regular" location cannot be speficied. In the specific situation to copy files between windows and Linux, the directory of the Windows container needs to be preceded with a "Files" directory, otherwise all OS files, and some other files (of the utilityVM) are copied over as well 