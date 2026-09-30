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
  let transitioning = false; // true only while a goToIndex CSS transition is actively running

  function measure() {
    const gap = parseFloat(getComputedStyle(strip).gap) || 0;
    step = originals[0].getBoundingClientRect().width + gap;
    W = step * count;
  }

  // No modulo here on purpose: pos is kept within one loop's worth of
  // positions by goToIndex and frame() below (see their own comments), so
  // this is a direct, continuous mapping. That matters for goToIndex —
  // with a modulo here, index 0's canonical position (pos === W) would
  // always collapse to the same transform regardless of which "copy" was
  // chosen as the nearest one, turning what should be a short hop to a
  // neighbouring photo into a jump across almost the entire strip.
  function apply() {
    strip.style.transform = `translateX(${pos - W}px)`;
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
    // Safety net: pos can already be outside the range that has valid
    // rendered content if this click lands while a previous click's CSS
    // transition is still running — frame()'s own rewrap deliberately
    // skips that window (see the comment there), so quick repeated clicks
    // (well within human reach, e.g. clicking an arrow 4-5 times to jump
    // back further) can otherwise let pos drift past the edge before it
    // ever gets a turn. Normalize it first, instantly (no transition —
    // if pos was already out of range, whatever's currently on screen is
    // already blank/wrong, so this can only fix that, never introduce a
    // jump from a correct state). Everything below then starts its "which
    // copy is nearest" math from a known-good position.
    if (pos < 0 || pos >= W) {
      pos = ((pos % W) + W) % W;
      strip.style.transition = 'none';
      apply();
    }
    const target = ((index % count) + count) % count;
    // W - target*step is *a* position that shows the right photo, but it's
    // just one of infinitely many (every multiple of W away looks the
    // same). Pick whichever copy sits closest to where we are right now,
    // so the animated move is always a short hop to the next/previous
    // photo instead of occasionally sweeping across almost the whole loop.
    let newPos = W - target * step;
    newPos -= Math.round((newPos - pos) / W) * W;
    pos = newPos;
    strip.style.transition = animate ? 'transform .6s cubic-bezier(.65,0,.35,1)' : 'none';
    apply();
    updateActiveDot();
    if (animate) {
      transitioning = true;
      window.setTimeout(() => { strip.style.transition = 'none'; transitioning = false; }, 650);
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
    }
    // Keep pos within one loop's worth of positions ([0, W)). This must run
    // every frame regardless of `paused` — not just while drifting — or
    // repeated quick clicks (arrows/dots) can let pos wander arbitrarily
    // far: each click pauses the drift for ~2.6s via pauseThenResume, so if
    // clicks land closer together than that, this correction never used to
    // get a turn between them, and goToIndex's own snapping only ever
    // adjusts *relative* to the current (possibly already out-of-range)
    // pos — it never bounds pos itself. Left unchecked, the strip eventually
    // scrolls past both copies of the images into blank space.
    // Safe any time no transition is actively interpolating the transform
    // (transitioning is only true for the ~650ms a click's CSS transition
    // runs): shifting by an exact multiple of W never changes what's on
    // screen, since the strip's content repeats every W.
    let wrapped = false;
    if (!transitioning && (pos < 0 || pos >= W)) {
      pos = ((pos % W) + W) % W;
      wrapped = true;
    }
    if (!paused || wrapped) {
      apply();
      updateActiveDot();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
});
