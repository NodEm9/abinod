const siteHeader = document.querySelector(".site-header");
const nav = siteHeader?.querySelector("nav");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const guideToggle = document.querySelector("[data-guide-toggle]");
const storedTheme = localStorage.getItem("abinod-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
const consentCookieName = "abinod_cookie_consent";
const guideSessionKey = "abinod_guide_shown";

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

function isHomepage() {
  return window.location.pathname === "/" || window.location.pathname === "/index.html";
}

function hasGuideBeenShown() {
  return sessionStorage.getItem(guideSessionKey) === "true";
}

function markGuideShown() {
  sessionStorage.setItem(guideSessionKey, "true");
}

function openGuide(force = false) {
  if (!force && (!isHomepage() || hasGuideBeenShown())) return;
  if (!force) markGuideShown();

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
        <a class="button secondary" href="/products/" data-guide-close>View products</a>
      </div>
    </div>
  `;

  document.body.appendChild(guide);
  document.body.classList.add("guide-open");
  guide.querySelector("[data-guide-close]")?.focus();

  function closeGuide() {
    document.body.classList.remove("guide-open");
    guide.remove();
  }

  guide.addEventListener("click", (event) => {
    if (event.target === guide || event.target.closest("[data-guide-close]")) {
      markGuideShown();
      closeGuide();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && document.body.contains(guide)) {
        markGuideShown();
        closeGuide();
      }
    },
    { once: true },
  );
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function saveCookieConsent(preferences) {
  const value = JSON.stringify({
    ...preferences,
    savedAt: new Date().toISOString(),
  });
  setCookie(consentCookieName, value, 180);
}

function openCookieConsent() {
  if (getCookie(consentCookieName)) return;

  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.setAttribute("aria-labelledby", "cookie-consent-title");
  banner.innerHTML = `
    <div class="cookie-consent-panel" role="dialog" aria-modal="false">
      <div class="cookie-consent-copy">
        <p class="eyebrow">Cookies</p>
        <h2 id="cookie-consent-title">Choose how Abinod uses cookies.</h2>
        <p>
          We use necessary cookies to keep the site working. With your consent,
          we may also use preference and analytics cookies to improve the
          experience.
        </p>
      </div>
      <div class="cookie-preferences" hidden>
        <label>
          <input type="checkbox" checked disabled />
          <span>Necessary cookies</span>
        </label>
        <label>
          <input type="checkbox" name="preferences" />
          <span>Preference cookies</span>
        </label>
        <label>
          <input type="checkbox" name="analytics" />
          <span>Analytics cookies</span>
        </label>
      </div>
      <div class="cookie-actions">
        <button class="button secondary" type="button" data-cookie-reject>Reject all</button>
        <button class="button secondary" type="button" data-cookie-preferences>Set preferences</button>
        <button class="button primary" type="button" data-cookie-accept>Accept all</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add("is-visible"));

  const preferencesPanel = banner.querySelector(".cookie-preferences");
  const preferencesButton = banner.querySelector("[data-cookie-preferences]");

  function closeBanner(preferences) {
    saveCookieConsent(preferences);
    banner.classList.remove("is-visible");
    banner.addEventListener("transitionend", () => banner.remove(), {
      once: true,
    });
  }

  banner.querySelector("[data-cookie-reject]")?.addEventListener("click", () => {
    closeBanner({
      necessary: true,
      preferences: false,
      analytics: false,
    });
  });

  banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    closeBanner({
      necessary: true,
      preferences: true,
      analytics: true,
    });
  });

  preferencesButton?.addEventListener("click", () => {
    if (preferencesPanel.hidden) {
      preferencesPanel.hidden = false;
      preferencesButton.textContent = "Save preferences";
      return;
    }

    closeBanner({
      necessary: true,
      preferences: banner.querySelector("input[name='preferences']")?.checked || false,
      analytics: banner.querySelector("input[name='analytics']")?.checked || false,
    });
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // The site still works without offline caching.
    });
  });
}

function runWhenIdle(callback, timeout = 1600) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }

  window.setTimeout(callback, timeout);
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

registerServiceWorker();
runWhenIdle(openCookieConsent, 900);
runWhenIdle(openGuide, 1800);
