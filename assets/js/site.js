// Gullin waiting-list page: EN/ES copy switch and the email form.
//
// Signups go to Web3Forms (web3forms.com), which emails each one to you.
// Get a key with "Create your Access Key" on web3forms.com and paste it here.
// The key is meant to sit in public page code; it can only send form emails to you.
var WEB3FORMS_ACCESS_KEY = 'a86db51d-e0b1-45d7-87a5-73ed2df001fb';

(function () {
  var COPY = {
    en: {
      langLabel: 'Language',
      eyebrow: 'AI flows for small businesses',
      title: 'From first enquiry to final payment.',
      sub: 'Pick a ready-made flow for your type of business. Gullin reads your email, writes the drafts and chases the follow-ups. You approve each draft and pay only when it runs.',
      label: 'Join the waiting list',
      placeholder: 'you@yourbusiness.com',
      button: 'Join the waiting list',
      note: 'No subscription. We tell you when Gullin opens.',
      error: 'Enter a valid email address.',
      sending: 'Joining…',
      failed: 'We could not add you. Please try again.',
      busy: 'Too many tries. Wait a minute, then try again.',
      thanks: 'Thank you. You are on the list.',
      thanksSub: 'We send you an email when Gullin opens.',
      alt: 'One flow in four steps: a new client email, Gullin writes the draft, you approve it, the invoice is paid',
      c1tag: 'New email', c1subject: 'Blog post for March?', c1body: 'Hi! Do you have time for a 2,000-word post in March? Our budget is about $1,000.',
      c2tag: 'Gullin writes', c2title: 'Reply with your rates and dates',
      c3tag: 'You approve', c3title: 'Send the reply to Sam?', c3ok: 'Approve', c3edit: 'Edit',
      c4tag: 'Invoice paid',
      pill1: 'No subscription', pill2: 'You check every draft'
    },
    es: {
      langLabel: 'Idioma',
      eyebrow: 'Flujos de IA para pequeñas empresas',
      title: 'Del primer contacto al cobro final.',
      sub: 'Elige un flujo listo para tu tipo de negocio. Gullin lee tu correo, escribe los borradores y hace el seguimiento. Tú apruebas cada borrador y solo pagas cuando se ejecuta.',
      label: 'Únete a la lista de espera',
      placeholder: 'tu@tunegocio.com',
      button: 'Unirme a la lista',
      note: 'Sin suscripción. Te avisamos cuando Gullin abra.',
      error: 'Escribe un correo electrónico válido.',
      sending: 'Enviando…',
      failed: 'No pudimos añadirte. Inténtalo de nuevo.',
      busy: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
      thanks: 'Gracias. Ya estás en la lista.',
      thanksSub: 'Te enviamos un correo cuando Gullin abra.',
      alt: 'Un flujo en cuatro pasos: llega un correo de un cliente, Gullin escribe el borrador, tú lo apruebas y la factura se cobra',
      c1tag: 'Correo nuevo', c1subject: '¿Un artículo para marzo?', c1body: '¡Hola! ¿Tienes tiempo para un artículo de 2.000 palabras en marzo? Nuestro presupuesto es de unos 1.000 $.',
      c2tag: 'Gullin escribe', c2title: 'Respuesta con tus tarifas y fechas',
      c3tag: 'Tú apruebas', c3title: '¿Enviar la respuesta a Sam?', c3ok: 'Aprobar', c3edit: 'Editar',
      c4tag: 'Factura cobrada',
      pill1: 'Sin suscripción', pill2: 'Revisas cada borrador'
    }
  };
  var STORE_KEY = 'gullin-lang';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var lang = 'en';
  var errorKey = null; // 'error' | 'failed' | 'busy' | null
  var sending = false;

  var form = document.getElementById('waitlist');
  var input = document.getElementById('wl-email');
  var submitBtn = form.querySelector('button[type="submit"]');
  var botcheck = form.querySelector('[name="botcheck"]');
  var help = document.getElementById('wl-help');
  var thanks = document.getElementById('waitlist-thanks');
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-lang]'));

  function t(key) { return COPY[lang][key]; }

  function renderHelp() {
    help.textContent = errorKey ? t(errorKey) : t('note');
    help.classList.toggle('is-error', !!errorKey);
    input.setAttribute('aria-invalid', errorKey === 'error' ? 'true' : 'false');
    submitBtn.textContent = sending ? t('sending') : t('button');
    submitBtn.disabled = sending;
    submitBtn.setAttribute('aria-busy', sending ? 'true' : 'false');
  }

  function setLang(next, save) {
    if (!COPY[next]) return;
    lang = next;
    document.documentElement.lang = next;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var parts = el.getAttribute('data-i18n-attr').split(':');
      el.setAttribute(parts[0], t(parts[1]));
    });
    langButtons.forEach(function (b) {
      var on = b.getAttribute('data-lang') === next;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    renderHelp();
    if (save) { try { localStorage.setItem(STORE_KEY, next); } catch (e) {} }
  }

  langButtons.forEach(function (b, i) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
    // Arrow keys move between the radio options, as a radiogroup should.
    b.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
      e.preventDefault();
      var step = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 1;
      var target = langButtons[(i + step + langButtons.length) % langButtons.length];
      setLang(target.getAttribute('data-lang'), true);
      target.focus();
    });
  });

  input.addEventListener('input', function () {
    if (errorKey) { errorKey = null; renderHelp(); }
  });

  function subscribe(email) {
    if (!WEB3FORMS_ACCESS_KEY) {
      console.error('Waiting list: set WEB3FORMS_ACCESS_KEY in assets/js/site.js.');
      return Promise.resolve('failed');
    }
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Gullin waiting list: ' + email,
        from_name: 'Gullin site',
        email: email,
        language: lang.toUpperCase(),
        botcheck: botcheck.checked // spam trap: real visitors never tick it
      })
    }).then(function (res) {
      if (res.status === 429) return 'busy';
      return res.json().then(function (data) {
        if (data && data.success) return 'ok';
        console.error('Waiting list:', data && data.message);
        return 'failed';
      });
    }).catch(function (err) {
      console.error('Waiting list:', err);
      return 'failed';
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var email = input.value.trim();
    if (!EMAIL_RE.test(email)) {
      errorKey = 'error';
      renderHelp();
      input.focus();
      return;
    }
    errorKey = null;
    sending = true;
    renderHelp();
    subscribe(email).then(function (result) {
      sending = false;
      if (result === 'ok') {
        form.hidden = true;
        thanks.hidden = false;
        return;
      }
      errorKey = result;
      renderHelp();
    });
  });

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  var browser = (navigator.language || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  setLang(saved || browser, false);
})();
