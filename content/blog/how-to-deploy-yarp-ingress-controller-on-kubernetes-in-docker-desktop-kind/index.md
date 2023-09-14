---
title: "how to use YARP as an ingress controller in Kubernetes in Docker Desktop (KinD) on Windows 11"
date: "2023-09-14"
category: 
- "Kubernetes"
- "docker"
- "containers"
- "Yarp"
description: "A simple guide to get the Yarp ingress controller to work in Kubernetes in Docker (KinD)"
img: ./images/yarp.png
tags:
- "Kubernetes"
- "docker"
- "containers"
- "Yarp"
---

In my [previous blogpost](../why-to-choose-yarp-for-a-sitecore-migration/) I described why I am considering to use this [Yarp](https://microsoft.github.io/reverse-proxy/) (Yet another Reverse Proxy) (and a reverse proxy in general) instead of more standard ingress-controllers like HAProxy, Nginx or Traefik for a websites migration usecase. In this blogpost I will describe how I got it to work with Kubernetes in Docker Desktop (KinD). While it is a very accessible and fast way to run Kubernetes on your local machine, it is not always easy to get things to work. Especially when you are not too familiar with Kubernetes, like me.

In my setup I was running [Kubernetes in Docker Desktop](https://kind.sigs.k8s.io/) (KinD) and following the [quick start guide](https://kind.sigs.k8s.io/docs/user/quick-start/).

I learned quickly that on the windows ecosystem, the kubernetes cluster is not accessible from the host machine. While this might be solved with port-forwarding, this is not the most convenient solution. This is where exposing the ingress-controller comes in. By forwarding ports from  the host to an ingress controller, the services behind it can easily be accessed via the ingress controller. The kind documentation has three examples on how to do this with Contour, Kong and NGINX, but not with Yarp. To be sure that the examples worked, the NGNIX example was tested, and indeed, it worked. Basically: two services were created (foo and bar) and based on the path, the ingress controller routes traffic to the correct service. 

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - http:
      paths:
      - pathType: Prefix
        path: /foo(/|$)(.*)
        backend:
          service:
            name: foo-service
            port:
              number: 8080
      - pathType: Prefix
        path: /bar(/|$)(.*)
        backend:
          service:
            name: bar-service
            port:
              number: 8080

After applying the example-ingress, both service was accessible from the


