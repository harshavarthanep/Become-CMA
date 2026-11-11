/* Rank Rank — Subjects module.
   Separate MCQ practice for other papers (SFM, SCM, DT …). Configure subjects in data/subjects/index.js.
   It never touches the Law questions, rings, stats or starred list — its progress lives in its own "subj" record,
   which is still included in the app's save, internal mirror and folder backups. */
(() => {
  'use strict';
  const SUBJECTS = window.RR_SUBJECTS || [];
  if (!SUBJECTS.length) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = s => { s = Math.max(0, Math.round(s)); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const vib = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  const ready = cb => (window.__rr && window.__rr.S) ? cb() : setTimeout(() => ready(cb), 60);
  const ICON = {
    subjects: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="7" rx="2"/><rect x="14" y="4" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    xs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>',
    skip: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 6v12l9-6zM16 6h3v12h-3z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    starf: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 9 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5 7.5 7.5l-6 6"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.3 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z"/></svg>',
    no: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 12.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1Z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>'
  };

  /* ---------- Storage: inside the app's state so saving, mirroring and backups include it ---------- */
  const store = () => { const S = window.__rr.S; const d = (S.subj ||= {}); d.stats ||= {}; d.marked ||= {}; d.sel ||= {}; d.days ||= {}; return d; };
  const persist = () => { try { window.__rr.saveNow(); } catch (e) {} };

  /* ---------- Load a subject's MCQ file on demand ---------- */
  const loading = {};
  const loadMCQ = s => {
    if (!s.mcq) return Promise.resolve(null);
    if (window.RR_MCQ && window.RR_MCQ[s.id]) return Promise.resolve(window.RR_MCQ[s.id]);
    return loading[s.id] ||= new Promise((res, rej) => { const el = document.createElement('script'); el.src = s.mcq; el.onload = () => res((window.RR_MCQ || {})[s.id] || null); el.onerror = () => { delete loading[s.id]; rej(new Error('load')); }; document.head.append(el); });
  };
  const subj = id => SUBJECTS.find(s => s.id === id);

  /* ---------- Open a subject PDF in the app's existing viewer ---------- */
  function openPdf(s, idx, page, flash) {
    const pdf = s.pdfs && s.pdfs[idx]; if (!pdf) return;
    const key = 'SUBJ:' + s.id + ':' + idx; const files = window.BANK.files;
    files[key] = { name: pdf.name, file: pdf.file, subject: s.id };
    window.__rr.Viewer.open(key, page || undefined, flash ? { flash } : {});
    const v = $('#viewer'); const mo = new MutationObserver(() => { if (!v.classList.contains('open')) { mo.disconnect(); delete files[key]; if ($('#subjsheet')?.classList.contains('open')) document.body.style.overflow = 'hidden'; } }); mo.observe(v, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- Styles (only for this module) ---------- */
  document.head.append(h(`<style>
    .subjcard{display:flex;gap:14px;align-items:center;width:100%;text-align:left;background:var(--bg2);border-radius:var(--r-lg);padding:16px;box-shadow:var(--shadow);margin-bottom:12px;transition:transform .2s var(--pop)}
    .subjcard:active{transform:scale(.98)}
    .subjcard .sic{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:15px;flex:0 0 48px}
    .subjcard .stx{flex:1;min-width:0}.subjcard b{display:block;font-size:17px;line-height:1.25}.subjcard span{font-size:13px;color:var(--label2)}
    .tchips{display:flex;flex-wrap:wrap;gap:8px}.tchips .chip{padding:7px 12px;font-size:13.5px}.tchips .chip.on{background:var(--blue);color:#fff}
    .subjmodal{position:fixed;z-index:115;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,420px);background:var(--bg);border-radius:20px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:pop .25s var(--pop)}
    .subjmodal h3{margin:0 0 6px;font-size:19px}.subjscrim{position:fixed;inset:0;z-index:114;background:rgba(0,0,0,.32)}
    .keynote{margin-top:12px;border-radius:14px;padding:12px 14px;font-size:14.5px;background:color-mix(in srgb,var(--orange) 10%,var(--bg2));border:1px solid color-mix(in srgb,var(--orange) 28%,transparent)}
  </style>`));

  /* ---------- Tab in the bottom bar and sidebar ---------- */
  function addTabs() {
    const mk = cls => { const a = h(`<a class="${cls}" href="#subjects" data-tab="subjects">${ICON.subjects}<span>Subjects</span></a>`); return a; };
    const tb = $('#tabbar'), sb = $('#sidetabs');
    if (tb && !tb.querySelector('[data-tab=subjects]')) { const last = tb.querySelector('[data-tab=progress]'); tb.insertBefore(mk('tab'), last); }
    if (sb && !sb.querySelector('[data-tab=subjects]')) { const last = sb.querySelector('[data-tab=progress]'); sb.insertBefore(mk('sidetab'), last); }
  }

  /* ---------- Pages ---------- */
  function statsFor(s, data) {
    const st = store().stats; let att = 0, n = 0, c = 0;
    (data ? data.items : []).forEach(i => { const x = st[i.id]; if (x) { att++; n += x.n; c += x.c; } });
    return { att, acc: n ? Math.round(c / n * 100) : null, total: data ? data.items.length : 0 };
  }
  async function pageList(main) {
    const p = h(`<div class="page"><header class="navbar"><div><p class="eyebrow">Other papers · kept separate from Law</p><h1 class="largetitle">Subjects</h1></div></header><div id="sl"></div>
      <p class="foot">Add more subjects, MCQ files or PDFs in <b>data/subjects/index.js</b> — the steps are written at the top of that file.</p></div>`);
    main.append(p); const box = $('#sl', p);
    for (const s of SUBJECTS) {
      const card = h(`<button class="subjcard" type="button"><span class="sic" style="background:var(--${s.color || 'blue'})">${esc(s.id.slice(0, 3))}</span><div class="stx"><b>${esc(s.name)}</b><span>${esc(s.paper || '')}${s.pdfs?.length ? ' · ' + s.pdfs.length + ' PDF' + (s.pdfs.length > 1 ? 's' : '') : ''}</span><div class="sst" style="font-size:13px;color:var(--label2);margin-top:4px">${s.mcq ? 'Loading…' : 'PDFs only'}</div><div class="bar" style="display:${s.mcq ? 'block' : 'none'}"><i style="width:0;background:var(--${s.color || 'blue'})"></i></div></div>${ICON.chev}</button>`);
      card.onclick = () => location.hash = '#subjects/' + s.id; box.append(card);
      if (s.mcq) loadMCQ(s).then(d => { const t = statsFor(s, d); $('.sst', card).textContent = `${t.total} MCQs · ${t.att} attempted${t.acc != null ? ' · ' + t.acc + '% correct' : ''}`; $('.bar i', card).style.width = (t.total ? t.att / t.total * 100 : 0) + '%'; }).catch(() => { $('.sst', card).textContent = 'Couldn’t load questions — check the file path in index.js'; });
    }
  }
  async function pageSubject(main, s) {
    const d = store(); const sel = d.sel[s.id] ||= { topics: null, count: 20, mode: 'all', timer: true };
    const p = h(`<div class="page"><header class="navbar"><div><a href="#subjects" class="eyebrow" style="color:var(--blue);display:inline-flex;align-items:center;gap:2px">${ICON.prev.replace('<svg', '<svg width="14" height="14"')}Subjects</a><h1 class="largetitle" style="font-size:30px">${esc(s.name)}</h1><p class="greetline">${esc(s.paper || '')}</p></div></header><div id="sb"><div class="spinner"></div></div></div>`);
    main.append(p); const body = $('#sb', p);
    let data = null; try { data = await loadMCQ(s); } catch (e) { body.innerHTML = '<div class="card empty">Couldn’t load the MCQ file. Check the path in data/subjects/index.js.</div>'; }
    body.innerHTML = '';
    if (data) {
      const t = statsFor(s, data); const starred = data.items.filter(i => d.marked[s.id + '|' + i.id]).length; const wrong = data.items.filter(i => { const x = d.stats[i.id]; return x && x.last === false; }).length;
      body.append(h(`<div class="stat3" style="margin-top:0"><div><b>${t.total}</b><span>MCQs</span></div><div><b>${t.att}</b><span>attempted</span></div><div><b>${t.acc == null ? '—' : t.acc + '%'}</b><span>correct</span></div></div>`));
      if (data.items.some(i => i.ak === 'tick' || !i.a)) body.append(h(`<div class="keynote"><b>${ICON.info} About the answers</b><br>${data.items.filter(i => i.ak === 'tick').length} answers were read from the handwritten ticks in your marked copy. ${data.items.filter(i => !i.a).length} questions had no clear tick — for those you check yourself against the marked PDF page.</div>`));
      body.append(h(`<div class="group-h">Practise</div>`));
      const seg = h(`<div class="seg" role="group">${[['all', 'All'], ['new', 'Not attempted'], ['wrong', 'Mistakes (' + wrong + ')'], ['star', 'Starred (' + starred + ')']].map(([k, l]) => `<button aria-pressed="${sel.mode === k}" data-m="${k}">${l}</button>`).join('')}</div>`); body.append(seg);
      body.append(h(`<div class="group-h" style="display:flex;justify-content:space-between"><span>Topics</span><button class="tall" style="color:var(--blue);font-size:13px">Select all</button></div>`));
      const chips = h('<div class="tchips"></div>'); body.append(chips);
      const drawChips = () => { chips.innerHTML = ''; data.topics.forEach(tp => { const n = data.items.filter(i => i.t === tp.id).length; if (!n) return; const on = !sel.topics || sel.topics.includes(tp.id); const c = h(`<button class="chip ${on ? 'on' : ''}" type="button">${esc(tp.name)} · ${n}</button>`); c.onclick = () => { let cur = sel.topics ? sel.topics.slice() : data.topics.map(x => x.id); cur = cur.includes(tp.id) ? cur.filter(x => x !== tp.id) : cur.concat(tp.id); sel.topics = cur.length === data.topics.length ? null : cur; persist(); drawChips(); }; chips.append(c); }); };
      $('.tall', body).onclick = () => { sel.topics = null; persist(); drawChips(); };
      drawChips();
      body.append(h(`<div class="list" style="margin-top:14px"><div class="row plain"><div class="tx"><div class="t1">Questions</div></div><div class="stepper"><button data-s="-" aria-label="Fewer">−</button><b class="cnt">${sel.count}</b><button data-s="+" aria-label="More">+</button></div></div><label class="row plain"><div class="tx"><div class="t1">Timer</div><div class="t2">90 seconds per MCQ</div></div><span class="switch"><input type="checkbox" class="tmr" ${sel.timer ? 'checked' : ''}><span></span></span></label></div>`));
      $$('[data-s]', body).forEach(b => b.onclick = () => { sel.count = Math.max(5, Math.min(100, sel.count + (b.dataset.s === '+' ? 5 : -5))); $('.cnt', body).textContent = sel.count; persist(); });
      $('.tmr', body).onchange = e => { sel.timer = e.target.checked; persist(); };
      $$('button', seg).forEach(b => b.onclick = () => { sel.mode = b.dataset.m; $$('button', seg).forEach(x => x.setAttribute('aria-pressed', x === b)); persist(); });
      const go = h(`<button class="btn primary block" style="margin-top:16px;min-height:56px;font-size:18px">${ICON.play} Start practice</button>`); body.append(go);
      go.onclick = () => {
        let pool = data.items;
        if (sel.mode === 'star') pool = pool.filter(i => d.marked[s.id + '|' + i.id]);
        else { pool = pool.filter(i => !sel.topics || sel.topics.includes(i.t)); if (sel.mode === 'new') pool = pool.filter(i => !d.stats[i.id]); if (sel.mode === 'wrong') pool = pool.filter(i => d.stats[i.id] && d.stats[i.id].last === false); }
        if (!pool.length) return toast(sel.mode === 'star' ? 'Nothing starred yet in this subject' : 'No questions match — change the topics or filter');
        const q = sel.mode === 'star' ? shuffle(pool.slice()) : shuffle(pool.slice()).slice(0, sel.count);
        Run.start(s, data, q.map(i => ({ id: i.id })), s.id + ' practice', sel.timer);
      };
    }
    if (s.pdfs && s.pdfs.length) {
      body.append(h(`<div class="group-h">PDFs</div>`)); const l = h('<div class="list"></div>');
      s.pdfs.forEach((f, i) => { const r = h(`<button class="row tap" type="button"><span class="ic" style="background:var(--${s.color || 'blue'})">${ICON.doc}</span><div class="tx"><div class="t1">${esc(f.name)}</div><div class="t2">${esc(f.file.split('/').pop())}</div></div>${ICON.chev}</button>`); r.onclick = () => openPdf(s, i); l.append(r); });
      body.append(l);
    }
  }
  function toast(m) { const t = $('#toast'); if (!t) return; t.innerHTML = '<span>' + esc(m) + '</span>'; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2400); }
  function confirmBox(title, text, yes, no, onYes, onNo) {
    const sc = h('<div class="subjscrim"></div>'), m = h(`<div class="subjmodal" role="dialog"><h3>${esc(title)}</h3><p style="margin:0 0 14px;color:var(--label2)">${esc(text)}</p><div class="btnrow"><button class="btn gray"><span>${esc(no)}</span></button><button class="btn primary"><span>${esc(yes)}</span></button></div></div>`);
    const done = () => { sc.remove(); m.remove(); };
    m.querySelectorAll('.btn')[1].onclick = () => { done(); onYes && onYes(); }; m.querySelectorAll('.btn')[0].onclick = () => { done(); onNo && onNo(); }; sc.onclick = () => { done(); onYes && onYes(); };
    document.body.append(sc, m);
  }

  /* ---------- Practice session (its own sheet) ---------- */
  const Run = {
    el: null,
    start(s, data, q, title, timer) {
      this.s = s; this.data = data; this.by = Object.fromEntries(data.items.map(i => [i.id, i])); this.q = q; this.i = 0; this.title = title; this.timer = timer; this.t0 = Date.now();
      if (!this.el) { this.el = h(`<section class="sheet" id="subjsheet" role="dialog" aria-modal="true"></section>`); document.body.append(this.el); }
      this.el.innerHTML = `<div class="sheet-top"><button class="iconbtn" data-a="x" aria-label="Close">${ICON.close}</button><button class="iconbtn" data-a="back" aria-label="Previous question">${ICON.prev}</button><div class="ttl"><span class="t1x"></span><small class="t2x"></small></div><span class="tmr"></span><button class="iconbtn" data-a="star" aria-label="Star">${ICON.star}</button></div><div class="progress"><i class="pg"></i></div><div class="sheet-body sb"></div>`;
      $('[data-a=x]', this.el).onclick = () => this.close(); $('[data-a=back]', this.el).onclick = () => { if (this.i > 0) { this.stop(); this.i--; this.render(); } };
      $('[data-a=star]', this.el).onclick = () => { const k = s.id + '|' + this.cur.id; const m = store().marked; if (m[k]) { delete m[k]; toast('Removed from starred'); } else { m[k] = Date.now(); toast('Starred'); vib(15); } persist(); this.starUI(); };
      requestAnimationFrame(() => this.el.classList.add('open')); document.body.style.overflow = 'hidden';
      this.keys = e => { if (!this.el.classList.contains('open') || $('#viewer').classList.contains('open') || $('.subjmodal')) return; const k = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', a: 'A', b: 'B', c: 'C', d: 'D' }[e.key.toLowerCase()]; if (k && !this.cur.done) $(`.opt[data-k="${k}"]`, this.el)?.click(); if (e.key === 'Enter') { e.preventDefault(); $('.actions .btn.primary', this.el)?.click(); } };
      document.addEventListener('keydown', this.keys);
      this.render();
    },
    get cur() { return this.q[this.i]; },
    starUI() { const on = !!store().marked[this.s.id + '|' + this.cur?.id]; const b = $('[data-a=star]', this.el); b.innerHTML = on ? ICON.starf : ICON.star; b.style.color = on ? 'var(--yellow)' : 'var(--blue)'; },
    stop() { clearInterval(this.iv); this.iv = null; },
    clock() {
      this.stop(); const holder = $('.tmr', this.el); holder.innerHTML = ''; if (!this.timer) return null;
      const C = 2 * Math.PI * 12; const t = h(`<button class="timer" type="button" aria-label="Pause or resume"><svg viewBox="0 0 32 32"><circle class="tb" cx="16" cy="16" r="12"/><circle class="tf" cx="16" cy="16" r="12" stroke-dasharray="${C}"/></svg><b>1:30</b></button>`); holder.append(t);
      const st = { acc: 0, t0: Date.now(), run: true }; const el = () => (st.acc + (st.run ? Date.now() - st.t0 : 0)) / 1000;
      const tick = () => { const e = el(), over = e > 90; $('.tf', t).style.strokeDashoffset = C * (1 - Math.min(e / 90, 1)); t.classList.toggle('over', over); t.classList.toggle('paused', !st.run); $('b', t).textContent = over ? '+' + fmt(e - 90) : fmt(90 - e); };
      st.toggle = () => { if (st.run) { st.acc += Date.now() - st.t0; st.run = false; } else { st.t0 = Date.now(); st.run = true; } tick(); st.on && st.on(st.run); };
      st.elapsed = el; t.onclick = () => st.toggle(); this.iv = setInterval(tick, 500); tick(); return st;
    },
    render() {
      const body = $('.sb', this.el); body.innerHTML = ''; body.scrollTop = 0; const it = this.by[this.cur.id];
      if (!it) { this.q.splice(this.i, 1); return this.i >= this.q.length ? this.finish() : this.render(); }
      const tp = (this.data.topics.find(t => t.id === it.t) || {}).name || '';
      $('.t1x', this.el).textContent = this.s.name; $('.t2x', this.el).textContent = `${this.i + 1} of ${this.q.length} · ${tp}`;
      $('.pg', this.el).style.width = (this.q.filter(x => x.done).length / this.q.length * 100) + '%'; const bk = $('[data-a=back]', this.el); bk.disabled = this.i === 0; bk.style.opacity = this.i === 0 ? .35 : 1; this.starUI();
      const wrap = h('<div class="qwrap"></div>'); body.append(wrap);
      const card = h(`<article class="qcard"><div class="qmeta"><span class="chip blue">${esc(this.s.id)} · ${esc(tp)}</span><span class="chip">2 marks</span>${(it.tags || []).map(t => `<span class="chip purple">${esc(t)}</span>`).join('')}${this.cur.sk ? '<span class="chip orange">Skipped earlier</span>' : ''}</div><p class="qtext">${esc(it.q)}</p></article>`);
      const opts = h('<div class="opts" role="radiogroup"></div>'); let sel = this.cur.done ? this.cur.done.sel : null;
      Object.entries(it.o).forEach(([k, v]) => { const b = h(`<button class="opt" type="button" data-k="${k}" role="radio"><span class="l">${k}</span><span>${esc(v)}</span></button>`); b.onclick = () => { if (this.cur.done) return; sel = k; $$('.opt', opts).forEach(o => o.classList.toggle('sel', o === b)); chk.disabled = false; vib(8); }; opts.append(b); });
      card.append(opts); wrap.append(card);
      const acts = h('<div class="actions"></div>'); body.append(acts);
      const btn = (l, cls, fn, ic = '') => { const b = h(`<button class="btn ${cls}" type="button">${ic}<span>${esc(l)}</span></button>`); b.onclick = fn; return b; };
      const reveal = (selK, ok, self) => {
        $$('.opt', opts).forEach(o => { const k = o.dataset.k; o.classList.remove('sel'); if (it.a && k === it.a) o.classList.add('right'); else if (k === selK) o.classList.add(it.a ? 'wrong' : 'sel'); else o.classList.add('dim'); });
        const ans = h('<div class="ans"></div>');
        if (it.a) ans.append(h(`<div class="verdict ${ok ? 'ok' : 'no'}">${ok ? ICON.ok : ICON.no}<span>${ok ? 'Correct' : 'Not quite — answer ' + it.a}</span></div>`));
        else if (self != null) ans.append(h(`<div class="verdict ${self ? 'ok' : 'no'}">${self ? ICON.ok : ICON.no}<span>${self ? 'Marked as right' : 'Marked as wrong'}</span></div>`));
        const pdf = this.s.pdfs && this.s.pdfs[it.src ? it.src.pdf : 0];
        const panel = h(`<div class="panel"><div class="panel-h"><h3>${it.a ? 'Answer key' : 'Check the answer'}</h3></div><p style="margin:0 0 10px;font-size:15px">${it.a ? (it.ak === 'tick' ? 'Read from the handwritten tick in your marked copy — if it looks wrong, check the page.' : 'From the answer key in the book.') : 'No clear tick was found for this question. Open the marked PDF page and compare.'}</p></div>`);
        if (pdf) { const c = h(`<button class="chip blue" type="button">${ICON.doc.replace('width="16" height="16"', 'width="13" height="13"')} ${esc(pdf.name)} · p.${it.src.p}</button>`); c.onclick = () => openPdf(this.s, it.src.pdf, it.src.p, it.q.slice(0, 120)); panel.append(c); }
        ans.append(panel); card.after(ans); wrap.classList.add('split');
      };
      if (this.cur.done) {
        reveal(this.cur.done.sel, this.cur.done.ok, it.a ? null : this.cur.done.ok);
        acts.append(this.i > 0 ? btn('Back', 'gray', () => { this.i--; this.render(); }, ICON.prev) : '', btn('Next', 'primary', () => this.next(), ICON.next)); $('.tmr', this.el).innerHTML = ''; return;
      }
      const clk = this.clock();
      const record = (ok, secs) => { const st = store(); const x = (st.stats[it.id] ||= { n: 0, c: 0, w: 0 }); x.n++; if (ok) x.c++; else x.w++; x.last = ok; x.at = Date.now(); const dk = today(); const dd = (st.days[dk] ||= { n: 0, ok: 0, secs: 0 }); dd.n++; if (ok) dd.ok++; dd.secs += Math.round(secs || 0); this.cur.done = { sel, ok, secs: Math.round(secs || 0) }; persist(); };
      const chk = btn('Check', 'primary', () => {
        const secs = clk ? clk.elapsed() : 0; this.stop();
        if (it.a) { const ok = sel === it.a; record(ok, secs); vib(ok ? 20 : [40, 40, 40]); reveal(sel, ok); acts.innerHTML = ''; acts.append(btn('Next question', 'primary', () => this.next(), ICON.next)); }
        else { reveal(sel, null); acts.innerHTML = ''; acts.append(h('<p class="prompt">Were you right?</p>'), btn('I was wrong', 'red', () => { record(false, secs); this.next(); }, ICON.xs), btn('I was right', 'green', () => { record(true, secs); this.next(); }, ICON.check)); }
      }, ICON.check); chk.disabled = true;
      const pp = clk ? h(`<button class="btn gray icon" type="button" aria-label="Pause timer">${ICON.pause}</button>`) : null;
      if (pp) { pp.onclick = () => clk.toggle(); clk.on = run => { pp.innerHTML = run ? ICON.pause : ICON.play; pp.classList.toggle('resume', !run); }; }
      acts.append(btn('Skip', 'gray', () => this.skip(), ICON.skip)); if (pp) acts.append(pp); acts.append(chk);
    },
    skip() { const c = this.cur; c.sk = (c.sk || 0) + 1; this.stop(); if (c.sk <= 2 && this.i < this.q.length - 1) { this.q.splice(this.i, 1); this.q.push(c); toast('Moved to the end'); this.render(); } else { c.skipped = true; this.next(); } },
    next() { this.stop(); this.i++; if (this.i >= this.q.length) return this.finish(); this.render(); },
    finish() {
      this.stop(); const res = this.q.filter(x => x.done); const n = res.length, ok = res.filter(x => x.done.ok).length, pct = n ? Math.round(ok / n * 100) : 0; const secs = Math.round((Date.now() - this.t0) / 1000);
      $('.tmr', this.el).innerHTML = ''; $('.pg', this.el).style.width = '100%'; $('.t2x', this.el).textContent = 'Session complete'; this.i = this.q.length;
      const body = $('.sb', this.el); body.innerHTML = ''; const C = 2 * Math.PI * 75; const col = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)';
      const v = h(`<div class="qwrap"><div class="result-hero"><div class="score-ring"><svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="75" stroke="var(--fill)" stroke-width="14" fill="none"/><circle cx="85" cy="85" r="75" stroke="${col}" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/></svg><div class="center"><b>${pct}%</b></div></div><h2>${pct >= 70 ? 'Strong session' : pct >= 50 ? 'Good effort' : 'Mistakes saved for next time'}</h2><p>${ok}/${n} correct · ${fmt(secs)}</p></div></div>`);
      body.append(v);
      const wrong = res.filter(x => !x.done.ok).map(x => ({ id: x.id })); const skipped = this.q.filter(x => x.skipped && !x.done).map(x => ({ id: x.id }));
      const acts = h('<div class="actions"></div>'); body.append(acts);
      const btn = (l, cls, fn) => { const b = h(`<button class="btn ${cls}" type="button"><span>${esc(l)}</span></button>`); b.onclick = fn; return b; };
      if (skipped.length) acts.append(btn('Try skipped (' + skipped.length + ')', 'gray', () => this.start(this.s, this.data, skipped, 'Skipped', this.timer)));
      acts.append(wrong.length ? btn('Practise mistakes (' + wrong.length + ')', 'primary', () => this.start(this.s, this.data, wrong, 'Mistakes', this.timer)) : btn('Done', 'primary', () => this.close(true)));
    },
    close(force) {
      if (!force && this.i < this.q.length && this.q.some(x => !x.done)) { const st = this; return confirmBox('Leave this practice?', 'Answers so far are saved. Unanswered questions will be dropped.', 'Keep practising', 'Leave', null, () => st.close(true)); }
      this.stop(); this.el.classList.remove('open'); document.body.style.overflow = ''; document.removeEventListener('keydown', this.keys);
      if (location.hash.startsWith('#subjects')) render();
    }
  };

  /* ---------- Router hook (runs after the app's own router) ---------- */
  function render() {
    if (!location.hash.startsWith('#subjects')) return;
    const main = $('#main'); if (!main) return; main.innerHTML = '';
    const id = location.hash.split('/')[1]; const s = id && subj(decodeURIComponent(id));
    (s ? pageSubject(main, s) : pageList(main)).catch(() => {});
    $$('[data-tab]').forEach(a => { if (a.dataset.tab === 'subjects') a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    scrollTo(0, 0);
  }
  ready(() => {
    addTabs();
    /* include subject progress in the app's backup change-detection */
    const B = window.__rr.Backup; if (B && B.fingerprint && !B._subj) { const f = B.fingerprint.bind(B); B.fingerprint = () => { const d = store(); return f() + '|s:' + Object.values(d.stats).reduce((a, x) => a + x.n, 0) + ':' + Object.keys(d.marked).length; }; B._subj = true; }
    addEventListener('hashchange', () => setTimeout(render, 0));
    render();
  });
})();
