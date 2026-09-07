// Simple lightbox for .gallery-item thumbnails, grouped by their parent .gallery-grid.
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('media-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function openLightbox(group, index) {
    currentGroup = group;
    currentIndex = index;
    showCurrent();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function showCurrent() {
    const item = currentGroup[currentIndex];
    lightboxImg.src = item.getAttribute('href');
    lightboxImg.alt = item.querySelector('img').alt || '';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    showCurrent();
  }

  document.querySelectorAll('.gallery-grid').forEach((grid) => {
    const items = Array.from(grid.querySelectorAll('.gallery-item'));
    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(items, index);
      });
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
});
