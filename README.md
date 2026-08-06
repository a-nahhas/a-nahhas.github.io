# AI MSc portfolio

An academic e-portfolio for the MSc in Artificial Intelligence at the
University of Essex. Its visual design uses Raycast as a reference for colour,
typography, and interface details. The site is dependency-free and deploys
directly to GitHub Pages.

## Edit the content

Nearly all editable wording lives in [`content.js`](content.js):

- Update `owner` to change the name in the header and footer.
- Update `program` to change the homepage introduction and programme details.
- Update either item in `modules` to change a module's title, summary, topics,
  learning journal, and visual accent.

The visual styles live in `styles.css`. The page structure and reusable module
renderer live in `index.html` and `app.js`.

## Add another module

1. Copy a full module object in `content.js` and give it a new, unique `slug`.
2. Copy either folder inside `modules/` and rename the new folder to match the
   slug.
3. In the copied `index.html`, update `data-module` to the same slug and change
   the fallback page title and description.

## Preview locally

Install the local preview dependency once:

```powershell
npm install
```

Then start the site:

```powershell
npm run dev
```

Open `http://localhost:8000` and press `Ctrl+C` when you are finished.

## Publish

The workflow in `.github/workflows/pages.yml` deploys the site whenever a commit
is pushed to `main`. In the repository settings, set **Pages → Build and
deployment → Source** to **GitHub Actions** once.
