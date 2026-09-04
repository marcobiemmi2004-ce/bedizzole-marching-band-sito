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
