(function () {
  "use strict";

  const data = window.PORTFOLIO_CONTENT;
  if (!data) return;

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
        <p class="footer-status"><span class="status-dot" aria-hidden="true"></span>${data.program.status} · ${data.program.university}</p>
      </footer>`;
  }

  function renderHome() {
    document.getElementById("hero-title").textContent = data.owner;
    document.getElementById("hero-role").textContent = data.program.role;
    document.getElementById("hero-summary").textContent = data.program.summary;
    document.getElementById("profile-monogram").textContent = ownerInitials;
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

  function renderModule() {
    const slug = document.body.dataset.module;
    const module = data.modules.find((item) => item.slug === slug);
    if (!module) return;

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
          <p>${module.description}</p>
          <div class="detail-meta"><span>${data.program.shortName}</span><span>${data.program.status}</span><span>Academic e-portfolio</span></div>
        </div>
      </section>
      <div class="detail-grid">
        <section class="content-panel" aria-labelledby="overview-title">
          <p class="section-label">Module overview</p>
          <h2 id="overview-title">What this module covers</h2>
          <p>${module.overview}</p>
          <ul class="topic-list">${module.topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
        </section>
        <aside class="panel-stack" aria-label="Module portfolio sections">
          <section class="content-panel">
            <p class="section-label">Portfolio</p>
            <h2>Learning record</h2>
            <div class="journal-list">${module.journal.map((item) => `<div class="journal-item"><span>${item.label}</span><p>${item.text}</p></div>`).join("")}</div>
          </section>
          <section class="content-panel">
            <p class="section-label">Status</p>
            <h2>In progress</h2>
            <p>This page will be updated with notes, reflections, and assessments as the module progresses.</p>
          </section>
        </aside>
      </div>
      <a class="back-link" href="../../index.html#modules">${icons.arrow} Back to all modules</a>`;
  }

  renderHeader();
  renderFooter();
  if (document.body.dataset.page === "home") renderHome();
  if (document.body.dataset.page === "module") renderModule();
})();
