---
date: 2019-08-12
source: se
source_detail: "se post superuser_1470331 by u/TrueCP5"
url: "https://superuser.com/questions/1470331/injecting-360-video-metadata-with-ffmpeg"
topic: "Injecting 360 video metadata with ffmpeg"
author: TrueCP5
engagement: 54
created_utc: 2019-08-12T09:56:13Z
pain_keywords: ["\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Injecting 360 video metadata with ffmpeg

> **Source**: https://superuser.com/questions/1470331/injecting-360-video-metadata-with-ffmpeg

## 原始内容

I'm working on a library that injects/embeds/writes metadata into a .mp4 file to allow the video to be displayed correctly as a 360 video. The input file is a standard .mp4 file in the equirectangular format which I need to inject the proper metadata to get it to display as a 360 video. I know tools like Google's Spatial Media Tool exist but if possible I would like to do it with ffmpeg.

This is what I have tried already but it does not work: 

ffmpeg -i input.mp4 -movflags use_metadata_tags -metadata Spherical=true -metadata Stitched=true -metadata ProjectionType=equirectangular -metadata StitchingSoftware=StreetviewJourney -codec copy output.mp4

I have tried many variations of it like adding GSpherical: and xmp: to the metadata tag.

The metadata injected by the Spatial Media tool looks like this and is what I am trying to achieve: 

<?xml version="1.0"?><rdf:SphericalVideo
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
xmlns:GSpherical="http://ns.google.com/videos/1.0/spherical/"><GSpherical:Spherical>true</GSpherical:Spherical><GSpherical:Stitched>true</GSpherical:Stitched><GSpherical:StitchingSoftware>Spherical Metadata Tool</GSpherical:StitchingSoftware><GSpherical:ProjectionType>equirectangular</GSpherical:ProjectionType></rdf:SphericalVideo>

Edit 1

When I extract the metadata using ffmpeg it contains the spherical tag in the logs but not when I output it to a ffmetadata file. This was the command I used: ffmpeg -i injected.mp4 -map_metadata -1 -f ffmetadata data.txt

This is the output of the log:

 fps, 60 tbr, 15360 tbn, 120 tbc (default)
    Metadata:
      handler_name    : VideoHandler
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000)

Edit 2

I also tried to get the metadata using this command: ffprobe -v error -select_streams v:0 -show_streams -of default=noprint_wrappers=1 injected.mp4

This was the logs it outputted:

TAG:handler_name=VideoHandler
side_data_type=Spherical Mapping
projection=equirectangular
yaw=0
pitch=0
roll=0

I then tried to use this command but it didn't work: ffmpeg -i chapmanspeak.mp4 -movflags use_metadata_tags -metadata side_metadata_type="Spherical Mapping" -metadata projection=equirectangular -metadata yaw=0 -metadata pitch=0 -metadata roll=0 -codec copy output.mp4

## 自动提取的痛点信号

- 命中关键词: \btried .{1,40}? but\b
- 互动度: 54
- 作者: u/TrueCP5

<!-- 处理: 调度员 → 5 阶段 pipeline -->
