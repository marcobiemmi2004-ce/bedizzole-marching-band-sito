// Lightweight client-side i18n: swaps text content of every [data-i18n] element.
// Language choice persists in localStorage; default is Italian.
(function () {
  const STORAGE_KEY = 'bmb-lang';

  const DICT = {
    it: {
      // ---- shared: header / nav / footer ----
      'nav.chisiamo': 'Chi Siamo',
      'nav.storia': 'Storia',
      'nav.accademia': 'Accademia',
      'nav.eventi': 'Eventi Futuri',
      'nav.contatti': 'Contatti',
      'brand.sub': 'MARCHING BAND',
      'footer.tagline': 'Sfiliamo per la nostra comunità dal cuore di Bedizzole (BS). Musica, disciplina e divertimento per ogni età.',
      'footer.navigate': 'Naviga',
      'footer.contacts': 'Contatti',
      'footer.rights': 'Tutti i diritti riservati.',
      'footer.construction': 'Sito in costruzione — bozza di lavoro',

      // ---- index.html ----
      'hero.eyebrow': '♪ BEDIZZOLE (BS) · DAL CUORE DELLA COMUNITÀ',
      'hero.h1': 'Una banda, un sound.',
      'hero.lead': 'Siamo la Bedizzole Marching Band: sfilate, spettacoli e prove ogni settimana. Che tu non abbia mai toccato uno strumento o suoni già da anni, qui c’è un posto per te.',
      'hero.cta1': 'Voglio iniziare a suonare',
      'hero.cta2': 'Suono già, voglio provare con voi',
      'hero.scroll': 'Scorri',
      'rehearsal.badge': 'Prove generali',
      'rehearsal.time': 'Ogni giovedì · 20:45 – 22:30',
      'rehearsal.location': 'Sede: Via Monte Grappa, 21 – Bedizzole (BS) · tutti i musicisti sono benvenuti',
      'rehearsal.cta': 'Vieni a trovarci',
      'paths.kicker': 'Da dove parti?',
      'paths.h2': 'Un percorso per ogni musicista',
      'paths.lead': 'Che tu sia alle prime note o suoni già in banda da anni, la Bedizzole Marching Band ha un ingresso pensato per te.',
      'path1.tag': 'Nuovi musicisti',
      'path1.h3': 'Non hai mai suonato? Iniziamo insieme.',
      'path1.p': 'La nostra Accademia accompagna chi parte da zero: lezioni di strumento, teoria e marcia, in un gruppo che diventa presto una seconda famiglia.',
      'path1.li1': 'Nessuna esperienza richiesta',
      'path1.li2': 'Strumenti e percorso guidato',
      'path1.li3': 'Ingresso in banda quando sei pronto',
      'path1.cta': 'Scopri l’Accademia',
      'path2.tag': 'Musicisti già formati',
      'path2.h3': 'Suoni già? Vieni a fare una prova.',
      'path2.p': 'Se hai già esperienza con uno strumento (anche fuori dal marching), ti aspettiamo a una prova generale per conoscerci dal vivo.',
      'path2.li1': 'Prove ogni giovedì, 20:45–22:30',
      'path2.li2': 'Repertorio e formazione in continuo aggiornamento',
      'path2.li3': 'Sfilate, concorsi ed eventi durante l’anno',
      'path2.cta': 'Contattaci per una prova',
      'quicklinks.kicker': 'Esplora',
      'quicklinks.h2': 'Chi siamo, da dove veniamo, dove ci trovi',
      'card.chisiamo.title': 'Chi Siamo',
      'card.chisiamo.desc': 'Persone, strumenti e valori dietro alla divisa BMB.',
      'card.storia.title': 'Storia',
      'card.storia.desc': 'Il percorso della banda nel tempo, tappa dopo tappa.',
      'card.eventi.title': 'Eventi Futuri',
      'card.eventi.desc': 'Prossima tappa: Brescia centro, 12 settembre.',
      'card.accademia.title': 'Accademia',
      'card.accademia.desc': 'Il percorso per chi vuole imparare a suonare da zero.',
      'card.go1': 'Scopri di più →',
      'card.go2': 'Leggi la storia →',
      'card.go3': 'Vedi il calendario →',
      'card.go4': 'Come funziona →',
      'gallery.kicker': 'Sul campo',
      'gallery.h2': 'Gli ultimi scatti dalle sfilate',

      // ---- chi-siamo.html ----
      'chisiamo.kicker': 'Chi siamo',
      'chisiamo.h1': 'Le persone dietro la divisa BMB',
      'chisiamo.intro': 'Dal 1880 portiamo musica per le strade di Bedizzole. Oggi siamo una marching show band di 46 persone tra musicisti, color guard e staff, con un’Accademia per i più giovani e un motto che ci rappresenta: <strong>Una banda, un sound.</strong>',
      'stat.musicisti': 'Musicisti',
      'stat.colorguard': 'Color Guard',
      'stat.maestro': 'Maestro',
      'stat.staff': 'Membri staff',
      'direttivo.kicker': 'Direttivo',
      'direttivo.h2': 'Chi guida la banda',
      'role.presidente': 'Presidente',
      'role.vicepresidente': 'Vicepresidente',
      'role.segretario': 'Segretario',
      'role.tesoriere': 'Tesoriere',
      'role.direttoremusicale': 'Direttore musicale',
      'role.fondatore': 'Fondatore',
      'chisiamo.note': 'Nota per Marco: Presidente e Vicepresidente confermati via <a href="https://www.bedizzolemarchingband.it/it/contatti/" target="_blank" rel="noopener">bedizzolemarchingband.it/it/contatti</a>; Segretario, Tesoriere, Direttore musicale e Fondatore ricostruiti dal sito attuale — segnalami se qualche ruolo/nome è cambiato.',
      'sezioni.kicker': 'Sezioni strumentali',
      'sezioni.h2': 'Come siamo organizzati',
      'sezione.1': 'Flauti / Clarinetti',
      'sezione.2': 'Sassofoni',
      'sezione.3': 'Trombe',
      'sezione.4': 'Corni (Mellophones)',
      'sezione.5': 'Eufoni',
      'sezione.6': 'Tube (Sousaphones)',
      'sezione.7': 'Percussioni',
      'sezione.8': 'Onoranze',
      'sezione.9': 'Staff',

      // ---- storia.html ----
      'storia.kicker': 'Storia',
      'storia.h1': 'Il cammino della Bedizzole Marching Band',
      'storia.y1.h3': 'Nasce la Banda Musicale Cittadina',
      'storia.y1.p': 'Le origini della banda di Bedizzole risalgono al 1880, quando nasce come banda musicale civica del paese: il punto di partenza di una tradizione lunga oltre un secolo.',
      'storia.y2.h3': 'La svolta Marching Show Band',
      'storia.y2.p': 'Sotto la guida di Aldo Bettini, la banda si trasforma nel formato "marching show band", tra i primi ad introdurre questo genere nel territorio bresciano: coreografie, divise e un nuovo modo di intendere lo spettacolo bandistico.',
      'storia.y3.h3': 'Podio all’IMBS Parade di Monza',
      'storia.y3.p': 'La banda conquista il terzo posto al concorso di parata IMBS di Monza, un riconoscimento importante a livello nazionale nel mondo del marching.',
      'storia.y4.h3': 'Nuove uniformi ufficiali',
      'storia.y4.p': 'Debuttano le nuove divise ufficiali della banda, mentre il gruppo continua a crescere ed esibirsi in Italia e all’estero, tra sfilate, concorsi e appuntamenti come il Capodanno a Roma.',
      'storia.y5.h3': '46 componenti e un’Accademia che cresce',
      'storia.y5.p': 'La Bedizzole Marching Band conta oggi 37 musicisti, 5 elementi di color guard, il maestro e 3 membri di staff, affiancati dai giovani allievi dell’Accademia che si preparano a entrare stabilmente in formazione.',
      'storia.note': 'Nota: contenuti ricostruiti a partire dal sito attuale <a href="https://www.bedizzolemarchingband.it" target="_blank" rel="noopener">bedizzolemarchingband.it</a> — da rivedere e integrare insieme con eventuali correzioni o aggiunte.',

      // ---- eventi.html ----
      'eventi.kicker': 'Eventi futuri',
      'eventi.h1': 'Dove ci trovi nei prossimi mesi',
      'ev1.title': 'Parata a Brescia centro',
      'ev1.loc': '📍 Brescia (BS)',
      'ev2.title': 'Esibizione al Padiglione Oktoberfest',
      'ev2.loc': '📍 San Polo, Brescia (BS)',
      'ev3.title': 'Sfilata a Foresto Sparso',
      'ev3.loc': '📍 Foresto Sparso (BG)',
      'ev4.title': 'Festa dell’Uva',
      'ev4.loc': '📍 Gussago (BS)',
      'ev5.title': 'Festa del Torrone',
      'ev5.loc': '📍 Cremona',
      'tag.oktoberfest': 'Oktoberfest',
      'tag.sfilata': 'Sfilata',
      'tag.festa': 'Festa paesana',
      'month.set': 'Set',
      'month.nov': 'Nov',
      'eventi.note': 'Aggiungo volentieri orari di ritrovo e altri dettagli quando li hai.',

      // ---- accademia.html ----
      'accademia.kicker': 'Accademia',
      'accademia.h1': 'Impara a suonare, un passo alla volta',
      'accademia.mission': 'La Bedizzole Marching Band vanta la presenza di un\'Accademia Musicale aperta a tutti i giovanissimi che vogliono avvicinarsi al mondo della musica e della marching band. L\'obiettivo è formare nuove figure da inserire, in un secondo momento e senza alcun vincolo, nella Bedizzole Marching Band.',
      'accademia.direttore': 'Direttore artistico: Nicola Orsato · 333 689 6735',
      'accademia.corsiprop.kicker': 'Corsi propedeutici',
      'accademia.corsiprop.h2': 'Da dove iniziare',
      'accademia.corsiagg.kicker': 'Corsi aggiuntivi',
      'accademia.corsiagg.h2': 'Per approfondire',
      'strumento.flauto': 'Flauto',
      'strumento.sassofono': 'Sassofono',
      'strumento.ottoni': 'Ottoni',
      'strumento.percbase': 'Percussioni (base)',
      'strumento.percavanzato': 'Percussioni (avanzato)',
      'strumento.colorguard': 'Color Guard',
      'strumento.chitarra': 'Chitarra',
      'strumento.pianoforte': 'Pianoforte',
      'strumento.canto': 'Canto moderno e lirico',
      'accademia.boxtitle': 'Mancano ancora alcuni dettagli pratici',
      'accademia.boxtext': 'Dal sito attuale non risultano età minima, costi/quote di iscrizione, orari, sede dei corsi né le modalità precise di passaggio in banda — e al momento non ci sono nuove date di corso programmate. Dammi questi dettagli quando li hai e completo la pagina.',

      // ---- contatti.html ----
      'contatti.kicker': 'Contatti',
      'contatti.h1': 'Scrivici o vieni a trovarci al giovedì',
      'contatti.sedeprove.label': 'Sede prove · Accademia',
      'contatti.sedelegale.label': 'Sede legale',
      'contatti.scrivici.kicker': 'Scrivici',
      'contatti.scrivici.h2': 'Email generale',
      'contatti.direttivo.kicker': 'Direttivo',
      'contatti.direttivo.h2': 'Presidente e Vicepresidente',
      'contatti.social.kicker': 'Seguici',
      'contatti.social.h2': 'Social',
      'contatti.note': 'Dati recuperati dalla pagina contatti del sito attuale <a href="https://www.bedizzolemarchingband.it/it/contatti/" target="_blank" rel="noopener">bedizzolemarchingband.it/it/contatti</a> (indirizzo sede legale, P.IVA 02880260985, CF 93000390174, recapiti di Presidente e Vicepresidente). Non risulta un account TikTok ufficiale — se esiste, mandami il link e lo aggiungo.',
    },
    en: {
      'nav.chisiamo': 'About Us',
      'nav.storia': 'History',
      'nav.accademia': 'Academy',
      'nav.eventi': 'Upcoming Events',
      'nav.contatti': 'Contact',
      'brand.sub': 'MARCHING BAND',
      'footer.tagline': 'We parade for our community from the heart of Bedizzole (BS), Italy. Music, discipline and fun for every age.',
      'footer.navigate': 'Navigate',
      'footer.contacts': 'Contact',
      'footer.rights': 'All rights reserved.',
      'footer.construction': 'Site under construction — work in progress',

      'hero.eyebrow': '♪ BEDIZZOLE (BS), ITALY · FROM THE HEART OF THE COMMUNITY',
      'hero.h1': 'One band, one sound.',
      'hero.lead': 'We are the Bedizzole Marching Band: parades, shows and rehearsals every week. Whether you’ve never touched an instrument or you’ve been playing for years, there’s a place for you here.',
      'hero.cta1': 'I want to start playing',
      'hero.cta2': 'I already play, I’d like to try a rehearsal',
      'hero.scroll': 'Scroll',
      'rehearsal.badge': 'Rehearsals',
      'rehearsal.time': 'Every Thursday · 8:45 – 10:30 PM',
      'rehearsal.location': 'Venue: Via Monte Grappa, 21 – Bedizzole (BS) · all musicians are welcome',
      'rehearsal.cta': 'Come visit us',
      'paths.kicker': 'Where do you start?',
      'paths.h2': 'A path for every musician',
      'paths.lead': 'Whether you’re just starting out or you’ve been in a band for years, the Bedizzole Marching Band has an entry point built for you.',
      'path1.tag': 'New musicians',
      'path1.h3': 'Never played before? Let’s start together.',
      'path1.p': 'Our Academy supports those starting from scratch: instrument lessons, theory and marching, in a group that quickly becomes a second family.',
      'path1.li1': 'No experience required',
      'path1.li2': 'Instruments and a guided path',
      'path1.li3': 'Join the band once you’re ready',
      'path1.cta': 'Discover the Academy',
      'path2.tag': 'Experienced musicians',
      'path2.h3': 'Already play? Come try a rehearsal.',
      'path2.p': 'If you already have experience with an instrument (even outside marching band), join us for a rehearsal and meet us in person.',
      'path2.li1': 'Rehearsals every Thursday, 8:45–10:30 PM',
      'path2.li2': 'Repertoire and line-up constantly evolving',
      'path2.li3': 'Parades, competitions and events throughout the year',
      'path2.cta': 'Contact us for a trial rehearsal',
      'quicklinks.kicker': 'Explore',
      'quicklinks.h2': 'Who we are, where we come from, where to find us',
      'card.chisiamo.title': 'About Us',
      'card.chisiamo.desc': 'People, instruments and values behind the BMB uniform.',
      'card.storia.title': 'History',
      'card.storia.desc': 'The band’s journey through time, milestone by milestone.',
      'card.eventi.title': 'Upcoming Events',
      'card.eventi.desc': 'Next stop: Brescia city centre, September 12.',
      'card.accademia.title': 'Academy',
      'card.accademia.desc': 'The path for those who want to learn to play from scratch.',
      'card.go1': 'Find out more →',
      'card.go2': 'Read the history →',
      'card.go3': 'See the calendar →',
      'card.go4': 'How it works →',
      'gallery.kicker': 'On the field',
      'gallery.h2': 'The latest shots from our parades',

      'chisiamo.kicker': 'About us',
      'chisiamo.h1': 'The people behind the BMB uniform',
      'chisiamo.intro': 'Since 1880 we’ve brought music to the streets of Bedizzole. Today we’re a marching show band of 46 people between musicians, color guard and staff, with an Academy for the youngest and a motto that represents us: <strong>One band, one sound.</strong>',
      'stat.musicisti': 'Musicians',
      'stat.colorguard': 'Color Guard',
      'stat.maestro': 'Music director',
      'stat.staff': 'Staff members',
      'direttivo.kicker': 'Board',
      'direttivo.h2': 'Who leads the band',
      'role.presidente': 'President',
      'role.vicepresidente': 'Vice President',
      'role.segretario': 'Secretary',
      'role.tesoriere': 'Treasurer',
      'role.direttoremusicale': 'Music Director',
      'role.fondatore': 'Founder',
      'chisiamo.note': 'Note for Marco: President and Vice President confirmed via <a href="https://www.bedizzolemarchingband.it/it/contatti/" target="_blank" rel="noopener">bedizzolemarchingband.it/it/contatti</a>; Secretary, Treasurer, Music Director and Founder reconstructed from the current site — let me know if any role/name has changed.',
      'sezioni.kicker': 'Instrument sections',
      'sezioni.h2': 'How we’re organised',
      'sezione.1': 'Flutes / Clarinets',
      'sezione.2': 'Saxophones',
      'sezione.3': 'Trumpets',
      'sezione.4': 'Mellophones',
      'sezione.5': 'Euphoniums',
      'sezione.6': 'Sousaphones',
      'sezione.7': 'Percussion',
      'sezione.8': 'Honor Guard',
      'sezione.9': 'Staff',

      'storia.kicker': 'History',
      'storia.h1': 'The journey of the Bedizzole Marching Band',
      'storia.y1.h3': 'The Civic Music Band is born',
      'storia.y1.p': 'Bedizzole’s band traces its roots back to 1880, when it was founded as the town’s civic music band: the starting point of a tradition spanning more than a century.',
      'storia.y2.h3': 'The Marching Show Band turn',
      'storia.y2.p': 'Under the guidance of Aldo Bettini, the band transforms into a "marching show band" format, among the first to bring this genre to the Brescia area: choreography, uniforms and a new way of understanding a band performance.',
      'storia.y3.h3': 'Podium at the IMBS Parade in Monza',
      'storia.y3.p': 'The band takes third place at the IMBS parade competition in Monza, an important national recognition in the marching world.',
      'storia.y4.h3': 'New official uniforms',
      'storia.y4.p': 'The band’s new official uniforms debut, while the group keeps growing and performing in Italy and abroad, between parades, competitions and events such as the Rome New Year’s Day Parade.',
      'storia.y5.h3': '46 members and a growing Academy',
      'storia.y5.p': 'The Bedizzole Marching Band today counts 37 musicians, 5 color guard members, the music director and 3 staff members, alongside the young Academy students preparing to join the line-up.',
      'storia.note': 'Note: content reconstructed from the current site <a href="https://www.bedizzolemarchingband.it" target="_blank" rel="noopener">bedizzolemarchingband.it</a> — to be reviewed and expanded together with any corrections or additions.',

      'eventi.kicker': 'Upcoming events',
      'eventi.h1': 'Where to find us in the coming months',
      'ev1.title': 'Parade in Brescia city centre',
      'ev1.loc': '📍 Brescia, Italy',
      'ev2.title': 'Performance at the Oktoberfest Pavilion',
      'ev2.loc': '📍 San Polo, Brescia, Italy',
      'ev3.title': 'Parade in Foresto Sparso',
      'ev3.loc': '📍 Foresto Sparso (BG), Italy',
      'ev4.title': 'Grape Festival',
      'ev4.loc': '📍 Gussago (BS), Italy',
      'ev5.title': 'Torrone (Nougat) Festival',
      'ev5.loc': '📍 Cremona, Italy',
      'tag.oktoberfest': 'Oktoberfest',
      'tag.sfilata': 'Parade',
      'tag.festa': 'Village festival',
      'month.set': 'Sep',
      'month.nov': 'Nov',
      'eventi.note': 'Happy to add gathering times and other details once you have them.',

      'accademia.kicker': 'Academy',
      'accademia.h1': 'Learn to play, one step at a time',
      'accademia.mission': 'The Bedizzole Marching Band runs a Music Academy open to all young people who want to approach the world of music and marching band. The goal is to train new members who may later join the Bedizzole Marching Band, with no obligation to do so.',
      'accademia.direttore': 'Artistic director: Nicola Orsato · 333 689 6735',
      'accademia.corsiprop.kicker': 'Preparatory courses',
      'accademia.corsiprop.h2': 'Where to start',
      'accademia.corsiagg.kicker': 'Additional courses',
      'accademia.corsiagg.h2': 'To go further',
      'strumento.flauto': 'Flute',
      'strumento.sassofono': 'Saxophone',
      'strumento.ottoni': 'Brass',
      'strumento.percbase': 'Percussion (basic)',
      'strumento.percavanzato': 'Percussion (advanced)',
      'strumento.colorguard': 'Color Guard',
      'strumento.chitarra': 'Guitar',
      'strumento.pianoforte': 'Piano',
      'strumento.canto': 'Modern & lyric singing',
      'accademia.boxtitle': 'A few practical details are still missing',
      'accademia.boxtext': 'The current site doesn’t list a minimum age, enrolment fees, schedules, course venue, or the exact process for joining the band — and there are currently no new course dates scheduled. Send me these details when you have them and I’ll complete the page.',

      'contatti.kicker': 'Contact',
      'contatti.h1': 'Write to us, or come visit on Thursdays',
      'contatti.sedeprove.label': 'Rehearsal venue · Academy',
      'contatti.sedelegale.label': 'Registered office',
      'contatti.scrivici.kicker': 'Write to us',
      'contatti.scrivici.h2': 'General email',
      'contatti.direttivo.kicker': 'Board',
      'contatti.direttivo.h2': 'President and Vice President',
      'contatti.social.kicker': 'Follow us',
      'contatti.social.h2': 'Social',
      'contatti.note': 'Details retrieved from the contact page of the current site <a href="https://www.bedizzolemarchingband.it/it/contatti/" target="_blank" rel="noopener">bedizzolemarchingband.it/it/contatti</a> (registered office address, VAT 02880260985, tax code 93000390174, President and Vice President contacts). No official TikTok account found — if one exists, send me the link and I’ll add it.',
    },
  };

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'it';
    } catch (e) {
      return 'it';
    }
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    applyLang(lang);
  }

  function applyLang(lang) {
    const dict = DICT[lang] || DICT.it;
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const text = dict[key];
      if (text === undefined) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lang = getLang();
    applyLang(lang);

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });
  });
})();
