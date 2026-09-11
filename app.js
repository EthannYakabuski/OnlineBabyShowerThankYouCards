const app = document.getElementById("app");
// The script lives at the site root, including on GitHub project Pages.
// Read this while the script is executing; document.currentScript is null later.
const siteBaseUrl = new URL(".", document.currentScript.src);

function getPersonSlug() {
  const relativePath = window.location.pathname.slice(siteBaseUrl.pathname.length);
  const slug = relativePath.replace(/\/+$/, "");

  return normalizeSlug(!slug || slug === "index.html" || slug === "404.html" ? "default" : slug);
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/%20/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getEntry() {
  const slug = getPersonSlug();
  const allEntries = window.THANK_YOUS || {};

  const builtInDefault = {
    displayName: "Friend",
    gift: "your thoughtful gift",
    note: "Thank you for your thoughtful gift and for celebrating our growing family. Your kindness means so much to us.",
    signature: "With love, Your family",
    photos: []
  };

  const exactEntry = Object.prototype.hasOwnProperty.call(allEntries, slug) ? allEntries[slug] : null;
  const defaultEntry = Object.prototype.hasOwnProperty.call(allEntries, "default") ? allEntries.default : builtInDefault;
  const entry = exactEntry || defaultEntry || builtInDefault;

  return { slug, entry, isFallback: !exactEntry };
}

function assetUrl(path) {
  const raw = String(path || "");

  // Leave full URLs, root-relative paths, hash links, and data URLs alone.
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("/") || raw.startsWith("#") || raw.startsWith("data:")) {
    return raw;
  }

  return new URL(raw, siteBaseUrl).href;
}

function photoCardHtml(photo, index) {
  const imageSrc = escapeHtml(assetUrl(photo.src));
  const alt = escapeHtml(photo.alt || "Baby photo");
  const captionFront = escapeHtml(photo.captionFront || `Photo ${index + 1}`);
  const captionBack = escapeHtml(photo.captionBack || "Thank you for being part of our story.");

  return `
    <article class="flip-card" tabindex="0" aria-label="Photo card ${index + 1}. Hover, tap, or focus to flip.">
      <div class="card-heart-burst" aria-hidden="true"></div>
	  <div class="flip-card-inner">
        <div class="flip-card-face flip-card-front">
          <div class="photo-frame">
            <img src="${imageSrc}" alt="${alt}" onerror="this.closest('.photo-frame').classList.add('missing-photo'); this.remove();" />
          </div>
          <p>${captionFront}</p>
        </div>
        <div class="flip-card-face flip-card-back">
          <span class="tiny-bow">🎀</span>
          <p>${captionBack}</p>
        </div>
      </div>
    </article>
  `;
}

function render() {
  const { slug, entry, isFallback } = getEntry();
  const name = entry.displayName || slug;
  const displayName = escapeHtml(name);
  const gift = escapeHtml(entry.gift || "your thoughtful gift");
  const note = escapeHtml(entry.note || "Thank you so much for celebrating with us.");
  const signature = escapeHtml(entry.signature || "With love");
  const photos = Array.isArray(entry.photos) ? entry.photos : [];

  document.title = `Thank You, ${name} 💕`;

  app.innerHTML = `
    <section class="hero-card reveal">
      <div class="ribbon">Baby Shower Thank You</div>

      <header class="thank-you-header">
        <p class="eyebrow">A little note from our growing family</p>
        <h1>Thank you, <span>${displayName}</span></h1>
        <div class="sparkle-line" aria-hidden="true">✦ ♡ ✦</div>
      </header>

      <section class="message-card">
        <p class="gift-line">For <strong>${gift}</strong></p>
        <p>${note}</p>
        <p class="signature">${signature}</p>
      </section>

      ${photos.length ? `<section class="photo-section" aria-labelledby="photo-heading">
        <h2 id="photo-heading">A few sweet moments</h2>
        <p class="hint">Hover, tap, or tab onto each card to reveal a photo.</p>
        <div class="photo-grid">
          ${photos.map(photoCardHtml).join("")}
        </div>
      </section>` : ""}

      ${isFallback ? `
        <aside class="setup-warning">
          <strong>Setup note:</strong> No custom entry was found for <code>${escapeHtml(slug)}</code>, so the default note is showing.
          Add a <code>${escapeHtml(slug)}</code> entry in <code>thank-yous.js</code> to personalize this page.
        </aside>
      ` : ""}
    </section>
  `;

  setupCardHeartBursts();
}

function setupHeartButton() {
  const button = document.querySelector(".heart-button");
  const burst = document.querySelector(".heart-burst");
  if (!button || !burst) return;

  button.addEventListener("click", () => {
    burst.innerHTML = "";

    for (let i = 0; i < 14; i += 1) {
      const heart = document.createElement("span");
      heart.textContent = ["♡", "💕", "✦", "🎀"][i % 4];
      heart.style.setProperty("--x", `${Math.random() * 220 - 110}px`);
      heart.style.setProperty("--y", `${Math.random() * -180 - 40}px`);
      heart.style.setProperty("--r", `${Math.random() * 80 - 40}deg`);
      heart.style.animationDelay = `${Math.random() * 0.12}s`;
      burst.appendChild(heart);
    }
  });
}

function setupCardHeartBursts() {
  const cards = document.querySelectorAll(".flip-card");

  cards.forEach((card) => {
    const burst = card.querySelector(".card-heart-burst");
    if (!burst) return;

    let lastBurstAt = 0;

    function playBurst() {
      const now = Date.now();

      // Prevent the animation from spam-firing repeatedly while hovering/focusing.
      if (now - lastBurstAt < 900) return;
      lastBurstAt = now;

      burst.innerHTML = "";

      for (let i = 0; i < 14; i += 1) {
        const heart = document.createElement("span");
        heart.textContent = ["♡", "💕", "✦", "🎀"][i % 4];
        heart.style.setProperty("--x", `${Math.random() * 220 - 110}px`);
        heart.style.setProperty("--y", `${Math.random() * -180 - 40}px`);
        heart.style.setProperty("--r", `${Math.random() * 80 - 40}deg`);
        heart.style.animationDelay = `${Math.random() * 0.12}s`;
        burst.appendChild(heart);
      }
    }

    card.addEventListener("mouseenter", playBurst);
    card.addEventListener("focus", playBurst);
    card.addEventListener("click", playBurst);
    card.addEventListener("touchstart", playBurst, { passive: true });
  });
}

if (!app) {
  console.error('Could not find <main id="app"></main>. Make sure index.html has an element with id="app".');
} else {
  render();
}
