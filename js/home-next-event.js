// Homepage "Eventi Futuri" card: instead of a hand-written date that goes
// stale, this pulls the real next upcoming event straight from
// eventi.html (same logic events.js already uses there: first card whose
// data-date hasn't passed yet) and keeps it in sync with the language
// toggle. If the fetch fails for any reason, the static fallback text
// already in the markup (data-i18n="card.eventi.desc") stays put.
(function () {
  const el = document.getElementById('next-event-desc');
  if (!el) return;

  const LABEL = { it: 'Prossima tappa', en: 'Next stop' };
  const MONTH_FULL = {
    it: {
      'month.gen': 'gennaio', 'month.feb': 'febbraio', 'month.mar': 'marzo',
      'month.apr': 'aprile', 'month.mag': 'maggio', 'month.giu': 'giugno',
      'month.lug': 'luglio', 'month.ago': 'agosto', 'month.set': 'settembre',
      'month.ott': 'ottobre', 'month.nov': 'novembre', 'month.dic': 'dicembre',
    },
    en: {
      'month.gen': 'January', 'month.feb': 'February', 'month.mar': 'March',
      'month.apr': 'April', 'month.mag': 'May', 'month.giu': 'June',
      'month.lug': 'July', 'month.ago': 'August', 'month.set': 'September',
      'month.ott': 'October', 'month.nov': 'November', 'month.dic': 'December',
    },
  };

  function translate(sourceEl) {
    if (!sourceEl) return '';
    const key = sourceEl.getAttribute('data-i18n');
    const t = key && window.BMB_I18N ? window.BMB_I18N.t(key) : undefined;
    return t !== undefined ? t : sourceEl.textContent.trim();
  }

  function render(card) {
    const lang = window.BMB_I18N ? window.BMB_I18N.getLang() : 'it';
    const label = LABEL[lang] || LABEL.it;

    const locEl = card.querySelector('.event-info a.loc');
    const dayEl = card.querySelector('.event-date .day');
    const monthEl = card.querySelector('.event-date .month');

    const loc = translate(locEl).replace(/^📍\s*/, '');
    const day = dayEl ? dayEl.textContent.trim() : '';
    const monthKey = monthEl ? monthEl.getAttribute('data-i18n') : null;
    const month = (monthKey && MONTH_FULL[lang] && MONTH_FULL[lang][monthKey]) || translate(monthEl);

    if (!loc) return; // keep the static fallback rather than show something broken
    el.textContent = day && month ? `${label}: ${loc}, ${day} ${month}.` : `${label}: ${loc}.`;
  }

  async function loadNextEvent() {
    try {
      const res = await fetch('eventi.html', { cache: 'no-store' });
      if (!res.ok) return;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const cards = Array.from(doc.querySelectorAll('#event-list .event-card[data-date]'));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const next = cards.find((card) => new Date(card.getAttribute('data-date') + 'T00:00:00') >= today);
      if (next) render(next);
    } catch (e) {
      // Fetch unavailable (e.g. opened as a local file:// page) or a
      // network hiccup: the static fallback already in the HTML stands.
    }
  }

  document.addEventListener('DOMContentLoaded', loadNextEvent);
  document.addEventListener('bmb:langchange', loadNextEvent);
})();
