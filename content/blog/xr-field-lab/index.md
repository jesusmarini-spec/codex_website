---
id: xr-field-lab
title: "XR field lab for footwear testing"
date: 2024-08-19
readTime: 8
tags: innovation, computational-design
heroImage: /img/project7.png
heroAlt: "XR footwear prototype being tested on a field"
excerpt: "Brought a mobile XR rig to the track so athletes could inspect stress maps in context. The workflow combines process photography, CAE output, and Unity visualization."
status: published
---

# XR field lab recap

We transformed a pop-up tent into an XR lab so athletes could review computational insights without leaving the track.

![Mobile rig on the track](/img/Project7/7port-1.png)

## Capture loop

1. Scan the foot and shoe combination with a mobile lidar rig.
2. Run the CAE script on site to produce the pressure heat map.
3. Visualize the results through a Unity WebGL viewer running on a tablet.

<figure>
  <img src="/img/project6.png" alt="CAE heat map overlay displayed in the Unity viewer">
  <figcaption>Inline CAE overlay pushed to the Unity viewer.</figcaption>
</figure>

The Unity scene mirrors the one embedded on the site, so the same assets support field tests and remote reviews.

![XR scene overview](/img/project10.png)

## Notes

- A battery pack and 5G router kept the rig live for four hours.
- QR stickers on each prototype open the article view so teammates can revisit the context later.

