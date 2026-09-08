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
// 5 cards at a time with a small "show more" prompt; picking a specific
// year shows every matching card at once, no pagination.
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

  function render() {
    const activePill = filterBar.querySelector('.year-pill.active');
    const year = activePill ? activePill.getAttribute('data-year') : 'all';

    if (year === 'all') {
      cards.forEach((card, i) => { card.hidden = i >= visibleInAll; });
      if (loadMorePrompt) loadMorePrompt.hidden = visibleInAll >= cards.length;
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
      visibleInAll += PAGE_SIZE;
      render();
    });
  }

  render();
});
