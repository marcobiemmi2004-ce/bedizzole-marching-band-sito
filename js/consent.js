// Cookie consent banner + Google Analytics (GA4), loaded only after consent.
// GDPR-friendly: no tracking script/cookie is set until the visitor clicks
// "Accetta". Choice is remembered in localStorage so the banner shows once.
(function () {
  var GA_ID = 'G-YNKB2GZ0W1';
  var STORAGE_KEY = 'bmb-cookie-consent';

  function loadGA() {
    if (window.__bmbGaLoaded) return;
    window.__bmbGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function showBanner() {
    var lang = (document.documentElement.lang || 'it').startsWith('en') ? 'en' : 'it';
    var text = {
      it: {
        msg: 'Usiamo Google Analytics in forma anonima per capire come viene usato il sito. Nessun dato viene ceduto a terzi per scopi pubblicitari.',
        accept: 'Accetta',
        decline: 'Rifiuta'
      },
      en: {
        msg: 'We use Google Analytics anonymously to understand how the site is used. No data is shared with third parties for advertising purposes.',
        accept: 'Accept',
        decline: 'Decline'
      }
    }[lang];

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<p>' + text.msg + '</p>' +
      '<div class="cookie-actions">' +
        '<button type="button" id="cookie-decline">' + text.decline + '</button>' +
        '<button type="button" id="cookie-accept">' + text.accept + '</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      loadGA();
      banner.remove();
    });
    document.getElementById('cookie-decline').addEventListener('click', function () {
      setConsent('declined');
      banner.remove();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadGA();
    } else if (consent !== 'declined') {
      showBanner();
    }
  });
})();
