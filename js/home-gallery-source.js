// Keeps the "Sul campo" strip on the homepage showing the most recent
// photos automatically: pulls the first 8 images (document order = most
// recent event-block first, matching the site's own "most recent first"
// convention) straight from media.html's galleries. Add a new event block
// at the top of media.html and this strip picks it up on its own — no
// need to touch the homepage separately.
//
// Runs after gallery-strip.js (script order in index.html), so the strip's
// 8 original <img> + 8 aria-hidden clones already exist by the time this
// fires; it only swaps their src/alt in place, it doesn't touch layout,
// measurements or the running animation at all.
(function () {
  const strip = document.getElementById('gallery-strip');
  if (!strip) return;

  async function loadLatestPhotos() {
    try {
      const res = await fetch('media.html', { cache: 'no-store' });
      if (!res.ok) return;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const imgs = Array.from(doc.querySelectorAll('.gallery-grid .gallery-item img')).slice(0, 8);
      if (imgs.length < 8) return; // not enough content yet — keep the static fallback images

      const originals = Array.from(strip.querySelectorAll('img:not([aria-hidden])'));
      const clones = Array.from(strip.querySelectorAll('img[aria-hidden]'));
      if (originals.length !== 8 || clones.length !== 8) return; // strip wasn't set up as expected

      imgs.forEach((img, i) => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        if (!src) return;
        originals[i].src = src;
        originals[i].alt = alt;
        clones[i].src = src;
      });
    } catch (e) {
      // Fetch unavailable (e.g. opened as a local file:// page) or a
      // network hiccup: the static fallback photos already in the HTML
      // stay put.
    }
  }

  document.addEventListener('DOMContentLoaded', loadLatestPhotos);
})();
