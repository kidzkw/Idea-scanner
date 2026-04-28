---
date: 2020-01-26
source: se
source_detail: "se post serverfault_1000418 by u/Athanasius"
url: "https://serverfault.com/questions/1000418/recovering-importing-zfs-linux-pool-with-duplicate-pool-name"
topic: "Recovering/importing ZFS Linux pool with duplicate pool name"
author: Athanasius
engagement: 23
created_utc: 2020-01-26T06:29:00Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Recovering/importing ZFS Linux pool with duplicate pool name

> **Source**: https://serverfault.com/questions/1000418/recovering-importing-zfs-linux-pool-with-duplicate-pool-name

## 原始内容

I did something very stupid today in attempting to add a third mirror to an existing Linux zpool named backup.  Suffice it to say that I made a couple errors because I don't really do much admin with my ZFS other than swap disks every couple years.  And in attempting to correct them, I misread online advice to recreate the pool and created a new pool named backup thereby destroying the existing pool.  (Yes, I used the -f option after it complained.  Yes, I'm an idiot.  Now I know never to do that again.  Let's move on.)

From what I read online, my original backup pool that I "created" over is likely unrecoverable.  Which is sort of okay, because it's named backup for a reason -- it mostly just houses my backups going back ~15 years.  However, there are a few things that it would be nice to have back (some non-essential data I had moved there temporarily), and a few things that will take me a few days to set up again having to do with backup settings that resided on that volume.  (Now I know to back up that stuff elsewhere, so this will be a learning experience.)

But I have a backup of my backups -- I was replacing a third mirror today for a drive that I had removed a few months back during another upgrade to my system (along with an OS upgrade).  That drive didn't actually fail, but it was old and had started to accumulate a couple bad sectors, so I figured I might as well just take it out then rather than wait for it to get corrupted or something.  

Anyhow, I still have that old drive, so I figured I could just pop that back into my system and recover the pool data from there.  I'd only be missing the past few months of backup data.  Now, I had never officially exported the pool on that drive or anything.  And I have since upgraded my OS, so I didn't expect it to automatically detect that drive.  (I don't know if it's plugged into the same SATA port or not, as I've moved some drives around.)

But the zpool import command doesn't seem to find anything automatically.  Playing around with some options, zpool import sees the (now destroyed) second version of the backup pool, but that's just the empty pool I accidentally created on two other drives.

Any advice on how I might be able to try to read the data on this third disk?  It was, as far as I can recall, a perfectly functional and up-to-date mirror of the ZFS pool before I pulled it from the case a few months ago.  In particular:

Is the fact that there's a destroyed pool called backup potentially interfering with the ability to detect and try to recover/import this old pool?  Is there a way around that?
I still have the old OS installation on my server that I believe was running when I was using the old disk.  I tried booting into that just to see if it might just detect the ZFS pool, but it didn't.  (Again, the drive may not be plugged in to the same place.)  But are there any ZFS log files or other things that I might be able to pull up that might contain metadata on that old pool or the ID number or something that I could potentially use to force ZFS to import what should be an intact mirror on this drive?
I'm just assuming that my pool on the first two disks was destroyed through the create -f command.  But if anyone has an idea about how I might be able to recover the first pool directly there, that obviously would be great.
Is there any other reason ZFS wouldn't detect the old third mirror as a ZFS pool disk?  If so, any other suggestions?  Other recovery tools I can try?

Thanks for any help or suggestions.

EDIT: Here's the output from zdb -l /dev/sdb1 (which is the third drive)

------------------------------------
LABEL 0
------------------------------------
    version: 5000
    name: 'backup'
    state: 0
    txg: 0
    pool_guid: 3936176493905234028
    errata: 0
    hostid: 8323329
    hostname: [omitted]
    top_guid: 14695910886267065742
    guid: 17986383713788026938
    vdev_children: 1
    vdev_tree:
        type: 'mirror'
        id: 0
        guid: 14695910886267065742
        whole_disk: 0
        metaslab_array: 34
        metaslab_shift: 33
        ashift: 12
        asize: 1000197324800
        is_log: 0
        create_txg: 4
        children[0]:
            type: 'disk'
            id: 0
            guid: 17914838236907067293
            path: '/dev/sdd1'
            whole_disk: 0
            DTL: 143
            create_txg: 4
        children[1]:
            type: 'disk'
            id: 1
            guid: 17986383713788026938
            path: '/dev/sdb1'
            whole_disk: 0
            DTL: 141
        children[2]:
            type: 'disk'
            id: 2
            guid: 1683783279473519399
            path: '/dev/sdc1'
            whole_disk: 0
            DTL: 145
            create_txg: 4
    features_for_read:
        com.delphix:hole_birth
        com.delphix:embedded_data
    create_txg: 0
    labels = 0 1 2 3 

If I'm interpreting this correctly, status 0 means the pool should be intact.  But when I have tried importing even using the pool GUID zpool import 3936176493905234028, I get a "cannot import... no such pool available" error.  (I'm assuming I should use the pool_guid, but I tried using the guid and top_guid too, and nothing appears to work.)

EDIT2: I recovered the zpool.cache file from the original OS that this pool was active on and tried zpool import -c zpool.cache, which gave this:

   pool: backup
     id: 3936176493905234028
  state: UNAVAIL
 status: One or more devices contains corrupted data.
 action: The pool cannot be imported due to damaged devices or data.
   see: http://zfsonlinux.org/msg/ZFS-8000-5E
 config:

    backup      UNAVAIL  insufficient replicas
      mirror-0  UNAVAIL  insufficient replicas
        sdd1    FAULTED  corrupted data
        sdc1    FAULTED  corrupted data

Which is somewhat to be expected.  Those are the two disks where the pool was overwritten by my create command.  However, sdb1 isn't listed as a potential drive there -- probably because I removed it from the pool after I took the disk out.  Nevertheless, I think I have an intact copy of old mirrored data on sdb1, and zdb agrees.  Why won't it import?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 23
- 作者: u/Athanasius

<!-- 处理: 调度员 → 5 阶段 pipeline -->
