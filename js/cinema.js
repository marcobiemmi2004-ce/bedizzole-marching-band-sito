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
    // Desktop / tablet: shorter, smoother cinematic range.
    '(min-width: 761px)': function () {
      buildTimeline({ maxScale: 9, tilt: -7, distance: '+=2100' });
    },
    // Mobile: shorter still, lighter scale range for smoothness on weaker GPUs.
    '(max-width: 760px)': function () {
      buildTimeline({ maxScale: 5.2, tilt: -4, distance: '+=1250' });
    },
  });

  function buildTimeline({ maxScale, tilt, distance }) {
    const tl = gsap.timeline({
      defaults: { ease: 'sine.inOut' },
      scrollTrigger: {
        id: 'cinemaHero',
        trigger: heroSection,
        start: 'top top',
        end: distance,
        scrub: 1.1,
        pin: pin,
        anticipatePin: 1,
        // markers: true,
      },
    });
    currentST = tl.scrollTrigger;

    tl.to(text, { opacity: 0, y: -26, duration: 0.18, ease: 'sine.out' }, 0)
      .to(cue, { opacity: 0, duration: 0.12 }, 0)
      // Phase 1: camera begins to arc + drift closer (subtle 3D tilt, not a literal turn).
      .to(imageWrap, { scale: maxScale * 0.32, rotateY: tilt, duration: 0.46, ease: 'sine.inOut' }, 0.04)
      // Phase 2: dolly glides toward the bell, tilt settles back to face-on — long overlap with phase 1 so the motion never snaps.
      .to(imageWrap, { scale: maxScale, rotateY: 0, duration: 0.62, ease: 'sine.in' }, 0.36)
      // Vignette darkens gradually as we close in.
      .to(vignette, { opacity: 1, duration: 0.68, ease: 'sine.inOut' }, 0.2)
      // Iris: the bell's dark interior expands to swallow the whole frame, blending in well before the dolly ends.
      .to(iris, { clipPath: `circle(150% at ${BELL_X} ${BELL_Y})`, duration: 0.64, ease: 'sine.in' }, 0.38);

    return tl;
  }

  // Keep things tidy if the viewport crosses the breakpoint (matchMedia handles re-init automatically).
  window.addEventListener('beforeunload', () => {
    if (currentST) currentST.kill();
  });
});
