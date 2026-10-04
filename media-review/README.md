# Unused Media Review

The `unused/` directory contains media that is not referenced by the current
website source, blog content, styles, or runtime data.

Files retain their original path below `unused/`. For example:

```text
unused/img/Project9/example.png
```

was originally:

```text
img/Project9/example.png
```

Review the generated `UNUSED_MEDIA_MANIFEST.txt` before deleting anything.
To restore a file, move it from `unused/` back to its original path shown in
the manifest, then run `cmd /c npm run build`.
