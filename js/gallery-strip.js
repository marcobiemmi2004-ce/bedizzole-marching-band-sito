// "Sul campo" photo strip: drifts continuously to the right, looping forever
// (the image set is duplicated once so the loop is seamless). Dots jump to a
// specific photo, arrows jump a whole visible block — both pause the drift
// briefly, then it resumes on its own from wherever it was left.
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('.gallery-strip-viewport');
  const strip = document.getElementById('gallery-strip');
  const dotsWrap = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!viewport || !strip || !dotsWrap) return;

  const originals = Array.from(strip.children);
  const dots = Array.from(dotsWrap.children);
  if (!originals.length || originals.length !== dots.length) return;

  // Duplicate the set once so the strip can loop with no visible seam.
  originals.forEach((img) => {
    const clone = img.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.alt = '';
    strip.appendChild(clone);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 26; // px per second — slow, ambient drift
  const count = originals.length;
  let pos = 0;      // drives the loop; wraps every W
  let W = 0;         // width of one full image set (px)
  let step = 0;        // width of a single image + gap (px)
  let paused = false;
  let resumeTimer = null;
  let lastTime = null;

  function measure() {
    const gap = parseFloat(getComputedStyle(strip).gap) || 0;
    step = originals[0].getBoundingClientRect().width + gap;
    W = step * count;
  }

  function apply() {
    const t = ((pos % W) + W) % W;
    strip.style.transform = `translateX(${t - W}px)`;
  }

  function currentIndex() {
    const t = ((pos % W) + W) % W;
    return Math.round((W - t) / step) % count;
  }

  function updateActiveDot() {
    const idx = currentIndex();
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }

  function visibleCount() {
    return Math.max(1, Math.round(viewport.clientWidth / step));
  }

  function pauseThenResume() {
    paused = true;
    if (resumeTimer) window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => { paused = false; }, 2600);
  }

  function goToIndex(index, animate) {
    const target = ((index % count) + count) % count;
    pos = W - target * step;
    strip.style.transition = animate ? 'transform .6s cubic-bezier(.65,0,.35,1)' : 'none';
    apply();
    updateActiveDot();
    if (animate) {
      window.setTimeout(() => { strip.style.transition = 'none'; }, 650);
    }
    pauseThenResume();
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goToIndex(i, true)));
  if (prevBtn) prevBtn.addEventListener('click', () => goToIndex(currentIndex() - visibleCount(), true));
  if (nextBtn) nextBtn.addEventListener('click', () => goToIndex(currentIndex() + visibleCount(), true));

  window.addEventListener('resize', () => { measure(); apply(); });

  measure();
  pos = W;
  apply();
  updateActiveDot();

  if (reduceMotion) return; // keep manual controls, skip the ambient motion

  function frame(time) {
    if (lastTime === null) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    if (!paused) {
      pos += SPEED * dt;
      apply();
      updateActiveDot();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
});
