// Gullin: the example task in the hero and the "How a flow works" diagram.
// site.js owns the language; it fires a 'gullin:lang' event when it changes.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COPY = {
    en: {
      demoTag: 'Example task · Copywriter',
      steps: ['Email', 'Draft', 'Approve', 'Invoice', 'Paid'],
      actors: { client: 'Client', gullin: 'Gullin', you: 'You' },
      captions: [
        ['client', 'A client asks for a blog post. Gullin reads the email.'],
        ['gullin', 'Gullin writes a reply with your rates and dates.'],
        ['you', 'Your turn. Nothing reaches a client until you approve it.'],
        ['gullin', 'Sam says yes. Gullin sends the invoice.'],
        ['gullin', 'Gullin follows up until the invoice is paid.']
      ],
      s0tag: 'New email', subject: 'Blog post for March?',
      enquiry: 'Hi! Do you have time for a 2,000-word post in March? Our budget is about $1,000.',
      s1tag: 'Gullin writes', s1title: 'Reply with your rates and dates',
      draft: 'Hi Sam, thanks for thinking of me! I can deliver a 2,000-word post by 20 March. My rate is $1,040, with one round of edits. Shall I send the agreement?',
      s2tag: 'You approve', s2title: 'Send the reply to Sam?', yourTurn: 'Your turn',
      draftLabel: 'Draft reply', approve: 'Approve', edit: 'Edit', editing: 'Editing',
      s3tag: 'Invoice sent', invoiceLine: 'Brightwater · Blog post, March', invoiceDue: 'Due in 14 days',
      invoiceSent: 'Sent to sam@brightwater.example',
      s4tag: 'Invoice paid', s4body: 'Brightwater paid. The task is done.',
      pause: 'Pause the example', play: 'Play the example', replay: 'Replay the example',
      stepLabel: 'Step',
      lanes: { inbox: 'Your inbox', gullin: 'Gullin', you: 'You' }
    },
    es: {
      demoTag: 'Tarea de ejemplo · Redactor',
      steps: ['Correo', 'Borrador', 'Aprobar', 'Factura', 'Cobrado'],
      actors: { client: 'Cliente', gullin: 'Gullin', you: 'Tú' },
      captions: [
        ['client', 'Un cliente pide un artículo. Gullin lee el correo.'],
        ['gullin', 'Gullin escribe una respuesta con tus tarifas y fechas.'],
        ['you', 'Te toca. Nada llega a un cliente sin tu aprobación.'],
        ['gullin', 'Sam dice que sí. Gullin envía la factura.'],
        ['gullin', 'Gullin hace el seguimiento hasta que se cobra la factura.']
      ],
      s0tag: 'Correo nuevo', subject: '¿Un artículo para marzo?',
      enquiry: '¡Hola! ¿Tienes tiempo para un artículo de 2.000 palabras en marzo? Nuestro presupuesto es de unos 1.000 $.',
      s1tag: 'Gullin escribe', s1title: 'Respuesta con tus tarifas y fechas',
      draft: 'Hola Sam, ¡gracias por pensar en mí! Puedo entregar un artículo de 2.000 palabras antes del 20 de marzo. Mi tarifa es de 1.040 $, con una ronda de cambios. ¿Te envío el acuerdo?',
      s2tag: 'Tú apruebas', s2title: '¿Enviar la respuesta a Sam?', yourTurn: 'Te toca',
      draftLabel: 'Borrador de respuesta', approve: 'Aprobar', edit: 'Editar', editing: 'Editando',
      s3tag: 'Factura enviada', invoiceLine: 'Brightwater · Artículo, marzo', invoiceDue: 'Vence en 14 días',
      invoiceSent: 'Enviada a sam@brightwater.example',
      s4tag: 'Factura cobrada', s4body: 'Brightwater pagó. La tarea está completa.',
      pause: 'Pausar el ejemplo', play: 'Reproducir el ejemplo', replay: 'Repetir el ejemplo',
      stepLabel: 'Paso',
      lanes: { inbox: 'Tu bandeja', gullin: 'Gullin', you: 'Tú' }
    }
  };

  // Each flow is a list of [lane, English, Spanish]. Lanes: inbox, gullin, you.
  // Rule kept in every flow: a message to a client goes out only after a "you" step.
  var FLOWS = [
    { id: 'copy', tab: ['Copywriters', 'Redactores'], name: ['Enquiry to paid', 'De la consulta al cobro'], steps: [
      ['inbox', 'An enquiry arrives', 'Llega una consulta'],
      ['gullin', 'Drafts a reply with your rates', 'Escribe una respuesta con tus tarifas'],
      ['you', 'Approve the reply', 'Apruebas la respuesta'],
      ['gullin', 'Drafts the post from the brief', 'Escribe el texto a partir del brief'],
      ['you', 'Approve the draft', 'Apruebas el borrador'],
      ['inbox', 'The client signs off', 'El cliente da el visto bueno'],
      ['gullin', 'Sends the invoice and chases payment', 'Envía la factura y reclama el pago']
    ] },
    { id: 'social', tab: ['Social media', 'Redes sociales'], name: ['Plan to report', 'Del plan al informe'], steps: [
      ['inbox', 'A client sends the weekly update', 'Un cliente envía la novedad semanal'],
      ['gullin', 'Turns it into post drafts', 'La convierte en borradores de publicaciones'],
      ['you', 'Approve the posts', 'Apruebas las publicaciones'],
      ['gullin', 'Drafts the monthly report', 'Escribe el informe mensual'],
      ['you', 'Approve the report', 'Apruebas el informe'],
      ['gullin', 'Sends it to the client', 'Lo envía al cliente']
    ] },
    { id: 'seo', tab: ['SEO', 'SEO'], name: ['Monthly client reports', 'Informes mensuales'], steps: [
      ['inbox', 'Ranking emails arrive all month', 'Llegan correos de posiciones todo el mes'],
      ['gullin', 'Collects them for each client', 'Los reúne por cliente'],
      ['gullin', 'Drafts a plain-language report', 'Escribe un informe claro'],
      ['you', 'Approve each report', 'Apruebas cada informe'],
      ['gullin', 'Sends it to the client', 'Lo envía al cliente']
    ] },
    { id: 'pod', tab: ['Print-on-demand', 'Impresión bajo demanda'], name: ['Order problems, handled', 'Problemas con pedidos, resueltos'], steps: [
      ['inbox', 'A customer writes about a late, wrong or damaged print', 'Un cliente escribe por una impresión tardía, errónea o dañada'],
      ['gullin', 'Sorts it by problem', 'Lo clasifica por tipo de problema'],
      ['gullin', 'Drafts a reply', 'Escribe una respuesta'],
      ['you', 'Approve the reply', 'Apruebas la respuesta'],
      ['gullin', 'Sends it to the customer', 'La envía al cliente']
    ] },
    { id: 'coach', tab: ['Coaches', 'Coaches'], name: ['Lead to renewal', 'Del contacto a la renovación'], steps: [
      ['inbox', 'A new lead writes in', 'Escribe un posible cliente'],
      ['gullin', 'Qualifies the lead and drafts a welcome', 'Valora el contacto y prepara la bienvenida'],
      ['you', 'Approve the welcome', 'Apruebas la bienvenida'],
      ['inbox', 'Weekly check-ins arrive', 'Llegan las revisiones semanales'],
      ['gullin', 'Drafts each reply', 'Escribe cada respuesta'],
      ['you', 'Approve the replies', 'Apruebas las respuestas'],
      ['gullin', 'Reminds the client to renew', 'Recuerda al cliente que renueve']
    ] },
    { id: 'free', tab: ['Freelancers', 'Freelancers'], name: ['Quote to paid', 'Del presupuesto al cobro'], steps: [
      ['gullin', 'Drafts a follow-up on your quote', 'Escribe un seguimiento de tu presupuesto'],
      ['you', 'Approve the follow-up', 'Apruebas el seguimiento'],
      ['inbox', 'The client says yes', 'El cliente dice que sí'],
      ['gullin', 'Makes the invoice', 'Prepara la factura'],
      ['gullin', 'Chases late payment', 'Reclama el pago atrasado']
    ] }
  ];
  var LANES = ['inbox', 'gullin', 'you'];

  var lang = document.documentElement.lang === 'es' ? 'es' : 'en';
  function c(key) { return COPY[lang][key]; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Example task ---------- */

  var demo = document.getElementById('demo');
  var stepsList = document.getElementById('demo-steps');
  var panels = Array.prototype.slice.call(demo.querySelectorAll('.panel'));
  var typed = document.getElementById('demo-typed');
  var draftBox = document.getElementById('demo-draft');
  var approveBtn = document.getElementById('demo-approve');
  var editBtn = document.getElementById('demo-edit');
  var toggleBtn = document.getElementById('demo-toggle');
  var captionActor = document.getElementById('demo-actor');
  var captionText = document.getElementById('demo-caption-text');
  var LAST = panels.length - 1;

  var state = { step: 0, playing: true, typedChars: 0, edited: null, editing: false };
  var timer = null;
  var typer = null;

  // Stepper buttons, built once; labels are filled in by renderDemo.
  var stepButtons = panels.map(function (_, i) {
    var li = el('li');
    var b = el('button', 'step');
    b.type = 'button';
    b.appendChild(el('span', 'step-dot', String(i + 1)));
    b.appendChild(el('span', 'step-label'));
    b.addEventListener('click', function () { goTo(i, true); });
    li.appendChild(b);
    stepsList.appendChild(li);
    return b;
  });

  function draftText() { return state.edited != null ? state.edited : c('draft'); }

  function clearTimers() {
    clearTimeout(timer); timer = null;
    clearInterval(typer); typer = null;
  }

  function schedule() {
    clearTimers();
    if (!state.playing) return;
    var s = state.step;
    if (s === 0) timer = setTimeout(function () { goTo(1); }, 2600);
    else if (s === 1) startTyping();
    else if (s === 3) timer = setTimeout(function () { goTo(4); }, 2600);
    else if (s === LAST) { state.playing = false; renderDemo(); }
    // Step 2 waits for the visitor to approve: that is the point of the demo.
  }

  function startTyping() {
    var full = draftText();
    if (reduceMotion) state.typedChars = full.length;
    var finish = function () { timer = setTimeout(function () { goTo(2); }, 1400); };
    if (state.typedChars >= full.length) { renderTyped(); finish(); return; }
    typer = setInterval(function () {
      state.typedChars = Math.min(full.length, state.typedChars + 2);
      renderTyped();
      if (state.typedChars >= full.length) { clearInterval(typer); typer = null; finish(); }
    }, 28);
  }

  function renderTyped() {
    var full = draftText();
    typed.textContent = full.slice(0, state.typedChars);
    typed.parentNode.classList.toggle('is-done', state.typedChars >= full.length);
  }

  function goTo(i, byUser) {
    state.step = i;
    if (i <= 1) { state.typedChars = 0; state.edited = null; }
    if (i >= 2) state.typedChars = draftText().length;
    if (i !== 2) state.editing = false;
    // Jumping to a step by hand keeps the example playing from there, unless it ended.
    if (byUser && i < LAST) state.playing = true;
    renderDemo();
    schedule();
  }

  function renderDemo() {
    var s = state.step;
    demo.querySelectorAll('[data-f]').forEach(function (n) { n.textContent = c(n.getAttribute('data-f')); });
    editBtn.textContent = state.editing ? c('editing') : c('edit');
    editBtn.disabled = state.editing;

    stepButtons.forEach(function (b, i) {
      b.querySelector('.step-label').textContent = c('steps')[i];
      b.classList.toggle('is-done', i < s);
      b.classList.toggle('is-active', i === s);
      if (i === s) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.setAttribute('aria-label', c('stepLabel') + ' ' + (i + 1) + ': ' + c('steps')[i]);
    });
    stepsList.style.setProperty('--progress', (s / LAST) * 100 + '%');

    panels.forEach(function (p, i) { p.classList.toggle('is-shown', i === s); p.setAttribute('aria-hidden', i === s ? 'false' : 'true'); p.inert = i !== s; });

    renderTyped();
    if (!state.editing) draftBox.value = draftText();
    draftBox.readOnly = !state.editing;

    var cap = c('captions')[s];
    captionActor.textContent = c('actors')[cap[0]];
    captionActor.className = 'actor actor-' + cap[0];
    captionText.textContent = cap[1];

    var ended = s === LAST && !state.playing;
    var mode = ended ? 'replay' : (state.playing ? 'pause' : 'play');
    toggleBtn.setAttribute('data-mode', mode);
    toggleBtn.setAttribute('aria-label', c(mode));
    toggleBtn.title = c(mode);
  }

  toggleBtn.addEventListener('click', function () {
    var mode = toggleBtn.getAttribute('data-mode');
    if (mode === 'replay') { state.playing = true; goTo(0); return; }
    state.playing = mode === 'play';
    renderDemo();
    schedule();
  });

  approveBtn.addEventListener('click', function () {
    if (state.editing) state.edited = draftBox.value;
    state.editing = false;
    state.playing = true;
    goTo(3);
  });

  editBtn.addEventListener('click', function () {
    state.editing = true;
    renderDemo();
    draftBox.focus();
    draftBox.setSelectionRange(draftBox.value.length, draftBox.value.length);
  });

  draftBox.addEventListener('input', function () { if (state.editing) state.edited = draftBox.value; });

  /* ---------- Flow diagram ---------- */

  var tabsBox = document.getElementById('flow-tabs');
  var lanesBox = document.getElementById('lanes');
  var links = document.getElementById('links');
  var flowName = document.getElementById('flow-name');
  var playBtn = document.getElementById('flow-play');
  var SVGNS = 'http://www.w3.org/2000/svg';
  var L = lang === 'es' ? 2 : 1;

  var current = 0;
  var nodes = [];
  var playTimer = null;
  var playedOnce = false;

  var tabs = FLOWS.map(function (f, i) {
    var b = el('button', 'tab');
    b.type = 'button';
    b.id = 'tab-' + f.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'flow-panel');
    b.addEventListener('click', function () { selectFlow(i, true); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, n = FLOWS.length, next = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') next = (i + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') next = (i - 1 + n) % n;
      else if (k === 'Home') next = 0;
      else if (k === 'End') next = n - 1;
      if (next === null) return;
      e.preventDefault();
      selectFlow(next, true);
      tabs[next].focus();
    });
    tabsBox.appendChild(b);
    return b;
  });

  function renderTabs() {
    tabs.forEach(function (b, i) {
      b.textContent = FLOWS[i].tab[L - 1];
      var on = i === current;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    document.getElementById('flow-panel').setAttribute('aria-labelledby', tabs[current].id);
  }

  function buildDiagram() {
    var flow = FLOWS[current];
    flowName.textContent = flow.name[L - 1];
    // Clear everything except the SVG layer.
    Array.prototype.slice.call(lanesBox.children).forEach(function (n) { if (n !== links) lanesBox.removeChild(n); });
    lanesBox.style.setProperty('--cols', flow.steps.length);

    LANES.forEach(function (lane, r) {
      var band = el('div', 'lane lane-' + lane);
      band.style.setProperty('--row', r + 1);
      var label = el('span', 'lane-label', COPY[lang].lanes[lane]);
      band.appendChild(label);
      lanesBox.appendChild(band);
    });

    var list = el('ol', 'nodes');
    nodes = flow.steps.map(function (s, i) {
      var li = el('li', 'node node-' + s[0]);
      li.style.setProperty('--col', i + 1);
      li.style.setProperty('--row', LANES.indexOf(s[0]) + 1);
      li.appendChild(el('span', 'node-num', String(i + 1)));
      var body = el('span', 'node-body');
      body.appendChild(el('span', 'node-lane', COPY[lang].lanes[s[0]]));
      body.appendChild(el('span', 'node-text', s[L]));
      li.appendChild(body);
      list.appendChild(li);
      return li;
    });
    lanesBox.appendChild(list);
    drawLinks();
  }

  // Connectors are drawn from the real node boxes, so they follow the layout
  // at any width: left-to-right across lanes on wide screens, top-to-bottom on phones.
  function drawLinks() {
    while (links.firstChild) links.removeChild(links.firstChild);
    var box = lanesBox.getBoundingClientRect();
    links.setAttribute('width', box.width);
    links.setAttribute('height', box.height);
    links.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    var vertical = window.getComputedStyle(lanesBox).getPropertyValue('--vertical').trim() === '1';

    for (var i = 0; i < nodes.length - 1; i++) {
      var a = nodes[i].getBoundingClientRect();
      var b = nodes[i + 1].getBoundingClientRect();
      var d, head;
      if (vertical) {
        var x = a.left - box.left + 22;
        var y1 = a.bottom - box.top, y2 = b.top - box.top - 1;
        d = 'M' + x + ' ' + y1 + ' L' + x + ' ' + (y2 - 6);
        head = 'M' + (x - 5) + ' ' + (y2 - 7) + ' L' + x + ' ' + y2 + ' L' + (x + 5) + ' ' + (y2 - 7) + 'z';
      } else {
        var x1 = a.right - box.left, ay = a.top + a.height / 2 - box.top;
        var x2 = b.left - box.left - 1, by = b.top + b.height / 2 - box.top;
        var mid = (x1 + x2) / 2;
        d = 'M' + x1 + ' ' + ay + ' C' + mid + ' ' + ay + ' ' + mid + ' ' + by + ' ' + (x2 - 6) + ' ' + by;
        head = 'M' + (x2 - 7) + ' ' + (by - 5) + ' L' + x2 + ' ' + by + ' L' + (x2 - 7) + ' ' + (by + 5) + 'z';
      }
      var g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'link');
      var path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'link-line');
      var arrow = document.createElementNS(SVGNS, 'path');
      arrow.setAttribute('d', head);
      arrow.setAttribute('class', 'link-head');
      g.appendChild(path);
      g.appendChild(arrow);
      links.appendChild(g);
    }
    paintProgress(lanesBox.getAttribute('data-progress'));
  }

  // progress: number of steps lit so far ('all' when the flow is not playing).
  function paintProgress(progress) {
    var lit = progress == null || progress === 'all' ? nodes.length : Number(progress);
    var playing = progress != null && progress !== 'all';
    nodes.forEach(function (n, i) {
      n.classList.toggle('is-dim', playing && i >= lit);
      n.classList.toggle('is-active', playing && i === lit - 1);
    });
    Array.prototype.forEach.call(links.querySelectorAll('.link'), function (g, i) {
      g.classList.toggle('is-dim', playing && i >= lit - 1);
    });
  }

  function setProgress(p) {
    if (p == null) lanesBox.removeAttribute('data-progress'); else lanesBox.setAttribute('data-progress', p);
    paintProgress(p);
  }

  function playFlow() {
    clearTimeout(playTimer);
    if (reduceMotion) { setProgress(null); return; }
    var i = 1;
    setProgress(1);
    (function tick() {
      playTimer = setTimeout(function () {
        i++;
        if (i > nodes.length) { setProgress(null); return; }
        setProgress(i);
        tick();
      }, 850);
    })();
  }

  function selectFlow(i, play) {
    current = i;
    clearTimeout(playTimer);
    setProgress(null);
    renderTabs();
    buildDiagram();
    if (play) playFlow();
  }

  playBtn.addEventListener('click', playFlow);

  var resizeRaf = null;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(drawLinks);
  });
  // Fonts change node sizes once they load; redraw so the arrows still meet the boxes.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLinks);

  // Play the diagram the first time it scrolls into view.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !playedOnce) { playedOnce = true; playFlow(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(lanesBox);
  }

  /* ---------- Language ---------- */

  document.addEventListener('gullin:lang', function (e) {
    lang = e.detail === 'es' ? 'es' : 'en';
    L = lang === 'es' ? 2 : 1;
    if (state.step === 1 && state.typedChars < draftText().length) {
      // Restart the typing in the new language rather than mixing the two.
      state.typedChars = 0;
    }
    renderDemo();
    if (state.step === 1) schedule();
    renderTabs();
    buildDiagram();
  });

  renderDemo();
  schedule();
  selectFlow(0, false);
})();
