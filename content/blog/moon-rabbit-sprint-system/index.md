---
id: moon-rabbit-sprint-system
title: "Moon Rabbit sprint system for computational footwear"
date: 2024-11-18
readTime: 6
tags: computational-design, workflow
heroImage: /img/project6.png
heroAlt: "Moon Rabbit Adaptive Lab sprint whiteboard with CAD overlays"
excerpt: "Mapped out a **four week sprint** that links athlete scans, CAE feature extraction, and Knitbody prototypes. Highlights include a Rhino.Compute tool for tagging load cases and a Notion API bridge that syncs FEA checkpoints to project management boards."
status: published
---

# Moon Rabbit sprint system for computational footwear

## Why build this now

Parity across biomechanics, CAE, and marketing timelines was the recurring blocker during 2024 launches. The sprint kit keeps athlete footwear briefs tangible even when the team spans Milan, Boston, and Seoul.

## Sprint rails

1. **Week 01 – Data intake**
   - Capture athlete scans + force plate baselines
   - Push metadata into Notion and auto tag video interviews
2. **Week 02 – CAE synthesis**
   - Rhino.Compute definition translates load cases into parametric tags
   - GH Player package exports a *review-ready* viewport bundle for stakeholders
3. **Week 03 – Proto sampling**
   - Knitbody and lattice variants tracked in Airtable; QR reference baked into the print
4. **Week 04 – Shareback**
   - Unity showroom session with volumetric overlays; capturing Loom recaps becomes mandatory

> Every prototype must include a parametric QR referencing the iteration ID + recap link.

## Toolchain callouts

- Azure Functions forward data between WearWorks sensors and Airtable without exposing tokens.
- Zapier automation pings CAE channel when a Loom recap lands, so engineers watch before the stand-up.

Next: anonymize the dataset and publish select benchmarks so future collaborations can benchmark against Moon Rabbit baselines.

