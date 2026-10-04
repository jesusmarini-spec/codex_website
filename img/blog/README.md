# Blog Images

Create one folder per article using the article ID:

```text
img/blog/article-id/hero.webp
img/blog/article-id/process-01.webp
```

Use lowercase, hyphenated filenames. Keep hero images near 1600 × 900 pixels
and optimize raster images before publishing.

- Prefer WebP or AVIF for photographs and rendered images.
- Aim for hero images below 350 KB and inline images below 300 KB.
- Write descriptive alt text in article Markdown or HTML.
- Add `loading="lazy"` to inline HTML images below the opening section.
- Run `cmd /c npm run content:validate` after adding or renaming files.
