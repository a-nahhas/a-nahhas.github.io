# AI MSc portfolio

An academic e-portfolio for the MSc in Artificial Intelligence at the
University of Essex. Its visual design uses Raycast as a reference for colour,
typography, and interface details. The site is dependency-free and deploys
directly to GitHub Pages.

## Edit the content

Each portfolio entry has its own file in the [`entries`](entries) folder. The
folders and numbered filenames match the modules and the order shown on the
site. Open an entry file and update its `label` or `text` values.

An entry can also have `sections` (each with an optional `heading`, `meta`,
`paragraphs`, `code`, `figures` and `links`), a `references` list, and
`children`: sub-entries with the same shape, shown indented beneath their parent
in the sidebar (numbered 01.1, 01.2 and so on).

General portfolio wording lives in [`content.js`](content.js):

- Update `owner` to change the name in the header and footer.
- Update `program` to change the homepage introduction and programme details.
- Update either item in `modules` to change a module's title, summary, topics,
  and visual accent.

The visual styles live in `styles.css`. The page structure and reusable module
renderer live in `index.html` and `app.js`.

## Add another module

1. Copy a full module object in `content.js` and give it a new, unique `slug`.
2. Create a matching folder in `entries/`, add one file per portfolio entry,
   then import those files at the top of `content.js` and list them in the
   module's `journal` array.
3. Copy either folder inside `modules/` and rename the new folder to match the
   slug.
4. In the copied `index.html`, update `data-module` to the same slug and change
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
