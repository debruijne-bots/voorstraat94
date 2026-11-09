// Meldformulier (minimaal): omschrijving, foto maken of kiezen, spoed. Geen adres: Rent herkent de huurder aan zijn mailadres.
// Statische site: foto's gaan op de telefoon via het deelscherm naar de mail-app; anders opent een mail zonder bijlage.
// In het portaal (later) gaat de melding met foto's in één keer naar de server. Er wordt hier niets opgeslagen.
(function () {
  var form = document.getElementById('meldform');
  if (!form) return;
  var MAIL = 'Voorstraat94abcd@gmail.com';
  var it = (document.documentElement.lang || '').indexOf('it') === 0;
  var fotos = [];
  var preview = document.getElementById('f-preview');

  function toon() {
    if (!preview) return;
    preview.innerHTML = '';
    fotos.forEach(function (f, i) {
      var fig = document.createElement('figure');
      var img = document.createElement('img');
      img.alt = '';
      img.src = URL.createObjectURL(f);
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'foto-weg';
      x.setAttribute('aria-label', it ? 'Rimuovi foto' : 'Foto verwijderen');
      x.textContent = '\u00d7';
      x.addEventListener('click', function () { fotos.splice(i, 1); toon(); });
      fig.appendChild(img); fig.appendChild(x); preview.appendChild(fig);
    });
  }
  ['f-camera', 'f-fotos'].forEach(function (id) {
    var inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener('change', function () {
      for (var i = 0; i < inp.files.length && fotos.length < 6; i++) fotos.push(inp.files[i]);
      inp.value = '';
      toon();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var wat = (document.getElementById('f-wat').value || '').trim();
    var spoed = document.getElementById('f-spoed').checked;
    var kort = wat ? wat.split(/\s+/).slice(0, 6).join(' ') : (it ? 'segnalazione' : 'melding');
    var subject = (spoed ? 'SPOED - ' : '') + (it ? 'Segnalazione: ' : 'Melding: ') + kort;
    var body = wat + '\r\n';

    function perMail() {
      window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
    if (fotos.length && navigator.canShare && navigator.canShare({ files: fotos })) {
      navigator.share({ title: subject, text: MAIL + '\r\n' + subject + '\r\n\r\n' + body, files: fotos })
        .catch(function (err) { if (!err || err.name !== 'AbortError') perMail(); });
    } else {
      perMail();
    }
  });
})();

// Tekstgrootte: Normaal / Groter / Extra groot. Keuze wordt op dit apparaat onthouden (localStorage), nergens anders.
(function () {
  var KEY = 'hw-tekstgrootte';
  var root = document.documentElement;
  var knoppen = document.querySelectorAll('.tg');
  if (!knoppen.length) return;

  function zet(g, bewaar) {
    root.classList.remove('tekst-groter', 'tekst-extra');
    if (g === 'groter' || g === 'extra') root.classList.add('tekst-' + g);
    for (var i = 0; i < knoppen.length; i++) {
      knoppen[i].setAttribute('aria-pressed', knoppen[i].getAttribute('data-grootte') === g ? 'true' : 'false');
    }
    if (bewaar) { try { localStorage.setItem(KEY, g); } catch (e) {} }
  }

  var start = 'normaal';
  try { start = localStorage.getItem(KEY) || 'normaal'; } catch (e) {}
  zet(start, false);

  for (var i = 0; i < knoppen.length; i++) {
    knoppen[i].addEventListener('click', function () { zet(this.getAttribute('data-grootte'), true); });
  }
})();

// Taalkeuze NL / IT: de keuze wordt op dit apparaat onthouden (localStorage), nergens anders.
(function () {
  var links = document.querySelectorAll('.taalkeuze a[data-taal]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      try { localStorage.setItem('hw-taal', this.getAttribute('data-taal')); } catch (e) {}
    });
  }
})();
