---
title: 'how to get duende bff to work with nginx - upstream sent too big header while reading response header from upstream'
date: '2024-04-03'
category:
  - 'Duende'
  - 'Reverse proxy'
description: ''
img: ./images/header.png
tags:
  - 'Duende'
  - 'Kubernetes'
  - 'Nginx'
  - 'sitecore'
---

[Duende BFF](https://docs.duendesoftware.com/identityserver/v7/bff/) (Backend for Frontend) is an excellent solution which adds an extra security layer to [YARP](https://microsoft.github.io/reverse-proxy/), Yet-Another-Reverse-Proxy by Microsoft. I previously [wrote about it](https://blog.baslijten.com/why-to-choose-yarp-for-a-sitecore-migration/) on how it can aid in Sitecore migrations. Although it is able to [run as an ingress controller on kubernetes](https://blog.baslijten.com/how-to-deploy-yarp-ingress-controller-on-kubernetes-in-docker-desktop-kind/), it makes more sense to run a more common product such as nginx as the ingress controller. However, combined with Duende BFF, this leads to some issues:

> upstream sent too big header while reading response header from upstream

## A quick solution

The logs clearly state that the upstream header-size is way to large. This can be fixed by adding the following line to the nginx configuration:

```nginx
# Tune Nginx buffers #
server {
 proxy_busy_buffers_size   512k;
 proxy_buffers   4 512k;
 proxy_buffer_size   256k;
 # rest of the nginx config below #
}
```

however, I didn't want to ship a complete new config file just to fix this issue. Luckily, the ngnix ingress controller supports a [broad amount of annotations](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-annotations/) in order to configure the ingress controller.

Please not that the chosen values are arbitrary and should be adjusted to your specific needs. The following annotations can be added to the ingress resource:

```yaml{6-8}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    nginx.ingress.kubernetes.io/proxy-buffers: "4 512k"
    nginx.ingress.kubernetes.io/proxy-buffers-number: "4"
    nginx.ingress.kubernetes.io/proxy-buffer-size: "512k"
spec:
  rules:
  - http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: gateway
            port:
              number: 8080
```
