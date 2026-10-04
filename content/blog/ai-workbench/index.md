---
id: ai-workbench
title: "AI workbench for cross-team handoffs"
date: 2024-09-12
readTime: 7
tags: workflow, innovation
heroImage: /img/project3.png
heroAlt: "Interface mock-up of an AI workbench connecting Notion and Rhino"
excerpt: "Prototyped a **Notion ↔ Rhino ↔ Azure OpenAI** handoff where prompts inherit project metadata. The assistant drafts test plans, while Grasshopper scripts convert output into CAD-ready curves."
status: published
---

## Workbench anatomy

- Notion serves as the single source of briefs, carrying structured metadata.
- Azure OpenAI receives a *system prompt* infused with that metadata and returns quality-assurance plans.
- A Rhino script parses the plan, creates geometry placeholders, and flags manufacturability risks.

The entire chain caught two manufacturing issues before physical prototypes were produced. Once the Unity showroom is connected, clients will be able to request headset adjustments while the AI logs changes and updates the CAD workflow.

