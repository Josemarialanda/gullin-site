// Fills [data-t] elements from window.BANNER_COPY. Render with ?lang=es for Spanish.
(function () {
  var lang = new URLSearchParams(location.search).get('lang') === 'es' ? 'es' : 'en';
  document.documentElement.lang = lang;
  var copy = (window.BANNER_COPY || {})[lang] || {};
  document.querySelectorAll('[data-t]').forEach(function (el) {
    var v = copy[el.getAttribute('data-t')];
    if (v != null) el.innerHTML = v;
  });
})();
