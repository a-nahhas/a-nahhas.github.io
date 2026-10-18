import data from './content.js';

(function () {
  "use strict";

  const root = document.body.dataset.page === "module" ? "../../" : "";
  const ownerInitials = data.owner
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const icons = {
    agents: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="8" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="m9.2 9.3 1.5 5.2m4.1-5.2-1.5 5.2M9.5 8h5"/></svg>',
    learning: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 9 8-4 8 4-8 4-8-4Z"/><path d="M7 11v5.2c2.8 2.4 7.2 2.4 10 0V11m3-2v6"/></svg>',
    arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg>'
  };

  function renderHeader() {
    document.getElementById("site-header").innerHTML = `
      <header class="site-header shell">
        <a class="brand" href="${root}index.html" aria-label="Go to the portfolio overview">
          <span class="brand-mark" aria-hidden="true">${ownerInitials}</span>
          <span class="brand-name">${data.owner} <span class="muted">· E-portfolio</span></span>
        </a>
        <nav class="site-nav" aria-label="Primary navigation">
          <a href="${root}index.html#modules">Work</a>
        </nav>
      </header>`;
  }

  function renderFooter() {
    document.getElementById("site-footer").innerHTML = `
      <footer class="site-footer shell">
        <p>© ${new Date().getFullYear()} ${data.owner} · Academic e-portfolio</p>
        <p class="footer-status">${data.program.university}</p>
      </footer>`;
  }

  function renderHome() {
    document.getElementById("hero-title").textContent = data.owner;
    document.getElementById("hero-role").textContent = data.program.role;
    document.getElementById("hero-summary").textContent = data.program.summary;
    document.getElementById("profile-name").textContent = data.owner;
    document.getElementById("profile-program").textContent = data.program.shortName;
    document.getElementById("profile-facts").innerHTML = `
      <div><dt>University</dt><dd>${data.program.university}</dd></div>
      <div><dt>Study mode</dt><dd>${data.program.mode}</dd></div>
      <div><dt>Status</dt><dd><span class="status-dot" aria-hidden="true"></span>${data.program.status}</dd></div>`;
    document.getElementById("module-list").innerHTML = data.modules.map((module) => `
      <a class="module-link" href="modules/${module.slug}/" style="--module-gradient: ${module.accent}">
        <span class="module-icon">${icons[module.icon]}</span>
        <span class="module-copy">
          <span class="module-term">${module.term}</span>
          <h3>${module.title}</h3>
          <p>${module.description}</p>
          <span class="module-action">View module portfolio</span>
        </span>
        <span class="module-arrow" aria-hidden="true">${icons.arrow}</span>
      </a>`).join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderEntryBody(item) {
    const intro = item.text ? `<p class="entry-intro">${escapeHtml(item.text)}</p>` : "";
    const sections = (item.sections || []).map((section) => `
      <section class="entry-section">
        ${section.heading ? `<h3>${escapeHtml(section.heading)}</h3>` : ""}
        ${section.meta ? `<p class="entry-meta">${escapeHtml(section.meta)}</p>` : ""}
        ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        ${section.code ? `<pre class="entry-code"><code>${escapeHtml(section.code)}</code></pre>` : ""}
        ${(section.figures || []).map((figure) => `
          <figure class="entry-figure">
            <img src="${escapeHtml(figure.src)}" alt="${escapeHtml(figure.alt)}" loading="lazy">
            ${figure.caption ? `<figcaption>${escapeHtml(figure.caption)}</figcaption>` : ""}
          </figure>`).join("")}
        ${(section.links || []).map((link) => `
          <a class="entry-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener">${escapeHtml(link.label)}${icons.arrow}</a>`).join("")}
      </section>`).join("");
    const references = item.references?.length ? `
      <section class="entry-section entry-references">
        <h3>References</h3>
        <ul>${item.references.map((reference) => `<li>${escapeHtml(reference)}</li>`).join("")}</ul>
      </section>` : "";
    return intro + sections + references;
  }

  function renderModule() {
    const slug = document.body.dataset.module;
    const module = data.modules.find((item) => item.slug === slug);
    if (!module) return;

    const pages = module.journal.flatMap((item, index) => {
      const number = String(index + 1).padStart(2, "0");
      return [
        { item, number, depth: 0, group: index },
        ...(item.children || []).map((child, childIndex) => ({
          item: child,
          number: `${number}.${childIndex + 1}`,
          depth: 1,
          group: index,
          parent: item,
        })),
      ];
    });

    document.title = `${module.title} · ${data.program.shortName}`;
    document.querySelector('meta[name="description"]').setAttribute("content", module.description);
    document.getElementById("module-content").innerHTML = `
      <div class="breadcrumb">
        <a href="../../index.html">Portfolio</a>${icons.arrow}
        <a href="../../index.html#modules">Modules</a>${icons.arrow}
        <span>${module.title}</span>
      </div>
      <section class="detail-hero" aria-labelledby="module-title">
        <span class="module-icon" style="--module-gradient: ${module.accent}">${icons[module.icon]}</span>
        <div>
          <p class="section-label">${module.term} · ${data.program.university}</p>
          <h1 id="module-title">${module.title}</h1>
        </div>
      </section>
      <div class="portfolio-browser">
        <aside class="entry-sidebar" aria-labelledby="entries-title">
          <p class="section-label" id="entries-title">Entries</p>
          <div class="journal-list" role="tablist" aria-label="${module.title} portfolio entries" aria-orientation="vertical">
            ${pages.map((page, index) => `
              <button
                class="entry-tab${page.depth ? " entry-tab-child" : ""}"
                id="entry-tab-${index}"
                type="button"
                role="tab"
                aria-controls="selected-entry"
                aria-selected="${index === 0}"
                tabindex="${index === 0 ? "0" : "-1"}"
                data-entry-index="${index}"
              >
                <span class="entry-number">${page.number}</span>
                <span>${escapeHtml(page.item.label)}</span>
              </button>`).join("")}
          </div>
        </aside>
        <section class="content-panel entry-panel" id="selected-entry" role="tabpanel" aria-labelledby="entry-tab-0" tabindex="0">
          <p class="section-label" id="entry-position"></p>
          <h2 id="entry-title"></h2>
          <div class="entry-body" id="entry-body"></div>
        </section>
      </div>
      <a class="back-link" href="../../index.html#modules">${icons.arrow} Back to all modules</a>`;

    const entryTabs = Array.from(document.querySelectorAll(".entry-tab"));
    const entryPanel = document.getElementById("selected-entry");
    const entrySidebar = document.querySelector(".entry-sidebar");
    const entryPosition = document.getElementById("entry-position");
    const entryTitle = document.getElementById("entry-title");
    const entryBody = document.getElementById("entry-body");

    // After switching entries from far down the page, bring the top of the new
    // entry back into view (below the sticky sidebar strip on narrow screens,
    // where it sits above the panel).
    function revealPanel() {
      const sidebar = entrySidebar.getBoundingClientRect();
      const panel = entryPanel.getBoundingClientRect();
      const stacked = sidebar.right > panel.left;
      const visibleTop = (stacked ? sidebar.bottom : 0) + 16;
      if (panel.top < visibleTop) window.scrollBy({ top: panel.top - visibleTop });
    }

    // On narrow screens the entry list is a horizontal strip: scroll only the
    // strip so the selected tab stays in view. Aligning to its start matches
    // the strip's scroll-snap points.
    function keepTabVisible(tab) {
      const list = tab.parentElement;
      const listBox = list.getBoundingClientRect();
      const tabBox = tab.getBoundingClientRect();
      if (tabBox.left < listBox.left || tabBox.right > listBox.right) list.scrollLeft += tabBox.left - listBox.left;
    }

    function selectEntry(index, moveFocus = false) {
      const page = pages[index];
      const selectedTab = entryTabs[index];
      if (!page || !selectedTab) return;

      // Sub-entries are listed only under the open entry, which keeps the
      // sidebar short enough to fit on screen without its own scrollbar.
      entryTabs.forEach((tab, tabIndex) => {
        const isSelected = tabIndex === index;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        tab.hidden = pages[tabIndex].depth > 0 && pages[tabIndex].group !== page.group;
      });

      entryPanel.setAttribute("aria-labelledby", selectedTab.id);
      entryPosition.textContent = page.parent
        ? `Entry ${page.number} · ${page.parent.label}`
        : `Entry ${Number(page.number)} of ${module.journal.length}`;
      entryTitle.textContent = page.item.label;
      entryBody.innerHTML = renderEntryBody(page.item);
      if (moveFocus) selectedTab.focus();
      keepTabVisible(selectedTab);
    }

    entryTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        selectEntry(index);
        revealPanel();
      });
      tab.addEventListener("keydown", (event) => {
        const visible = entryTabs.filter((item) => !item.hidden);
        const position = visible.indexOf(tab);
        const last = visible.length - 1;
        let next;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = visible[position === last ? 0 : position + 1];
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = visible[position === 0 ? last : position - 1];
        if (event.key === "Home") next = visible[0];
        if (event.key === "End") next = visible[last];
        if (!next) return;

        event.preventDefault();
        selectEntry(entryTabs.indexOf(next), true);
        revealPanel();
      });
    });

    selectEntry(0);
  }

  renderHeader();
  renderFooter();
  if (document.body.dataset.page === "home") renderHome();
  if (document.body.dataset.page === "module") renderModule();
})();
