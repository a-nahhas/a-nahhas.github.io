# E-portfolio

A lightweight, dependency-free e-portfolio prepared for GitHub Pages. The site
currently contains placeholder content only.

## Preview locally

From the repository root, start any static file server. For example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Add portfolio content

1. Replace the bracketed copy in `index.html`.
2. Update the page title and description in the `<head>`.
3. Replace the placeholder links and profile image panel.
4. Remove the `noindex` robots meta tag when the portfolio is ready to be
   discoverable.

## Publish

The workflow in `.github/workflows/pages.yml` deploys the site whenever a commit
is pushed to `main`. In the repository settings, set **Pages → Build and
deployment → Source** to **GitHub Actions** once. Future pushes will deploy
automatically.
