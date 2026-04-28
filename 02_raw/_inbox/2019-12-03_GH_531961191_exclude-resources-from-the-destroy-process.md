---
date: 2019-12-03
source: gh
source_detail: "gh post 531961191 by u/kerwanp"
url: "https://github.com/hashicorp/terraform/issues/23547"
topic: "Exclude resources from the destroy process"
author: kerwanp
engagement: 152
created_utc: 2019-12-03T12:48:23Z
pain_keywords: ["\\bworkaround\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Exclude resources from the destroy process

> **Source**: https://github.com/hashicorp/terraform/issues/23547

## 原始内容

### Current Terraform Version
```
Terraform v0.12.16
```

### Use-cases
Let's say we have in our Terraform configuration :
- `terraform-aws-modules/terraform-aws-vpc` used to create a VPC with private and public subnets and all the VPC configuration around it
- `terraform-aws-modules/terraform-aws-eks` used to create an EKS Cluster and some workers.
  - Using the previously created private and public subnets
- Some kubernetes and helm configurations using `terraform-providers/terraform-provider-helm` and `terraform-providers/terraform-provider-kubernetes`
  - With LoadBalancer services using annotations to automatically create ELBs

Everything is currently running and we want to run `terraform destroy`.
We encounter two problems :

1. A failure problem
Terraform will try to destroy the VPC components such as subnets, but it's impossible because they are using internet gateways that canno't be deleted because some are used by the automatically created ELBs. The easiest way to destroy everything in the VPC in simply to delete the VPC.

2. A performance problem
Terraform will destroy every kubernetes resources such as namespaces, services, deployments, etc. Then, the Cluster. This is a waste of time, just destroying the cluster and the workers is enough.

### Attempted Solutions

I would like to tell to Terraform if the ressource is excluded from the destroy process.

### Workaround

I made two configurations :
- Main configuration : contains all the components which needs to be destroyed
  - Ex : VPC, Cluster, RDS, DynamoDB
- Sub configuration : contains all the components which will be destroyed (provider side) by destroying the main components
  - Ex : Kubernetes configuration, subnets, internet gateway, etc

With this pattern, we can then create a simple CLI with a destroy command :
1. Run the command terraform destroy in the main configuration
2. When the step 1 is successfully finished, remove the state of the sub configuration

### Proposal

Adding an annotation system, the plugins could interact with the annotated resources and listening to event (refreshing state event, pre and post creation and destroy event).
This could be useful for a ton of features.

Here is an example
```
@IgnoreFail("creation")
@NoDestroy
resource "kubernetes_cluster_role_binding" "tiller" {
  metadata {
    name = "tiller"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind = "ClusterRole"
    name = "cluster-admin"
  }
  subject {
    kind = "ServiceAccount"
    name = "tiller"
    namespace = "kube-system"
  }
}
```

`@NoDestroy`
The resource will be ignored in the destroyed process

`@IgnoreFail`
When destroying, creating, or refreshing, if it fails, it's simply ignored.
We can pass a parameter to ignore only in one of the processes

## 自动提取的痛点信号

- 命中关键词: \bworkaround\b
- 互动度: 152
- 作者: u/kerwanp

<!-- 处理: 调度员 → 5 阶段 pipeline -->
