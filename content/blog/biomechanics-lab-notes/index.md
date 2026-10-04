---
id: biomechanics-lab-notes
title: "Biomechanics lab notes from Milan running sessions"
date: 2024-10-02
readTime: 4
tags: biomechanics, innovation
heroImage: /img/project1.png
heroAlt: "Biomechanics heat map overlay on a basketball shoe"
excerpt: "Captured dual force plate sessions with a **custom Python logger** and streamed them to a Grasshopper definition that suggests midsole lattice edits. Posting the workflow here before it graduates into a polished case study."
status: published
---

Two set-ups ran concurrently: a dual force-plate runway and a motion-capture rig pointed at the ankle complex. A Python logger built on `bleak` streamed raw IMU packets into Rhino inside of 300 milliseconds.

## Highlights

- Sharing raw curves inside a touch UI let athletes annotate peaks themselves—faster than post-session surveys.
- A clash-detection script compared orthotics against upcoming uppers, reducing resample loops by one full sprint.
- Captured **111 GB** of volumetric data. Compressing via Draco maintained enough fidelity for Unity visualization in Quest headsets.

The full case study will be published after the partner's legal review, so this article is the interim update.

