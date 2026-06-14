const siteHeader = document.querySelector(".site-header");
const nav = siteHeader?.querySelector("nav");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const guideToggle = document.querySelector("[data-guide-toggle]");
const storedTheme = localStorage.getItem("abinod-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("abinod-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  }
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function openGuide(force = false) {
  if (!force && localStorage.getItem("abinod-guide-seen") === "true") return;

  const guide = document.createElement("div");
  guide.className = "site-guide";
  guide.innerHTML = `
    <div class="site-guide-panel" role="dialog" aria-modal="true" aria-labelledby="site-guide-title">
      <p class="eyebrow">Welcome</p>
      <h2 id="site-guide-title">A quick guide to Abinod</h2>
      <div class="site-guide-steps">
        <div>
          <strong>1. Start with Products</strong>
          <span>See Ambiten and the future product direction.</span>
        </div>
        <div>
          <strong>2. Explore the company</strong>
          <span>Read About, Founder, Mission, and Brand Essence for the Abinod story.</span>
        </div>
        <div>
          <strong>3. Follow the writing</strong>
          <span>Use Blog for essays and Contact when you want to start a conversation.</span>
        </div>
      </div>
      <div class="site-guide-actions">
        <button class="button primary" type="button" data-guide-close>Start exploring</button>
        <a class="button secondary" href="/products/">View products</a>
      </div>
    </div>
  `;

  document.body.appendChild(guide);
  document.body.classList.add("guide-open");
  guide.querySelector("[data-guide-close]")?.focus();

  function closeGuide() {
    localStorage.setItem("abinod-guide-seen", "true");
    document.body.classList.remove("guide-open");
    guide.remove();
  }

  guide.addEventListener("click", (event) => {
    if (event.target === guide || event.target.closest("[data-guide-close]")) {
      closeGuide();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && document.body.contains(guide)) closeGuide();
    },
    { once: true },
  );
}

applyTheme(initialTheme);

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) closeMenu();
});

themeToggle?.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

guideToggle?.addEventListener("click", () => openGuide(true));

openGuide();
