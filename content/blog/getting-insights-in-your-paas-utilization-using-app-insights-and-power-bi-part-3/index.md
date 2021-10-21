---
title: "How to get insights in your (Sitecore) paas utilization using application insights and Power BI - Part 3 - visualize the data in powerbi"
date: "2021-10-21"
category: 
- "Application Insights"
- "Power BI"
- "Azure"
- "Sitecore"
description: "running a lot of Sitecore environments on Azure might bring a lot of costs, as the payroll continues 24/7. This blogpost series describes how to get insights in the actual utilization (and waste)"
img: ./images/utilization-per-app-no-numbers - banner.png
tags:
- "Application Insights"
- "Power BI"
- "Azure"
- "Sitecore"
---
When running PaaS workloads in Azure, you often pay a certain fee for these services. In case of, for example, Azure App Services, these resources cannot be paused, which will net you some costs. When having larger, complexer sets of resources (for example, a Sitecore workload), costs might add up and when having multiple workloads, those costs will increase even harder. Lower environments, such as Dev, Test, Acceptance, Quality, or whatsoever, are often running 24/7, while they are not, or just a bit, utilized, however, it's not visible how much % of the time they are utilized and when this happens. In order to overcome this, I created a kusto query and a power bi report to acquire these insights. In three blogpost I wil share the results, the kusto-query and the power-bi implementation

> *This is part 1 of 3 of this blogpost series* 
> * part 1  - [introduction: in this blogpost I will cover the outcomes](..\getting-insights-in-your-paas-utilization-using-app-insights-and-power-bi-part-1)
> * part 2 - [How to create the kusto query](..\getting-insights-in-your-paas-utilization-using-app-insights-and-power-bi-part-2)
> * part 3 - How to create the Power BI report

This third and last blogpost will explain on how to get the data from application insights into power bi and how to generate the reports
## Export the application insights query
The first step is to export your query to PowerBIO