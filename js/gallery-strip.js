// "Sul campo" photo strip: images slide (translateX) inside a fixed viewport.
// Dots jump to one specific photo; the arrows jump a whole visible block at a
// time. Clicking again mid-transition just retargets the same CSS transition,
// no queueing/waiting needed.
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('.gallery-strip-viewport');
  const strip = document.getElementById('gallery-strip');
  const dotsWrap = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!viewport || !strip || !dotsWrap) return;

  const images = Array.from(strip.children);
  const dots = Array.from(dotsWrap.children);
  if (!images.length || images.length !== dots.length) return;

  let current = 0;

  function visibleCount() {
    const imgW = images[0].getBoundingClientRect().width;
    if (!imgW) return 1;
    return Math.max(1, Math.round(viewport.clientWidth / imgW));
  }

  function maxIndex() {
    return Math.max(0, images.length - visibleCount());
  }

  function goTo(index) {
    current = Math.min(Math.max(index, 0), maxIndex());
    const gap = parseFloat(getComputedStyle(strip).gap) || 0;
    const step = images[0].getBoundingClientRect().width + gap;
    strip.style.transform = `translateX(-${current * step}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - visibleCount()));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + visibleCount()));

  window.addEventListener('resize', () => goTo(current));

  goTo(0);
});
