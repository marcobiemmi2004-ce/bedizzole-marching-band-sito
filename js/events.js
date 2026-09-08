// Hide past events automatically: an event stays visible through its own
// day, then disappears on its own starting the day after — no manual
// edits needed as time passes. Once it's gone from "Eventi futuri", a
// stripped-down copy (no photo, plain card like every other past event)
// is moved into the "Dove siamo stati?" archive, most-recent-first.
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('event-list');
  const pastList = document.getElementById('past-event-list');
  const filterBar = document.getElementById('year-filter');
  if (!list) return;

  // Creates the year-pill for a given year if it doesn't exist yet (e.g.
  // the very first event of a new year to expire into the archive), kept
  // in descending order right after "Tutti".
  function ensureYearPill(year) {
    if (!filterBar) return;
    if (filterBar.querySelector(`.year-pill[data-year="${year}"]`)) return;
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'year-pill';
    pill.setAttribute('data-year', year);
    pill.textContent = year;
    const existing = Array.from(filterBar.querySelectorAll('.year-pill[data-year]'))
      .filter((p) => p.getAttribute('data-year') !== 'all');
    const insertBefore = existing.find((p) => Number(p.getAttribute('data-year')) < Number(year));
    filterBar.insertBefore(pill, insertBefore || null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cards = Array.from(list.querySelectorAll('.event-card[data-date]'));
  let visibleCount = 0;
  const expired = [];

  cards.forEach((card) => {
    const raw = card.getAttribute('data-date'); // YYYY-MM-DD
    const eventDate = new Date(raw + 'T00:00:00');
    if (eventDate < today) {
      card.hidden = true;
      expired.push({ card, raw });
    } else {
      visibleCount++;
    }
  });

  const emptyNote = document.getElementById('empty-events-note');
  if (emptyNote) emptyNote.hidden = visibleCount > 0;

  if (pastList && expired.length) {
    // Most recent first, matching the archive's own ordering.
    expired.sort((a, b) => b.raw.localeCompare(a.raw));

    expired.forEach(({ card, raw }) => {
      const year = raw.slice(0, 4);
      ensureYearPill(year);
      const day = String(Number(raw.slice(8, 10)));
      const srcMonth = card.querySelector('.event-date .month');
      const srcH3 = card.querySelector('.event-info h3');
      const srcLoc = card.querySelector('.event-info a.loc');
      const srcTag = card.querySelector('.event-tag');

      const pastCard = document.createElement('div');
      pastCard.className = 'event-card reveal';
      pastCard.setAttribute('data-year', year);

      const dateBox = document.createElement('div');
      dateBox.className = 'event-date';
      const dayEl = document.createElement('div');
      dayEl.className = 'day';
      dayEl.textContent = day;
      dateBox.appendChild(dayEl);
      if (srcMonth) {
        const monthEl = document.createElement('div');
        monthEl.className = 'month';
        const key = srcMonth.getAttribute('data-i18n');
        if (key) monthEl.setAttribute('data-i18n', key);
        monthEl.textContent = srcMonth.textContent; // already translated by i18n.js
        dateBox.appendChild(monthEl);
      }

      const info = document.createElement('div');
      info.className = 'event-info';
      const h3 = document.createElement('h3');
      if (srcH3) {
        const key = srcH3.getAttribute('data-i18n');
        if (key) h3.setAttribute('data-i18n', key);
        h3.textContent = srcH3.textContent;
      }
      info.appendChild(h3);
      if (srcLoc) {
        const loc = document.createElement('a');
        loc.className = 'loc';
        loc.href = srcLoc.href;
        loc.target = '_blank';
        loc.rel = 'noopener';
        const key = srcLoc.getAttribute('data-i18n');
        if (key) loc.setAttribute('data-i18n', key);
        loc.textContent = srcLoc.textContent;
        info.appendChild(loc);
      }

      pastCard.appendChild(dateBox);
      pastCard.appendChild(info);
      if (srcTag) {
        const tag = document.createElement('span');
        tag.className = 'event-tag';
        const key = srcTag.getAttribute('data-i18n');
        if (key) tag.setAttribute('data-i18n', key);
        tag.textContent = srcTag.textContent;
        pastCard.appendChild(tag);
      }

      pastList.insertBefore(pastCard, pastList.firstChild);
    });
  }
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
