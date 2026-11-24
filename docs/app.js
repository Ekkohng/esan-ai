/* Esan AI — site behaviour: theme, menu, scroll story, chat. No dependencies. */
(function () {
  'use strict';
  var page = document.querySelector('.page');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  /* ---------- theme ---------- */
  var themeBtn = document.getElementById('theme-btn');
  function applyTheme(t) {
    page.setAttribute('data-theme', t);
    var label = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('title', label);
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#131315' : '#FFFFFF');
  }
  applyTheme(page.getAttribute('data-theme') || 'light');
  themeBtn.addEventListener('click', function () {
    var next = page.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('esan-theme', next); } catch (e) {}
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  /* ---------- scroll story ----------
     Each .scene is a tall track with a sticky stage; its .frame children cross-fade with blur,
     and [data-step] items build up one by one. Reversible when scrolling back up. */
  var fx = false, raf = 0, wasStatic = true;
  var active = null;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function paint(el, v, dir) {
    el.style.opacity = v.toFixed(3);
    el.style.visibility = v <= 0.01 ? 'hidden' : '';
    el.style.pointerEvents = v < 0.6 ? 'none' : '';
    if (v >= 0.999) { el.style.filter = ''; el.style.transform = ''; return; }
    el.style.filter = 'blur(' + ((1 - v) * 14).toFixed(1) + 'px)';
    el.style.transform = 'translateY(' + (dir * (1 - v) * 48).toFixed(1) + 'px) scale(' + (0.97 + 0.03 * v).toFixed(3) + ')';
  }
  function reset(el) {
    el.style.opacity = ''; el.style.visibility = ''; el.style.pointerEvents = ''; el.style.filter = ''; el.style.transform = '';
  }
  var bar = document.querySelector('.navprog');
  function tick() {
    var vh = window.innerHeight || 800;
    if (bar) {
      var doc = document.scrollingElement || document.documentElement;
      var max = Math.max(1, doc.scrollHeight - vh);
      bar.style.transform = 'scaleX(' + clamp((window.scrollY || doc.scrollTop || 0) / max).toFixed(4) + ')';
    }
    if (!fx) {
      if (!wasStatic) { document.querySelectorAll('.frame, [data-step]').forEach(reset); wasStatic = true; }
      return;
    }
    wasStatic = false;
    document.querySelectorAll('.scene').forEach(function (scene) {
      if (active && !active.has(scene)) return;
      var pos = -scene.getBoundingClientRect().top / vh;
      var frames = scene.querySelectorAll('.frame');
      var spans = [], total = 0;
      frames.forEach(function (f) { var s = parseFloat(f.getAttribute('data-span')) || 1; spans.push(s); total += s; });
      var start = 0;
      frames.forEach(function (f, i) {
        var L = spans[i], s = start, e = start + L;
        start = e;
        var lo = i === 0 ? clamp((pos + 0.6) / 0.5) : clamp((pos - (s - 0.12)) / 0.3);
        var hi = i === frames.length - 1 ? clamp((total + 0.6 - pos) / 0.5) : clamp(((e + 0.12) - pos) / 0.3);
        paint(f, Math.min(lo, hi), pos < (s + e) / 2 ? 1 : -1);
        var steps = f.querySelectorAll('[data-step]');
        if (steps.length) {
          var lp = (pos - s) / L, m = steps.length;
          steps.forEach(function (st, k) {
            var th = 0.02 + 0.5 * (m > 1 ? k / (m - 1) : 0);
            var sv = clamp((lp - th) / 0.1);
            st.style.opacity = sv.toFixed(3);
            st.style.filter = sv >= 0.999 ? '' : 'blur(' + ((1 - sv) * 8).toFixed(1) + 'px)';
            st.style.transform = sv >= 0.999 ? '' : 'translateY(' + ((1 - sv) * 22).toFixed(1) + 'px)';
          });
        }
      });
    });
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tick(); }); }
  function onResize() {
    fx = !reduce.matches;
    page.classList.toggle('fx', fx);
    tick();
  }
  if ('IntersectionObserver' in window) {
    active = new Set();
    var sceneIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) active.add(e.target); else active.delete(e.target); });
      tick();
    }, { rootMargin: '100% 0px 100% 0px' });
    document.querySelectorAll('.scene').forEach(function (s) { sceneIO.observe(s); });
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('in', e.isIntersecting); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (r) { revealIO.observe(r); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (r) { r.classList.add('in'); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  if (reduce.addEventListener) reduce.addEventListener('change', onResize);
  onResize();

  /* ---------- chat ---------- */
  var API = (window.ESAN_CHAT_API || '').trim();
  var DIALECT = window.ESAN_CHAT_DIALECT || null;
  var log = document.querySelector('.cb-log');
  var form = document.getElementById('cb-form');
  var input = document.getElementById('cb-input');
  var send = form.querySelector('.cb-send');
  var chips = document.getElementById('cb-chips');
  var history = [];
  var busy = false;

  if (API) {
    document.getElementById('cb-mode').textContent = 'live';
    document.getElementById('cb-note').textContent = 'Esan words come only from a list checked by native speakers.';
  }

  function add(cls, text) {
    var d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function typing() {
    var t = document.createElement('div');
    t.className = 'cb-typing';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-label', 'Esan AI is typing');
    t.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }

  function previewReply(q) {
    var t = q.toLowerCase();
    if (/(how do (you|i) say|translate|in esan|what does .* mean|word for)/.test(t)) {
      return "I don't have verified Esan words loaded in this preview, so I won't guess.\n\nIn the live chat I answer from a word list checked by native speakers, with tone marks and the dialect each word comes from. If a word isn't on the list yet, I'll say so.";
    }
    if (/(esantop|terminal|monitor|dashboard)/.test(t)) {
      return "esantop is the Esan AI terminal: one screen to watch the work, from corpus hours per dialect and tone coverage to training jobs and the tone QA review queue.\n\nIt's at the design stage, and the build is next. See github.com/Ekkohng/esantop.";
    }
    if (/(help|contribute|join|volunteer)/.test(t)) {
      return "Thank you! Speakers can record words, linguists can guide spelling and tone, and engineers can help build the models.\n\nStart at github.com/Ekkohng/esan-ai or email osereme@arreba.net.";
    }
    if (/(tone|pitch|intonation)/.test(t)) {
      return "Esan is tonal: the same syllables said with a different pitch can mean different things.\n\nWritten tone marks show it: á is high, à is low, â falls, ǎ rises. That's why every word in the dataset keeps its tone marks, and why the speech engine has to learn real intonation.";
    }
    if (/(dialect|uromi|ekpoma|irrua|ubiaja|ugboha|igueben|ewohimi|ewu)/.test(t)) {
      return "Esan is spoken across many towns, such as Uromi, Ekpoma, Irrua, Ubiaja, Ugboha, Igueben, Ewohimi and Ewu, and each has its own melody.\n\nEvery recording and word is tagged with its dialect, so the AI learns them side by side.";
    }
    if (/(progress|status|done|next|roadmap)/.test(t)) {
      return "So far: the plan is drawn, the repo is open on GitHub, prototype tools are built (spelling normaliser, tone tiers, IPA converter, dialect registry), and a first list of about 70 words is out to native speakers for recording. esantop is being designed.\n\nNext: a pilot dataset from one dialect, then first models that hear and speak.";
    }
    if (/(what is|about|who|why|esan ai)/.test(t)) {
      return "Esan AI is an open project teaching machines to understand and speak Esan, a language of Edo State, Nigeria.\n\nThe goal: an AI that hears Esan, speaks it with real intonation in every dialect, translates it, and helps people learn it.";
    }
    return "In this preview I can talk about the project: its vision, goals, dialects, tone, esantop and progress.\n\nOnce the live chat is connected, I'll also answer about Esan words from the verified list.";
  }

  function done() { busy = false; send.disabled = false; input.focus({ preventScroll: true }); }

  function ask(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    busy = true; send.disabled = true;
    if (chips) chips.hidden = true;
    add('cb-msg cb-me', text);
    var t = typing();

    if (!API) {
      setTimeout(function () { t.remove(); add('cb-msg cb-bot', previewReply(text)); done(); }, 900);
      return;
    }
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(-20), dialect: DIALECT })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        t.remove();
        if (!res.ok || !res.j.reply) { add('cb-msg cb-err', res.j.error || 'Something went wrong. Please try again.'); return; }
        add('cb-msg cb-bot', res.j.reply);
        if (res.j.sources && res.j.sources.length) {
          add('cb-src', 'From the verified list: ' + res.j.sources.map(function (s) { return s.text + ' (' + s.dialect + ')'; }).join(', '));
        }
        history.push({ role: 'user', content: text }, { role: 'assistant', content: res.j.reply });
      })
      .catch(function () { t.remove(); add('cb-msg cb-err', "Couldn't reach Esan AI. Check your connection and try again."); })
      .then(done);
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
  if (chips) chips.addEventListener('click', function (e) { var b = e.target.closest('.cb-chip'); if (b) ask(b.textContent); });
})();
