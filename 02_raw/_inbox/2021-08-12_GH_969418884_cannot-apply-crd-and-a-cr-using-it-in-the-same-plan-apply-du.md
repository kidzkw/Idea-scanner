---
date: 2021-08-12
source: gh
source_detail: "gh post 969418884 by u/heschlie"
url: "https://github.com/hashicorp/terraform-provider-kubernetes/issues/1367"
topic: "Cannot apply CRD and a CR using it in the same plan/apply due to SSA"
author: heschlie
engagement: 445
created_utc: 2021-08-12T19:23:47Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Cannot apply CRD and a CR using it in the same plan/apply due to SSA

> **Source**: https://github.com/hashicorp/terraform-provider-kubernetes/issues/1367

## 原始内容

## Terraform version, Kubernetes provider version and Kubernetes version
```
Terraform version: 0.14.11
Kubernetes Provider version: 2.4.1
Kubernetes version: EKS 1.17
```
## Terraform configuration
There is a bit going on here, but essentially this is the output from the terraform_flux_provder, and through some HCL abuse I'm massaging it into the right format.

```hcl
resource "kubernetes_manifest" "install" {
  for_each   = { for manifest in local.install_manifest : join("-", [manifest.kind, manifest.metadata.name]) => manifest }
  depends_on = [kubernetes_namespace.flux_system]
  manifest   = each.value
}

resource "kubernetes_manifest" "sync" {
  for_each   = { for manifest in local.sync_manifest : join("-", [manifest.kind, manifest.metadata.name]) => manifest }
  depends_on = [kubernetes_manifest.install]
  manifest   = each.value
}
```

## Question
Essentially I am using the `kubernetes_manifest` resource, and am trying to:

1. Deploy some custom resource definitions
2. Deploy some custom resources using the above definitions

Upon doing this I am greeted with an error during the plan because the CRDs have not been created and SSA is not happy about it:

```
Acquiring state lock. This may take a few moments...

Error: Failed to determine GroupVersionResource for manifest

  on main.tf line 49, in resource "kubernetes_manifest" "sync":
  49: resource "kubernetes_manifest" "sync" {

no matches for kind "Kustomization" in group "kustomize.toolkit.fluxcd.io"


Error: Failed to determine GroupVersionResource for manifest

  on main.tf line 49, in resource "kubernetes_manifest" "sync":
  49: resource "kubernetes_manifest" "sync" {

no matches for kind "GitRepository" in group "source.toolkit.fluxcd.io"

Releasing state lock. This may take a few moments...
ERRO[0105] Hit multiple errors:
Hit multiple errors:
exit status 1
```

Is there a way to tell the provider that things are ok, and not try to plan this? It seems like a bug or required feature before this comes out of experimental, as asking for someone to first apply the CRDs, then add and apply the CRs doesn't seem like a valid long term solution.

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 445
- 作者: u/heschlie

<!-- 处理: 调度员 → 5 阶段 pipeline -->
