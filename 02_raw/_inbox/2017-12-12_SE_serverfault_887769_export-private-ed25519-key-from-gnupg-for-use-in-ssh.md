---
date: 2017-12-12
source: se
source_detail: "se post serverfault_887769 by u/Dave"
url: "https://serverfault.com/questions/887769/export-private-ed25519-key-from-gnupg-for-use-in-ssh"
topic: "Export Private ed25519 Key From GnuPG For Use in SSH"
author: Dave
engagement: 47
created_utc: 2017-12-12T19:14:07Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Export Private ed25519 Key From GnuPG For Use in SSH

> **Source**: https://serverfault.com/questions/887769/export-private-ed25519-key-from-gnupg-for-use-in-ssh

## 原始内容

Is there a way to create an id_ed25519 (not id_ed25519.pub) file from an ed25519 keypair stored in GnuPG?

I've started keeping track of my SSH keys in GPG:

sec   rsa3072 2017-12-12 [C]
      DDD8CEFDE281D48CBBF0C56FE2AA8C94C8A7C456
uid           [ultimate] Dave <dave@example.com>
ssb   rsa3072 2017-12-12 [S]
ssb   rsa3072 2017-12-12 [E]
ssb   rsa3072 2017-12-12 [A]
ssb   ed25519 2017-12-12 [A]

To export my public keys for use by SSH, I'm using the --export-ssh-key option in GnuPG that's been available since 2.1. This works for both the RSA and the ed25519 keys.

$ gpg -o id_rsa.pub --export-ssh-key 5D61D0F9!
$ gpg -o id_ed25519.pub --export-ssh-key 0A072B72!

(The ! forces GnuPG to use the specified subkey and not the first available authentication key.)

To export the private RSA key I've used a workflow like this:

$ gpg --export-secret-subkeys \
--export-options export-reset-subkey-passwd 0A072B72! | \
openpgp2ssh 0A072B72 > id_rsa

This creates an RSA private key that SSH can understand, but with no passphrase.

To re-add a passphrase I use:

$ ssh-keygen -p -f id_rsa

On my Windows workstation I convert the key to something PuTTY can understand with PuTTYGen.

This falls apart with ed25519 keys because openpgp2ssh doesn't handle ed25519 keys.

From what I can tell, some people are using their GPG keyrings with SSH directly, but that won't work for me. I need the private key separated out to use with PuTTY on Windows.

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 47
- 作者: u/Dave

<!-- 处理: 调度员 → 5 阶段 pipeline -->
