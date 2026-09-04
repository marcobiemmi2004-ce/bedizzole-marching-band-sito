// Cinematic scroll-driven hero: rotate/zoom into the trumpet bell, iris to black.
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.cinema-hero');
  if (!heroSection) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (reduceMotion || !gsapReady) {
    // Accessible / no-JS-lib fallback: static hero, no pin, no motion.
    heroSection.classList.add('cinema-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const pin = heroSection.querySelector('.cinema-pin');
  const imageWrap = heroSection.querySelector('.cinema-image-wrap');
  const iris = heroSection.querySelector('.cinema-iris');
  const vignette = heroSection.querySelector('.cinema-vignette');
  const text = heroSection.querySelector('.cinema-text');
  const cue = heroSection.querySelector('.cinema-scrollcue');

  // Bell anchor point, as % of the image box (see cinema-image object-position).
  const BELL_X = '24%';
  const BELL_Y = '23%';

  gsap.set(imageWrap, { transformOrigin: `${BELL_X} ${BELL_Y}`, scale: 1, rotateY: 0, force3D: true });
  gsap.set(iris, { clipPath: `circle(0% at ${BELL_X} ${BELL_Y})` });

  let currentST = null;

  ScrollTrigger.matchMedia({
    // Desktop / tablet: full cinematic range.
    '(min-width: 761px)': function () {
      buildTimeline({ maxScale: 9, tilt: -7, distance: '+=3200' });
    },
    // Mobile: shorter, lighter scale range for smoothness on weaker GPUs.
    '(max-width: 760px)': function () {
      buildTimeline({ maxScale: 5.2, tilt: -4, distance: '+=1900' });
    },
  });

  function buildTimeline({ maxScale, tilt, distance }) {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'cinemaHero',
        trigger: heroSection,
        start: 'top top',
        end: distance,
        scrub: 0.65,
        pin: pin,
        anticipatePin: 1,
        // markers: true,
      },
    });
    currentST = tl.scrollTrigger;

    tl.to(text, { opacity: 0, y: -26, duration: 0.13, ease: 'power1.out' }, 0)
      .to(cue, { opacity: 0, duration: 0.08 }, 0)
      // Phase 1: camera begins to arc + drift closer (subtle 3D tilt, not a literal turn).
      .to(imageWrap, { scale: maxScale * 0.3, rotateY: tilt, duration: 0.38, ease: 'power1.inOut' }, 0.06)
      // Phase 2: dolly accelerates toward the bell, tilt settles back to face-on.
      .to(imageWrap, { scale: maxScale, rotateY: 0, duration: 0.46, ease: 'power2.in' }, 0.42)
      // Vignette darkens as we close in.
      .to(vignette, { opacity: 1, duration: 0.5, ease: 'power1.in' }, 0.28)
      // Iris: the bell's dark interior expands to swallow the whole frame.
      .to(iris, { clipPath: `circle(150% at ${BELL_X} ${BELL_Y})`, duration: 0.5, ease: 'power2.in' }, 0.46);

    return tl;
  }

  // Keep things tidy if the viewport crosses the breakpoint (matchMedia handles re-init automatically).
  window.addEventListener('beforeunload', () => {
    if (currentST) currentST.kill();
  });
});
