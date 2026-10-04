# Copy Review Checklist

Use this checklist for landing-page, About, project, and blog updates.

## Meaning

- Confirm names, dates, employers, tools, and project outcomes are accurate.
- Separate personal experience from Moon Rabbit Lab company claims.
- Remove outdated availability statements and temporary dates.
- Make sure every CTA leads to the intended page.

## Grammar and style

- Use one language consistently within each page.
- Prefer active voice and short sentences.
- Keep capitalization consistent: computational design, design engineering, Moon Rabbit Lab.
- Use `CAE`, `FEA`, `XR`, `AR`, and `VR` consistently.
- Avoid repeated words such as “innovation,” “experience,” and “design” in adjacent sentences.
- Check apostrophes, plural forms, and punctuation.
- Replace placeholder text such as `TODO`, `TBD`, or `<replace this>`.

## Images and accessibility

- Every meaningful image has accurate alternative text.
- Decorative images use `alt=""`.
- Captions explain the relevance of process images.
- New images are compressed and display correctly on mobile.
- Logos remain readable on their background color.

## Blog metadata

- `id` matches the article folder name.
- `date` uses `YYYY-MM-DD`.
- `readTime` is a positive whole number.
- `tags` use lowercase hyphenated terms.
- `heroImage` exists and begins with `/img/`.
- `heroAlt` describes the image rather than repeating the title.
- `excerpt` works as a short preview without needing the full article.
- `status` is `published` only when the article is ready.

## Final checks

```powershell
cmd /c npm run content:validate
cmd /c npm run build
```

Then review the landing page, blog index, article page, About page, and any changed project page at desktop and mobile widths.

