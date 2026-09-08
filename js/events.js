// Hide past events automatically: an event stays visible through its own
// day, then disappears on its own starting the day after — no manual
// edits needed as time passes.
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('event-list');
  if (!list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cards = Array.from(list.querySelectorAll('.event-card[data-date]'));
  let visibleCount = 0;

  cards.forEach((card) => {
    const raw = card.getAttribute('data-date'); // YYYY-MM-DD
    const eventDate = new Date(raw + 'T00:00:00');
    if (eventDate < today) {
      card.hidden = true;
    } else {
      visibleCount++;
    }
  });

  const emptyNote = document.getElementById('empty-events-note');
  if (emptyNote) emptyNote.hidden = visibleCount > 0;
});

// "Dove siamo stati?" year filter for the past-events archive.
// Under "Tutti" (all years) the list can get long, so it's paginated
// 5 cards at a time with a small "show more" button; once every card is
// shown, the same button turns into "show less" and collapses back to 5.
// Picking a specific year shows every matching card at once, no pagination.
document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.getElementById('year-filter');
  const pastList = document.getElementById('past-event-list');
  const loadMorePrompt = document.getElementById('load-more-prompt');
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (!filterBar || !pastList) return;

  const pills = Array.from(filterBar.querySelectorAll('.year-pill'));
  const cards = Array.from(pastList.querySelectorAll('.event-card[data-year]'));
  const PAGE_SIZE = 5;
  let visibleInAll = PAGE_SIZE;

  // Small local label map so the button's text stays correct immediately,
  // even before the next full language-toggle re-scan (which will also
  // pick the right text via the data-i18n key set below).
  const LABELS = {
    it: { more: 'Visualizza altro', less: 'Visualizza meno' },
    en: { more: 'Show more', less: 'Show less' },
  };
  function labelFor(state) {
    const lang = document.documentElement.getAttribute('lang') || 'it';
    return (LABELS[lang] || LABELS.it)[state];
  }

  function render() {
    const activePill = filterBar.querySelector('.year-pill.active');
    const year = activePill ? activePill.getAttribute('data-year') : 'all';

    if (year === 'all') {
      cards.forEach((card, i) => { card.hidden = i >= visibleInAll; });
      const hasMoreThanOnePage = cards.length > PAGE_SIZE;
      if (loadMorePrompt) loadMorePrompt.hidden = !hasMoreThanOnePage;
      if (loadMoreBtn && hasMoreThanOnePage) {
        const allShown = visibleInAll >= cards.length;
        loadMoreBtn.setAttribute('data-i18n', allShown ? 'past.showless' : 'past.loadmore.cta');
        loadMoreBtn.textContent = labelFor(allShown ? 'less' : 'more');
      }
    } else {
      cards.forEach((card) => {
        card.hidden = card.getAttribute('data-year') !== year;
      });
      if (loadMorePrompt) loadMorePrompt.hidden = true;
    }
  }

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.year-pill');
    if (!btn) return;
    pills.forEach((p) => p.classList.toggle('active', p === btn));
    if (btn.getAttribute('data-year') === 'all') visibleInAll = PAGE_SIZE;
    render();
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const allShown = visibleInAll >= cards.length;
      visibleInAll = allShown ? PAGE_SIZE : visibleInAll + PAGE_SIZE;
      render();
      if (allShown) filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  render();
});
