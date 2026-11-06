/* Rank Rank — CMA Final Law practice app. Vanilla JS, no build step. */
(() => {
'use strict';
const B = window.BANK;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const DAY = 864e5;
const todayKey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtTime = s => { s = Math.max(0, Math.round(s)); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); };
const vibrate = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

/* ---------- Icons (SF Symbols-like strokes) ---------- */
const I = {
  today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/></svg>',
  practice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="13" height="17" rx="2.5"/><path d="M8 8h5M8 12h5M8 16h3"/><path d="M20 7v13a1 1 0 0 1-1 1H8"/></svg>',
  study:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z"/><path d="M12 6v13.5"/></svg>',
  progress:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 20V11M10 20V5M16 20v-7M22 20H2"/></svg>',
  chev:'<svg class="chev" viewBox="0 0 9 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5 7.5 7.5l-6 6"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.3 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z"/></svg>',
  no:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 12.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1Z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  starf:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2s5 4.6 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.8 1.2-3.8S9 11 10.6 11C10.6 6.5 12 2 12 2Zm0 20a7 7 0 0 1-7-7c0-1.4.4-2.7 1-3.8A7 7 0 0 0 12 22Z"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
  hl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-5 5v4h4l5-5"/><path d="m14.5 5.5 4 4L12 16l-4-4z"/><path d="M15 20h6"/></svg>',
  case:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V9h2v4Z"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  news:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2"/><path d="M8 8h5M8 12h5M8 16h3"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  sum:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h7"/><path d="m16 16 2 2 4-4"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  retry:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v5h5"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7 9l5-5 5 5"/><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  skip:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 6v12l9-6zM16 6h3v12h-3z"/></svg>',
  xs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  half:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>',
  eyeoff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M8 2h8l-2 6h-4z"/><circle cx="12" cy="15" r="6"/><path d="m12 12 1 2h2l-1.6 1.3.6 2.2-2-1.3-2 1.3.6-2.2L9 14h2z" fill="currentColor"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
  fitw:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>',
  fitp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  gcal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M9 15h2v2H9z" fill="currentColor"/></svg>',
  cheat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l2.2 5.3 5.6.5-4.3 3.7 1.3 5.5L12 14.6l-4.8 2.9 1.3-5.5-4.3-3.7 5.6-.5z"/><path d="M5 21h14"/></svg>',
  ai:'<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z"/></svg>'
};
const tint = (c, svg) => `<span class="ic" style="background:var(--${c})">${svg}</span>`;

/* ---------- Data indexes ---------- */
const ITEMS = B.items; const BYID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const CH = Object.fromEntries(B.chapters.map(c => [c.id, c]));
const GROUPS = ['Companies Act', 'Corporate Laws', 'Economic Laws', 'My PDFs'];
const GROUP_LABEL = {'Companies Act':'Module 1 · Companies Act, 2013','Corporate Laws':'Modules 2–3 · IBC, Governance & CSR','Economic Laws':'Modules 4–11 · Economic Laws','My PDFs':'My uploaded PDFs'};
const conceptTitle = (ch, n) => (CH[ch]?.concepts.find(c => c.n === n) || {}).t || '';
const conceptPage = (ch, n) => (CH[ch]?.concepts.find(c => c.n === n) || {}).p || CH[ch]?.p;
const chShort = id => id.startsWith('u-') ? ((CH[id] && CH[id].name) || 'My PDF').slice(0, 22) : id.startsWith('U') ? 'Unit ' + id.slice(1) : ({IBC:'IBC',CG:'Governance',SEBI:'SEBI',COMP:'Competition',FEMA:'FEMA',BANK:'Banking',INS:'Insurance',MSME:'MSME',CYB:'Cyber',AML:'PMLA'}[id] || id);
const chLabel = c => c.id.startsWith('U') ? 'Unit ' + c.id.slice(1) + ' · ' + c.name : c.name;
const GENERIC = /^(none of the above|all of the above|any of the above|all or any of the above|both|depends|any or all|none of these|all of these|all the above|d\. )/i;
const recallable = it => it.k === 'mcq' && !GENERIC.test((answerKey(it) && it.o[answerKey(it)]) || '') && !/following|which of these|not\b|false|incorrect/i.test(it.q) && !it.case;
function answerKey(it) { return it.a; }

/* ---------- Persistent state ---------- */
const KEY = 'rankrank.v1';
const DEFAULT = { settings: { name: '', goals: { mcq: 20, case: 5, desc: 3 }, t: { mcq: 90, recall: 45, read: 180, perMark: 108 }, kw: true, gl: true, theme: 'auto', sel: null, fmt: 'mix', count: 15, marked: true, pyq: false, timer: true },
  stats: {}, marked: {}, hl: {}, days: {}, xp: 0, sessions: [], seenUpdates: 0, awards: {}, flags: {}, userPdfs: [], lastPage: {}, active: null };
let S;
try { S = Object.assign(structuredClone(DEFAULT), JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('clauseclause.v1') || '{}')); S.settings = Object.assign(structuredClone(DEFAULT.settings), S.settings || {}); S.settings.goals = Object.assign({}, DEFAULT.settings.goals, S.settings.goals); S.settings.t = Object.assign({}, DEFAULT.settings.t, S.settings.t); }
catch (e) { S = structuredClone(DEFAULT); }
let saveT, metaT; const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Storage is full — export your progress in Settings'); } }, 120); clearTimeout(metaT); metaT = setTimeout(() => { try { Remind.syncMeta(); } catch (e) {} }, 3000); };
const day = (k = todayKey()) => (S.days[k] ||= { mcq: 0, case: 0, desc: 0, xp: 0, secs: 0, ok: 0, n: 0 });
function applyTheme() { const t = S.settings.theme; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); }
applyTheme();

/* ---------- Levels & motivation ---------- */
const LEVELS = ['Article Reader', 'Section Spotter', 'Proviso Pro', 'Clause Crafter', 'Board Ready', 'Tribunal Titan', 'Rank Holder'];
const level = xp => { const l = Math.floor(Math.sqrt(xp / 60)); return { n: l + 1, title: LEVELS[Math.min(l, LEVELS.length - 1)], cur: 60 * l * l, nxt: 60 * (l + 1) * (l + 1) }; };
const MOTTOS = [
  ['Understand the section once and you never have to memorise it twice.', 'Concept over cramming'],
  ['Examiners reward three things: the section, the facts, the conclusion.', 'Provision → Facts → Conclusion'],
  ['Every question you get wrong today is one the exam can’t surprise you with.', 'Mistakes are data'],
  ['Small daily rings beat one heroic Sunday.', 'Consistency'],
  ['Write the number. 30 days, 2%, ₹1 lakh — the marks live in the details.', 'Keywords win marks'],
  ['If you can explain it to a friend, you can write it for the examiner.', 'Say it aloud'],
  ['A case question is a story. Find the section that tells its ending.', 'Case approach'],
  ['Rank holders revise the same chapter five times, not five chapters once.', 'Spaced revision'],
  ['Read the facts twice, the options once.', 'MCQ discipline'],
  ['Law changes. Your understanding is what carries over.', 'Stay current'],
];
const motto = () => MOTTOS[(new Date().getDate() + new Date().getMonth()) % MOTTOS.length];
const greeting = () => { const hr = new Date().getHours(); return hr < 5 ? 'Late night' : hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening'; };
function streak() { let n = 0; let d = new Date(); if (!(S.days[todayKey(d)]?.n)) d = new Date(Date.now() - DAY); while (S.days[todayKey(d)]?.n) { n++; d = new Date(d.getTime() - DAY); } return n; }

/* ---------- Toast, confetti, modal ---------- */
let toastT;
function toast(msg, icon = '') { const t = $('#toast'); t.innerHTML = icon + '<span>' + esc(msg) + '</span>'; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.append(c);
  const x = c.getContext('2d'); const dpr = devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.scale(dpr, dpr);
  const cols = ['#FF2D55', '#34C759', '#32ADE6', '#FF9500', '#AF52DE', '#FFCC00'];
  const P = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 5, r: Math.random() * 6 + 4, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, s: (Math.random() - .5) * .3 }));
  let f = 0; (function tick() { x.clearRect(0, 0, innerWidth, innerHeight); P.forEach(p => { p.vy += .42; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.s; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); }); if (++f < 150) requestAnimationFrame(tick); else c.remove(); })();
}
const modal = $('#modal'), scrim = $('#scrim');
function openModal(title, body, opts = {}) {
  modal.innerHTML = `<div class="grabber"></div><div class="modal-h"><h2>${esc(title)}</h2><button class="iconbtn" data-close aria-label="Close">${I.close}</button></div><div class="modal-b"></div>`;
  const b = $('.modal-b', modal); typeof body === 'string' ? b.innerHTML = body : b.append(body);
  modal.setAttribute('aria-label', title);
  requestAnimationFrame(() => { scrim.classList.add('on'); modal.classList.add('on'); });
  $('[data-close]', modal).onclick = closeModal; scrim.onclick = closeModal;
  return b;
}
function closeModal() { modal.classList.remove('on'); scrim.classList.remove('on'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (modal.classList.contains('on')) closeModal(); else if ($('#viewer').classList.contains('open')) Viewer.close(); } });

/* ---------- Rich text: keywords, glossary, manual highlights ---------- */
const KW_RE = /(Section\s+\d+[A-Z]?(?:\s?\(\d+[A-Za-z]?\))*(?:\s?\([a-z]{1,3}\))?|Sec\.?\s?\d+[A-Z]?(?:\(\d+\))?|\bs\.\s?\d+[A-Z]?(?:\(\d+\))?|Rule\s+\d+[A-Z]?(?:\(\d+\))?|Regulation\s+\d+|Schedule\s+[IVX]+\b|\b(?:ADT|INC|DIR|DPT|AOC|MGT|DIV|CSR|IEPF|PAS|SH|CHG|FC-GPR|FC-TRS)[\s-]?\d{0,2}[A-Z]?\b|₹\s?[\d,.]+\s?(?:lakhs?|crores?|cr\b)?|\b\d+(?:\.\d+)?\s?%|\b\d+\s?(?:working\s|trading\s)?(?:days?|months?|years?)\b|\b(?:one|two|three|four|five|seven|ten|fifteen|thirty|sixty|ninety)\s(?:days?|months?|years?)\b|\b(?:special resolution|ordinary resolution|Board of Directors|Central Government|Registrar|Regional Director|National Company Law Tribunal|Tribunal|NCLT|NCLAT|Adjudicating Authority|Comptroller and Auditor General|CAG|general meeting|independent directors?|key managerial personnel|Committee of Creditors|Resolution Professional|void ab initio|not valid|not tenable|tenable|imprisonment|unanimous)\b)/gi;
const GL_TERMS = Object.keys(B.glossary).sort((a, b) => b.length - a.length);
const GL_RE = new RegExp('\\b(' + GL_TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]")).join('|') + ')\\b', 'i');
function glKey(m) { m = m.toLowerCase().replace(/’/g, "'"); return GL_TERMS.find(t => t === m) || m; }
function walkText(root, cb) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('mark,.gl,.chip,button,a') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode); nodes.forEach(cb);
}
function wrapRe(root, re, make, once) {
  walkText(root, node => {
    let txt = node.nodeValue; re.lastIndex = 0; const frag = document.createDocumentFragment(); let last = 0, m, any = false;
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    while ((m = g.exec(txt))) { if (!m[0]) { g.lastIndex++; continue; } if (once && once.has(once.key(m[0]))) continue; any = true; frag.append(txt.slice(last, m.index)); frag.append(make(m[0])); last = m.index + m[0].length; if (once) once.add(once.key(m[0])); }
    if (any) { frag.append(txt.slice(last)); node.replaceWith(frag); }
  });
}
function decorate(root, itemId) {
  const hls = (S.hl[itemId] || []).filter(Boolean);
  hls.forEach(p => { const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g'); wrapRe(root, re, s => { const m = document.createElement('mark'); m.className = 'hl'; m.dataset.p = p; m.textContent = s; return m; }); });
  if (S.settings.gl) { const used = new Set(); used.key = glKey; wrapRe(root, GL_RE, s => { const b = document.createElement('button'); b.className = 'gl'; b.type = 'button'; b.dataset.term = glKey(s); b.textContent = s; return b; }, used); }
  wrapRe(root, KW_RE, s => { const m = document.createElement('mark'); m.className = 'kw'; m.textContent = s; return m; });
}
function richParas(paras, itemId, cls = 'prose') {
  const d = document.createElement('div'); d.className = cls + ' hlzone' + (S.settings.kw ? '' : ' nokw'); d.dataset.item = itemId;
  d._paras = paras;
  let tbl = null;
  paras.forEach(p => {
    if (p.startsWith('|T|')) { if (!tbl) { const sc = document.createElement('div'); sc.className = 'tblwrap'; tbl = document.createElement('table'); sc.append(tbl); d.append(sc); } const tr = document.createElement('tr'); p.slice(3).split('|').forEach(c => { const td = document.createElement(tbl.rows.length ? 'td' : 'th'); td.textContent = c; tr.append(td); }); tbl.append(tr); return; }
    tbl = null; const el = document.createElement('p'); if (/^(\(?[a-z]{1,4}\)|\(?[ivx]+\)|\d+\)|•|[a-z]\.)\s/.test(p)) el.className = 'li'; el.textContent = p; d.append(el); });
  decorate(d, itemId); return d;
}
function rerenderZones(itemId) { $$('.hlzone').filter(z => z.dataset.item === itemId).forEach(z => { const n = richParas(z._paras, itemId, z.className.includes('qtext') ? 'qtext' : 'prose'); n.className = z.className; z.replaceWith(n); }); }
function keywordsOf(text) {
  const out = []; const seen = new Set(); const re = new RegExp(KW_RE.source, 'gi'); let m;
  while ((m = re.exec(text)) && out.length < 12) { const k = m[0].replace(/\s+/g, ' ').trim(); const kl = k.toLowerCase(); if (/^(tenable|not valid|not tenable|void ab initio|imprisonment|unanimous)$/.test(kl)) continue; if (!seen.has(kl)) { seen.add(kl); out.push(k); } }
  return out;
}
function tricksFor(it) {
  const text = ((Array.isArray(it.q) ? it.q.join(' ') : it.q) + ' ' + (it.o ? it.o[answerKey(it)] : '') + ' ' + (it.ans ? it.ans.join(' ') : '')).toLowerCase();
  const sc = B.tricks.map(t => ({ t, s: (t.ch === it.ch ? 1 : 0) * ((t.cn != null && t.cn === it.cn ? 3 : 0) + t.kw.filter(k => text.includes(k)).length * 2) })).filter(x => x.s >= 2).sort((a, b) => b.s - a.s);
  return sc.slice(0, 2).map(x => x.t);
}
// glossary popover + manual highlight pill
document.addEventListener('click', e => {
  const g = e.target.closest('.gl'); if (g) { e.preventDefault(); showTerm(g.dataset.term); return; }
  const m = e.target.closest('mark.hl'); if (m) { const z = m.closest('.hlzone'); showPill(m.getBoundingClientRect(), [['Remove highlight', () => { const id = z.dataset.item; S.hl[id] = (S.hl[id] || []).filter(p => p !== m.dataset.p); save(); rerenderZones(id); }]]); return; }
  if (!e.target.closest('.hlpill')) hidePill();
});
function showTerm(term) {
  const g = B.glossary[term]; if (!g) return;
  openModal('Meaning', `<p class="gloss-term">${esc(term.replace(/\b\w/g, c => c.toUpperCase()))}</p><p style="font-size:17px;margin:8px 0 0">${esc(g.m)}</p><div class="gloss-ex"><b style="font-size:13px;color:var(--label2)">Example</b><br>${esc(g.e)}</div>`);
}
let pill;
function showPill(rect, actions) {
  hidePill(); pill = h(`<div class="hlpill" role="toolbar"></div>`);
  actions.forEach(([t, fn]) => { const b = h(`<button type="button">${esc(t)}</button>`); b.onmousedown = ev => ev.preventDefault(); let done = false; const act = ev => { ev.preventDefault(); ev.stopPropagation(); if (done) return; done = true; fn(); hidePill(); }; b.addEventListener('pointerup', act); b.addEventListener('click', act); pill.append(b); });
  document.body.append(pill); const pw = pill.offsetWidth;
  pill.style.left = Math.max(8, Math.min(innerWidth - pw - 8, rect.left + rect.width / 2 - pw / 2)) + 'px';
  pill.style.top = Math.max(8 + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-t') || 0), rect.top - 50) + 'px';
}
function hidePill() { if (pill) { pill.remove(); pill = null; } }
function onSelect() {
  const sel = getSelection(); const txt = sel && sel.toString().replace(/\s+/g, ' ').trim();
  if (!txt || txt.length < 2 || txt.length > 400 || !sel.rangeCount) return;
  const z = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest('.hlzone'); if (!z) return;
  const rect = sel.getRangeAt(0).getBoundingClientRect(); const id = z.dataset.item;
  const acts = [['Highlight', () => { (S.hl[id] ||= []).push(txt); save(); sel.removeAllRanges(); rerenderZones(id); toast('Highlighted'); }], ['Copy', () => { navigator.clipboard?.writeText(txt); toast('Copied'); }]];
  const term = GL_TERMS.find(t => t === txt.toLowerCase()); if (term) acts.push(['Meaning', () => showTerm(term)]);
  showPill(rect, acts);
}
document.addEventListener('mouseup', () => setTimeout(onSelect, 10));
document.addEventListener('touchend', () => setTimeout(onSelect, 350));
let selT; document.addEventListener('selectionchange', () => { if (!matchMedia('(pointer: coarse)').matches) return; clearTimeout(selT); selT = setTimeout(onSelect, 800); });

/* ---------- Stats / SRS ---------- */
const BOX_DAYS = [0, 1, 2, 4, 7, 15];
function record(it, ok, mode, secs) {
  S.flags ||= {}; const hr = new Date().getHours(); if (hr < 7) S.flags.early = 1; if (hr >= 23) S.flags.late = 1;
  const lastAny = Math.max(0, ...Object.values(S.stats).map(x => x.last || 0)); if (lastAny && Date.now() - lastAny > 3 * DAY) S.flags.comeback = 1;
  const st = (S.stats[it.id] ||= { n: 0, c: 0, box: 0, due: 0, last: 0, w: 0 });
  st.n++; st.last = Date.now();
  if (ok) { st.c++; st.box = Math.min(5, st.box + 1); st.due = Date.now() + BOX_DAYS[st.box] * DAY; } else { st.w++; st.box = 1; st.due = Date.now() + 10 * 60e3; }
  const d = day(); d.n++; if (ok) d.ok++; d.secs += secs || 0;
  if (it.k === 'mcq' || it.k === 'cloze') d.mcq++; else d.desc++; if (it.sc) d.case++;
  const before = level(S.xp).n; const gain = ok ? (it.k === 'desc' ? (mode === 'retry' ? 15 : 25) : mode === 'recall' ? 12 : 10) : 2;
  S.xp += gain; d.xp += gain; save();
  if (level(S.xp).n > before) { setTimeout(() => { confetti(); toast('Level up — ' + level(S.xp).title, ''); }, 400); }
  const g = S.settings.goals; if (d.mcq >= g.mcq && d.case >= g.case && d.desc >= g.desc && !d.closed) { d.closed = 1; save(); setTimeout(() => { confetti(); toast('All three rings closed today!'); }, 600); }
  return gain;
}
const isDue = id => { const s = S.stats[id]; return s && s.due && s.due <= Date.now(); };
const isWeak = id => { const s = S.stats[id]; return s && s.w > 0 && s.box <= 2; };

/* ---------- Queue builder ---------- */
function selected() { const sel = S.settings.sel; if (!sel || !Object.keys(sel).length) return null; return sel; }
function inSel(it, sel) { if (!sel) return true; const c = sel[it.ch]; if (c === undefined) return false; if (c === true) return true; return c.includes(it.cn); }
function buildQueue(o) {
  let pool = o.ids ? o.ids.map(id => BYID[id]).filter(Boolean) : ITEMS.filter(it => inSel(it, o.sel));
  const fmt = o.fmt || 'mix';
  if (fmt === 'mcq') pool = pool.filter(i => i.k === 'mcq');
  if (fmt === 'case') pool = pool.filter(i => i.sc);
  if (fmt === 'desc') pool = pool.filter(i => i.k === 'desc');
  if (fmt === 'recall') pool = pool.filter(i => recallable(i) || i.k === 'cloze');
  if (o.pyq) pool = pool.filter(i => i.tags.some(t => /PYQ|IMP|MQP|20\d\d/.test(t)));
  const now = Date.now();
  const score = it => { const s = S.stats[it.id]; let v = Math.random() * 1.5; if (!s) v += 1.6; else { if (s.due <= now) v += 3; if (s.w && s.box <= 2) v += 2; if (s.box >= 4) v -= 2; } if (S.marked[it.id]) v += 2.5; if (it.tags.some(t => /PYQ|IMP/.test(t))) v += .6; return v; };
  pool = pool.map(it => [score(it), it]).sort((a, b) => b[0] - a[0]).map(x => x[1]);
  let out = pool.slice(0, o.count || 15);
  if (o.marked && !o.ids) { const mk = Object.keys(S.marked).map(id => BYID[id]).filter(it => it && !out.includes(it)).slice(0, Math.ceil((o.count || 15) / 3)); out = out.slice(0, Math.max(0, out.length - mk.length)).concat(mk); }
  out = shuffle(out);
  return out.map(it => ({ id: it.id, mode: it.k === 'desc' ? 'desc' : fmt === 'recall' ? 'recall' : (fmt === 'mix' && recallable(it) && Math.random() < .2 ? 'recall' : 'mcq') }));
}
function routineQueue() {
  const g = S.settings.goals, d = day(), sel = selected();
  const need = { mcq: Math.max(g.mcq - d.mcq, 0), case: Math.max(g.case - d.case, 0), desc: Math.max(g.desc - d.desc, 0) };
  const extra = !need.mcq && !need.case && !need.desc;
  if (extra) { need.mcq = 10; need.case = 3; need.desc = 2; }
  const a = buildQueue({ sel, fmt: 'mcq', count: Math.min(need.mcq, 30), marked: S.settings.marked });
  const ids = new Set(a.map(x => x.id));
  const b = buildQueue({ sel, fmt: 'case', count: need.case + 4 }).filter(x => !ids.has(x.id)).slice(0, need.case); b.forEach(x => ids.add(x.id));
  const c = buildQueue({ sel, fmt: 'desc', count: need.desc + 4 }).filter(x => !ids.has(x.id) && !BYID[x.id].sc).slice(0, need.desc);
  const q = []; const parts = [a, b, c]; while (parts.some(p => p.length)) { for (let i = 0; i < 2; i++) if (a.length) q.push(a.shift()); if (b.length) q.push(b.shift()); if (a.length) q.push(a.shift()); if (c.length) q.push(c.shift()); }
  return { q, extra };
}

/* ---------- Router & pages ---------- */
const TABS = [['today', 'Today', I.today], ['practice', 'Practice', I.practice], ['cheat', 'Cheat sheet', I.cheat], ['study', 'Study', I.study], ['progress', 'Progress', I.progress]];
function navHTML(cls) { return TABS.map(([id, t, ic]) => `<a class="${cls}" href="#${id}" data-tab="${id}">${ic}<span>${t}</span></a>`).join(''); }
$('#tabbar').innerHTML = navHTML('tab'); $('#sidetabs').innerHTML = navHTML('sidetab');
function route() {
  const r = (location.hash.slice(1) || 'today').split('/')[0];
  $$('[data-tab]').forEach(a => { if (a.dataset.tab === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const main = $('#main'); main.innerHTML = '';
  if (r === 'go') return;
  ({ today: pageToday, practice: pagePractice, cheat: pageCheat, study: pageStudy, progress: pageProgress }[r] || pageToday)(main);
  scrollTo(0, 0);
}
addEventListener('hashchange', route);

function ringsSVG(vals, size = 150) {
  const cols = ['--ring1', '--ring2', '--ring3']; const sw = size * .085; let out = '';
  vals.forEach((v, i) => { const r = size / 2 - sw / 2 - i * (sw + 3); const C = 2 * Math.PI * r; const off = C * (1 - Math.min(v, 1));
    out += `<circle class="bgc" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(${cols[i]})" stroke-width="${sw}"/><circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(${cols[i]})" stroke-width="${sw}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${off}"/>`; });
  return `<svg viewBox="0 0 ${size} ${size}">${out}</svg>`;
}
const animateRings = root => requestAnimationFrame(() => setTimeout(() => $$('.fg', root).forEach(c => c.style.strokeDashoffset = c.dataset.off), 60));

/* ---------- Health-style trends, awards, reminders ---------- */
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayAt = i => { const d = new Date(Date.now() - i * DAY); return { d, k: todayKey(d), v: S.days[todayKey(d)] || {} }; };
function weekStats(off = 0) { let n = 0, ok = 0, secs = 0, active = 0; for (let i = off; i < off + 7; i++) { const v = dayAt(i).v; n += v.n || 0; ok += v.ok || 0; secs += v.secs || 0; if (v.n) active++; } return { n, ok, secs, active, acc: n ? ok / n : null }; }
function barsSVG(vals, labels, color, todayIdx) {
  const W = 300, H = 92, max = Math.max(4, ...vals), avg = vals.reduce((a, b) => a + b, 0) / vals.length; const bw = 26, gap = (W - bw * 7) / 6;
  let s = `<svg viewBox="0 0 ${W} ${H + 18}" class="bars" role="img" aria-label="Questions per day, last 7 days">`;
  vals.forEach((v, i) => { const bh = Math.max(3, v / max * H); const x = i * (bw + gap); s += `<rect x="${x}" y="${H - bh}" width="${bw}" height="${bh}" rx="6" fill="${color}" opacity="${i === todayIdx ? 1 : .45}" style="transform-origin:${x + bw / 2}px ${H}px;animation:barUp .9s var(--spring) ${i * 60}ms both"/><text x="${x + bw / 2}" y="${H + 15}" text-anchor="middle">${labels[i]}</text>`; });
  if (avg > 0) { const y = H - avg / max * H; s += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="${color}" stroke-dasharray="4 4" stroke-width="1.5" opacity=".9"/><text x="${W}" y="${y - 4}" text-anchor="end" class="avg">avg ${avg.toFixed(0)}</text>`; }
  return s + '</svg>';
}
const AW = [
  ['first', 'First Step', 'Answer your first question', 'blue', 'bolt'],
  ['ten', 'Ten Today', 'Answer 10 questions in one day', 'pink', 'target'],
  ['rings', 'Rings Closed', 'Close all three daily rings', 'green', 'today'],
  ['perfect', 'Perfect Session', '100% in a session of 5 or more', 'yellow', 'starf'],
  ['streak3', '3-Day Streak', 'Practise 3 days in a row', 'orange', 'flame'],
  ['streak7', 'Week Warrior', 'Practise 7 days in a row', 'orange', 'flame'],
  ['streak30', 'Monthly Habit', 'Practise 30 days in a row', 'red', 'flame'],
  ['q100', 'Century', 'Give 100 answers', 'indigo', 'practice'],
  ['q500', 'Five Hundred', 'Give 500 answers', 'purple', 'practice'],
  ['written10', 'Pen Mightier', 'Complete 10 written answers', 'teal', 'pen'],
  ['master', 'Chapter Master', '80%+ in a chapter after 15 answers', 'green', 'book'],
  ['paper', 'Paper Solved', 'Attempt every June 2026 paper question', 'purple', 'doc'],
  ['early', 'Early Bird', 'Practise before 7 am', 'yellow', 'clock'],
  ['owl', 'Night Owl', 'Practise after 11 pm', 'indigo', 'clock'],
  ['comeback', 'Comeback', 'Return after a 3-day break', 'teal', 'play'],
  ['collector', 'Collector', 'Mark 10 questions to revisit', 'yellow', 'star'],
];
function awardTests() {
  const st = Object.entries(S.stats); const tot = st.reduce((a, [, s]) => a + s.n, 0); const days = Object.values(S.days); const sk = streak();
  const written = st.filter(([id]) => BYID[id]?.k === 'desc').length;
  const master = chapterStats().some(c => c.acc != null && c.acc >= .8 && ITEMS.filter(i => i.ch === c.c.id).reduce((a, i) => a + (S.stats[i.id]?.n || 0), 0) >= 15);
  const p26 = ITEMS.filter(i => i.id.startsWith('P26')); const F = S.flags || {};
  return { first: tot >= 1, ten: days.some(d => d.n >= 10), rings: days.some(d => d.closed), perfect: S.sessions.some(s => s.pct === 100 && s.n >= 5), streak3: sk >= 3, streak7: sk >= 7, streak30: sk >= 30, q100: tot >= 100, q500: tot >= 500, written10: written >= 10, master, paper: p26.every(i => S.stats[i.id]), early: !!F.early, owl: !!F.late, comeback: !!F.comeback, collector: Object.keys(S.marked).length >= 10 };
}
function checkAwards() {
  S.awards ||= {}; const t = awardTests(); const fresh = AW.filter(a => t[a[0]] && !S.awards[a[0]]);
  fresh.forEach(a => S.awards[a[0]] = Date.now()); if (fresh.length) { save(); setTimeout(() => { confetti(); toast('New award · ' + fresh[0][1]); }, 900); }
}
function medal(a, on, size = 64) {
  const [id, , , col, ic] = a; const g = 'g' + id + size;
  const icon = (I[ic] || I.starf).replace('<svg', `<svg x="${size * .28}" y="${size * .28}" width="${size * .44}" height="${size * .44}" color="#fff" style="color:#fff"`);
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="medal${on ? '' : ' locked'}"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--${col})"/><stop offset="1" stop-color="var(--${col})" stop-opacity=".62"/></linearGradient></defs><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="url(#${g})"/><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 6}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>${icon}</svg>`;
}
function awardsGrid(limit) {
  S.awards ||= {}; const g = h('<div class="awards"></div>');
  AW.slice(0, limit || AW.length).forEach(a => { const on = !!S.awards[a[0]]; const b = h(`<button class="award" type="button">${medal(a, on)}<b>${esc(a[1])}</b><span>${on ? new Date(S.awards[a[0]]).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'Locked'}</span></button>`); b.onclick = () => openModal(a[1], `<div style="text-align:center">${medal(a, on, 120)}<p style="font-size:17px">${esc(a[2])}</p><p style="color:var(--label2)">${on ? 'Earned ' + new Date(S.awards[a[0]]).toLocaleDateString() : 'Not earned yet — keep practising.'}</p></div>`); g.append(b); });
  return g;
}
function resumeCard() {
  const A = S.active; if (!(A && A.q && A.i < A.q.length)) return null;
  const r = h(`<div class="card resume"><div class="hc-h" style="color:var(--blue)">${I.play}<span>Continue where you left off</span><em>${new Date(A.at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</em></div>
      <div class="resume-t"><b>${esc(A.title)}</b><span>Question ${A.i + 1} of ${A.q.length} · ${A.q.filter(x => x.done).length} answered</span></div><div class="bar"><i style="width:${A.i / A.q.length * 100}%;background:var(--blue)"></i></div>
      <div class="btnrow" style="margin-top:14px"><button class="btn gray" data-r="again">${I.retry}<span>Start again</span></button><button class="btn primary" data-r="go">${I.play}<span>Continue</span></button></div><button class="resume-x" aria-label="Discard saved session">${I.close}</button></div>`);
  $('[data-r=go]', r).onclick = () => Session.resume(); $('[data-r=again]', r).onclick = () => Session.restart();
  $('.resume-x', r).onclick = () => { S.active = null; save(); r.remove(); toast('Saved session discarded'); };
  return r;
}
function pageToday(main) {
  checkAwards();
  const d = day(), g = S.settings.goals, st = streak(), lv = level(S.xp); const [mt, mc] = motto();
  const due = ITEMS.filter(i => isDue(i.id)).length, weak = ITEMS.filter(i => isWeak(i.id)).length, mk = Object.keys(S.marked).length;
  const unseenUpd = B.updates.length - (S.seenUpdates || 0);
  const pct = Math.round(((Math.min(d.mcq, g.mcq) / g.mcq) + (Math.min(d.case, g.case) / g.case) + (Math.min(d.desc, g.desc) / g.desc)) / 3 * 100);
  const w = weekStats(0), lw = weekStats(7); const days7 = Array.from({ length: 7 }, (_, i) => dayAt(6 - i));
  const A = S.active;
  const p = h(`<div class="page">
    <header class="navbar"><div><p class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1 class="largetitle">${greeting()}${S.settings.name ? ', ' + esc(S.settings.name) : ''}</h1><p class="greetline">${esc(greetLine())}</p></div>
      <div class="navbtns"><button class="iconbtn" id="remBtn" aria-label="Daily reminder">${I.bell}</button><button class="iconbtn" id="updBtn" aria-label="Law updates" style="position:relative">${I.news}${unseenUpd > 0 ? `<i class="dot"></i>` : ''}</button></div></header>
    <div id="resume"></div>
    <div class="card rings-card"><div class="rings">${ringsSVG([d.mcq / g.mcq, d.case / g.case, d.desc / g.desc])}<div class="center"><div><b>${pct}%</b><span>today</span></div></div></div>
      <div class="legend"><div class="lg"><span class="k" style="color:var(--ring1)">MCQs</span><span class="v">${d.mcq}<small>/${g.mcq}</small></span></div>
      <div class="lg"><span class="k" style="color:var(--ring2)">Case-based</span><span class="v">${d.case}<small>/${g.case}</small></span></div>
      <div class="lg"><span class="k" style="color:var(--ring3)">Written</span><span class="v">${d.desc}<small>/${g.desc}</small></span></div></div></div>
    <div style="display:flex;gap:8px;align-items:center;margin:14px 2px 0;flex-wrap:wrap"><span class="streak">${I.flame} ${st ? st + '-day streak' : 'Start a streak today'}</span><span class="chip blue">Level ${lv.n} · ${lv.title}</span><span class="chip">${S.xp} XP</span></div>
    <button class="btn primary block" id="routine" style="margin-top:16px;min-height:56px;font-size:18px">${I.play} ${pct >= 100 ? 'Do a bonus round' : d.n ? 'Continue today’s routine' : 'Start today’s routine'}</button>
    <p class="foot">${selected() ? 'Built from the topics you picked in Practice.' : 'Built from all chapters — pick the units you have studied in Practice to focus it.'} Revisions that are due and your starred questions come first.</p>
    <h2 class="section-h">Summary</h2>
    <div class="hgrid">
      <button class="hcard" data-h="q"><div class="hc-h" style="color:var(--pink)">${I.practice}<span>Questions</span><em>Today</em></div><div class="hc-v">${d.n}<small> answered</small></div></button>
      <button class="hcard" data-h="a"><div class="hc-h" style="color:var(--green)">${I.target}<span>Accuracy</span><em>Today</em></div><div class="hc-v">${d.n ? Math.round(d.ok / d.n * 100) : '—'}<small>${d.n ? ' %' : ''}</small></div></button>
      <button class="hcard" data-h="t"><div class="hc-h" style="color:var(--teal)">${I.clock}<span>Study time</span><em>Today</em></div><div class="hc-v">${Math.round((d.secs || 0) / 60)}<small> min</small></div></button>
      <button class="hcard" data-h="s"><div class="hc-h" style="color:var(--orange)">${I.flame}<span>Active days</span><em>Week</em></div><div class="hc-v">${w.active}<small> of 7</small></div></button>
    </div>
    <h2 class="section-h">Highlights</h2>
    <div class="card hl-card"><div class="hc-h" style="color:var(--pink)">${I.practice}<span>Questions</span></div>
      <p class="hl-say">${w.n || lw.n ? (lw.n ? `You answered <b>${w.n}</b> questions in the last 7 days — ${w.n >= lw.n ? '<b>' + Math.round((w.n - lw.n) / lw.n * 100) + '% more</b>' : '<b>' + Math.round((lw.n - w.n) / lw.n * 100) + '% fewer</b>'} than the week before.` : `You answered <b>${w.n}</b> questions this week. Keep going and your trend appears here.`) : 'Your first week starts today. Answer a few questions and your daily trend appears here.'}</p>
      ${barsSVG(days7.map(x => x.v.n || 0), days7.map(x => DOW[x.d.getDay()]), 'var(--pink)', 6)}</div>
    <div id="hl2"></div>
    <h2 class="section-h">Quick start</h2>
    <div class="tiles">
      <button class="tile" data-q="marked">${tint('yellow', I.starf)}<b>${mk}</b><span>Starred by me</span></button>
      <button class="tile" data-q="weak">${tint('red', I.target)}<b>${weak}</b><span>Weak spots</span></button>
      <button class="tile" data-q="due">${tint('blue', I.clock)}<b>${due}</b><span>Due for revision</span></button>
      <button class="tile" data-q="paper">${tint('purple', I.doc)}<b>${ITEMS.filter(i => i.id.startsWith('P26')).length}</b><span>June 2026 paper</span></button>
    </div>
    <h2 class="section-h">Awards <small><a href="#progress">Show all</a></small></h2>
    <div id="aw"></div>
    <h2 class="section-h">Thought for today</h2>
    <div class="card"><p class="motto">“${esc(mt)}”<cite>${esc(mc)}</cite></p></div>
    <h2 class="section-h">Shortcuts</h2>
    <div class="list">
      <button class="row tap" data-go="mock">${tint('indigo', I.clock)}<div class="tx"><div class="t1">Mini mock test</div><div class="t2">10 MCQs + 2 written answers, timed</div></div>${I.chev}</button>
      <button class="row tap" data-go="summary">${tint('green', I.sum)}<div class="tx"><div class="t1">Summarise my learning</div><div class="t2">What you have mastered and where to practise</div></div>${I.chev}</button>
      <button class="row tap" data-go="updates">${tint('orange', I.news)}<div class="tx"><div class="t1">Law updates since your material</div><div class="t2">${B.updates.length} verified changes with links</div></div>${I.chev}</button>
      <button class="row tap" data-go="remind">${tint('red', I.bell)}<div class="tx"><div class="t1">Daily reminder</div><div class="t2">${S.settings.notify ? 'Notifications on · ' + S.settings.remind : S.settings.remind ? 'Calendar set for ' + S.settings.remind + ' · add notifications' : 'Google Calendar, Apple Calendar or notifications'}</div></div>${I.chev}</button>
    </div></div>`);
  main.append(p); animateRings(p);
  const rc = resumeCard(); if (rc) $('#resume', p).append(rc);
  // second highlight: accuracy or chapter insight
  const cs = chapterStats().filter(c => c.acc != null && c.att >= 3); const best = cs.slice().sort((a, b) => b.acc - a.acc)[0], worst = cs.slice().sort((a, b) => a.acc - b.acc)[0];
  if (w.acc != null) {
    const hh = h(`<div class="card hl-card" style="margin-top:12px"><div class="hc-h" style="color:var(--green)">${I.target}<span>Accuracy</span></div><p class="hl-say">${lw.acc != null ? `Your accuracy this week is <b>${Math.round(w.acc * 100)}%</b>, ${w.acc >= lw.acc ? 'up' : 'down'} from ${Math.round(lw.acc * 100)}% last week.` : `Your accuracy this week is <b>${Math.round(w.acc * 100)}%</b>.`}${best ? ` You’re strongest in <b>${esc(best.c.name)}</b> (${Math.round(best.acc * 100)}%).` : ''}</p>${worst && worst.acc < .7 ? `<button class="btn tinted block" style="margin-top:4px">Revisit ${esc(worst.c.name)} · ${Math.round(worst.acc * 100)}%</button>` : ''}</div>`);
    const bt = $('button', hh); if (bt) bt.onclick = () => Session.start(buildQueue({ sel: { [worst.c.id]: true }, fmt: 'mix', count: 12 }), worst.c.name);
    $('#hl2', p).append(hh);
  }
  const earned = AW.filter(a => S.awards?.[a[0]]).sort((a, b) => S.awards[b[0]] - S.awards[a[0]]); const show = earned.slice(0, 4).concat(AW.filter(a => !S.awards?.[a[0]])).slice(0, 4);
  const ag = h('<div class="awards"></div>'); show.forEach(a => { const on = !!S.awards?.[a[0]]; const b = h(`<button class="award" type="button">${medal(a, on)}<b>${esc(a[1])}</b><span>${on ? 'Earned' : esc(a[2])}</span></button>`); b.onclick = () => location.hash = '#progress'; ag.append(b); }); $('#aw', p).append(ag);
  $('#routine', p).onclick = () => { const { q, extra } = routineQueue(); if (!q.length) return toast('No questions match your topics yet'); Session.start(q, extra ? 'Bonus round' : 'Today’s routine'); };
  $('#updBtn', p).onclick = showUpdates; $('#remBtn', p).onclick = () => Remind.modal();
  $$('[data-h]', p).forEach(b => b.onclick = () => location.hash = '#progress');
  $$('[data-q]', p).forEach(b => b.onclick = () => {
    const k = b.dataset.q; let ids;
    if (k === 'marked') ids = Object.keys(S.marked); if (k === 'weak') ids = ITEMS.filter(i => isWeak(i.id)).map(i => i.id); if (k === 'due') ids = ITEMS.filter(i => isDue(i.id)).map(i => i.id);
    if (k === 'paper') ids = ITEMS.filter(i => i.id.startsWith('P26')).map(i => i.id);
    if (!ids.length) return toast(k === 'marked' ? 'Tap the star on any question to save it' : 'Nothing here yet — keep practising');
    const q = k === 'paper' ? ids.map(id => ({ id, mode: BYID[id].k === 'desc' ? 'desc' : 'mcq' })) : buildQueue({ ids, count: 30 });
    Session.start(q, { marked: 'Starred by me', weak: 'Weak spots', due: 'Due for revision', paper: 'June 2026 paper' }[k]);
  });
  $$('[data-go]', p).forEach(b => b.onclick = () => { const k = b.dataset.go; if (k === 'summary') showSummary(); if (k === 'updates') showUpdates(); if (k === 'remind') Remind.modal(); if (k === 'mock') { const sel = selected(); const a = buildQueue({ sel, fmt: 'mcq', count: 10 }).map(x => ({ ...x, mode: 'mcq' })); const c = buildQueue({ sel, fmt: 'desc', count: 2 }); Session.start(a.concat(c), 'Mini mock test', { mock: true }); } });
}

function pagePractice(main) {
  const st = S.settings; let sel = st.sel ? structuredClone(st.sel) : {};
  const p = h(`<div class="page"><header class="navbar"><div><p class="eyebrow">Pick what you have studied</p><h1 class="largetitle">Practice</h1></div></header><div id="resume"></div>
    <div class="seg" role="group" aria-label="Question format" id="fmt">${[['mix', 'Mix'], ['mcq', 'MCQ'], ['case', 'Case'], ['desc', 'Written'], ['recall', 'Recall']].map(([k, t]) => `<button aria-pressed="${st.fmt === k}" data-f="${k}">${t}</button>`).join('')}</div>
    <p class="foot" id="fmtnote"></p>
    <div id="chs"></div>
    <div class="group-h">Session</div>
    <div class="list">
      <div class="row plain"><div class="tx"><div class="t1">Questions</div></div><div class="stepper"><button data-s="-" aria-label="Fewer">${I.minus}</button><b id="cnt">${st.count}</b><button data-s="+" aria-label="More">${I.plus}</button></div></div>
      <label class="row plain"><div class="tx"><div class="t1">Include my marked questions</div></div><span class="switch"><input type="checkbox" id="mk" ${st.marked ? 'checked' : ''}><span></span></span></label>
      <label class="row plain"><div class="tx"><div class="t1">Only past-paper & IMP questions</div></div><span class="switch"><input type="checkbox" id="pyq" ${st.pyq ? 'checked' : ''}><span></span></span></label>
      <label class="row plain"><div class="tx"><div class="t1">Exam timer</div><div class="t2">MCQ ${st.t.mcq}s · written ${(st.t.perMark / 60).toFixed(1)} min per mark</div></div><span class="switch"><input type="checkbox" id="tm" ${st.timer ? 'checked' : ''}><span></span></span></label>
    </div>
    <p class="foot" id="avail"></p>
    <button class="btn primary block" id="go" style="margin-top:16px;min-height:56px;font-size:18px">${I.play} Start practice</button>
    <button class="btn tinted block" id="save" style="margin-top:10px">Use these topics for my daily routine</button></div>`);
  main.append(p); const rc = resumeCard(); if (rc) $('#resume', p).append(rc);
  const notes = { mix: 'Mixed formats: book MCQs, case questions, written answers, and some MCQs turned into open recall (marked AI format).', mcq: 'Exam-style MCQs from your MCQ book and the June 2026 paper, with the reason from your material.', case: 'Scenario questions — company facts you must apply the law to.', desc: 'Written answers: attempt, reveal, read, practise, check.', recall: 'AI format: the MCQ without its options. Recall the answer yourself, then check.' };
  const fmtNote = () => $('#fmtnote', p).textContent = notes[st.fmt];
  fmtNote();
  $$('#fmt button', p).forEach(b => b.onclick = () => { st.fmt = b.dataset.f; $$('#fmt button', p).forEach(x => x.setAttribute('aria-pressed', x === b)); fmtNote(); save(); avail(); });
  const chs = $('#chs', p);
  const stateOf = id => sel[id] === true ? 'on' : Array.isArray(sel[id]) && sel[id].length ? 'part' : '';
  function draw() {
    chs.innerHTML = '';
    GROUPS.filter(g => B.chapters.some(c => c.group === g)).forEach(g => {
      const list = B.chapters.filter(c => c.group === g);
      const allOn = list.every(c => sel[c.id] === true);
      const head = h(`<div class="group-h" style="display:flex;justify-content:space-between"><span>${GROUP_LABEL[g]}</span><button style="color:var(--blue);font-size:13px" type="button">${allOn ? 'Clear' : 'Select all'}</button></div>`);
      head.querySelector('button').onclick = () => { list.forEach(c => allOn ? delete sel[c.id] : sel[c.id] = true); draw(); };
      chs.append(head);
      const box = h('<div class="list"></div>');
      list.forEach(c => {
        const n = ITEMS.filter(i => i.ch === c.id).length; const s = stateOf(c.id);
        const row = h(`<div class="row"><button class="check ${s}" aria-label="Select ${esc(c.name)}" type="button">${s === 'on' ? I.check : ''}</button><button class="tx" style="text-align:left" type="button"><div class="t1">${esc(chLabel(c))}</div><div class="t2">${n} questions · ${c.concepts.length} topics${s === 'part' ? ' · ' + sel[c.id].length + ' picked' : ''}</div></button>${I.chev}</div>`);
        row.querySelector('.check').onclick = () => { sel[c.id] === true ? delete sel[c.id] : sel[c.id] = true; draw(); };
        const open = () => { const ex = row.nextElementSibling; if (ex && ex.classList.contains('concepts')) { ex.remove(); return; } box.querySelectorAll('.concepts').forEach(x => x.remove()); row.after(conceptList(c)); };
        row.querySelector('.tx').onclick = open; row.querySelector('.chev').onclick = open;
        box.append(row);
      });
      chs.append(box);
    });
    avail();
  }
  function conceptList(c) {
    const d = h('<div class="concepts"></div>');
    c.concepts.forEach(k => {
      const n = ITEMS.filter(i => i.ch === c.id && i.cn === k.n).length; if (!n) return;
      const on = sel[c.id] === true || (Array.isArray(sel[c.id]) && sel[c.id].includes(k.n));
      const r = h(`<button class="row tap" type="button"><span class="check ${on ? 'on' : ''}" style="width:22px;height:22px;flex-basis:22px">${on ? I.check : ''}</span><div class="tx"><div class="t1">${esc(k.t)}</div><div class="t2">${n} questions · Concept Book p.${k.p}</div></div></button>`);
      r.onclick = () => { let cur = sel[c.id] === true ? c.concepts.filter(x => ITEMS.some(i => i.ch === c.id && i.cn === x.n)).map(x => x.n) : (sel[c.id] || []).slice(); cur = cur.includes(k.n) ? cur.filter(x => x !== k.n) : cur.concat(k.n); if (!cur.length) delete sel[c.id]; else sel[c.id] = cur; const ex = d; draw(); };
      d.append(r);
    });
    return d;
  }
  function avail() { const s = Object.keys(sel).length ? sel : null; const q = buildQueue({ sel: s, fmt: st.fmt, count: 9999, pyq: $('#pyq', p).checked }); $('#avail', p).textContent = (s ? q.length + ' questions match your picks.' : 'Nothing picked — practice will draw from all ' + q.length + ' matching questions.'); }
  $$('[data-s]', p).forEach(b => b.onclick = () => { st.count = Math.max(5, Math.min(60, st.count + (b.dataset.s === '+' ? 5 : -5))); $('#cnt', p).textContent = st.count; save(); });
  $('#mk', p).onchange = e => { st.marked = e.target.checked; save(); };
  $('#pyq', p).onchange = e => { st.pyq = e.target.checked; save(); avail(); };
  $('#tm', p).onchange = e => { st.timer = e.target.checked; save(); };
  $('#save', p).onclick = () => { st.sel = Object.keys(sel).length ? structuredClone(sel) : null; save(); toast(st.sel ? 'Daily routine will use these topics' : 'Daily routine will use all chapters'); };
  $('#go', p).onclick = () => { const s = Object.keys(sel).length ? sel : null; const q = buildQueue({ sel: s, fmt: st.fmt, count: st.count, marked: st.marked, pyq: st.pyq }); if (!q.length) return toast('No questions match — widen your picks'); Session.start(q, 'Practice'); };
  draw();
}

function pageStudy(main) {
  const p = h(`<div class="page"><header class="navbar"><div><p class="eyebrow">Open the real PDFs at the right page</p><h1 class="largetitle">Study</h1></div></header>
    <div id="cont"></div>
    <div class="group-h">Your course material</div><div class="list" id="files"></div>
    <div class="group-h" style="display:flex;justify-content:space-between"><span>My PDFs</span></div><div class="list" id="mine"></div>
    <label class="btn tinted block" style="margin-top:12px">${I.upload} Upload a PDF<input type="file" accept="application/pdf" multiple class="sr" id="addpdf"></label>
    <p class="foot">Upload any PDF — notes, ICMAI material, RTPs. Rank Rank reads it and builds practice: MCQs (when the PDF has an answer key), written Q&A pairs and key-value recall, all linked to their page. It stays private in this browser.</p>
    <div id="chs"></div></div>`);
  main.append(p);
  const lr = S.lastRead; if (lr && PDFStore.meta(lr.key)) { const m = PDFStore.meta(lr.key); const c = h(`<button class="card resume" type="button" style="width:100%;text-align:left"><div class="hc-h" style="color:var(--blue)">${I.book}<span>Continue reading</span><em>${new Date(lr.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</em></div><div class="resume-t"><b>${esc(m.name)}</b><span>Page ${lr.page}</span></div></button>`); c.onclick = () => Viewer.open(lr.key, lr.page); $('#cont', p).append(c); }
  const files = $('#files', p);
  const desc = { CB: 'Concepts for every unit, section by section', MCQ: '359 MCQs with answer keys', QA234: 'Written answers · Dividends, Accounts, Audit', QA567: 'Written answers · Board, Meetings, KMP', IMP: 'Important questions for June 2026', PAPER: 'Actual June 2026 question paper', BUL: 'Same MCQs, June 2026 edition', PLAN: 'Dec 26 revision planner and weightage' };
  const colors = { CB: 'blue', MCQ: 'pink', QA234: 'green', QA567: 'teal', IMP: 'orange', PAPER: 'purple', BUL: 'indigo', PLAN: 'yellow' };
  Object.entries(B.files).forEach(([k, f]) => {
    const r = h(`<button class="row tap" type="button">${tint(colors[k], I.doc)}<div class="tx"><div class="t1">${esc(f.name)}</div><div class="t2">${esc(desc[k] || f.file)}${S.lastPage?.[k] ? ' · p.' + S.lastPage[k] : ''}</div></div><span class="val" data-st="${k}"></span>${I.chev}</button>`);
    r.onclick = () => Viewer.open(k); files.append(r);
    PDFStore.status(k).then(s => { const el = $(`[data-st="${k}"]`, p); if (el) el.textContent = s === 'none' ? 'Add' : ''; });
  });
  const mine = $('#mine', p); const ups = S.userPdfs || [];
  if (!ups.length) mine.append(h(`<div class="row plain"><div class="tx"><div class="t2">Your own notes, ICMAI study material, RTPs — anything you upload appears here.</div></div></div>`));
  ups.forEach(u => { const r = h(`<div class="row">${tint('gray', I.doc)}<button class="tx" type="button" style="text-align:left"><div class="t1">${esc(u.name)}</div><div class="t2">${(u.size / 1048576).toFixed(1)} MB${u.c ? ` · ${u.c.mcq} MCQ · ${u.c.desc} Q&A · ${u.c.cloze} values` : ''}${S.lastPage?.[u.id] ? ' · p.' + S.lastPage[u.id] : ''}</div></button><button class="iconbtn" style="color:var(--blue)" aria-label="Practise ${esc(u.name)}">${I.play}</button><button class="iconbtn" style="color:var(--red)" aria-label="Remove ${esc(u.name)}">${I.trash}</button></div>`);
    $('.tx', r).onclick = () => Viewer.open(u.id); const [pb, db] = $$('.iconbtn', r);
    pb.onclick = async () => { await decksReady; if (!CH[u.id]) return ingestUI(u); const q = buildQueue({ sel: { [u.id]: true }, fmt: 'mix', count: 15 }); q.length ? Session.start(q, u.name) : toast('No practice found in this PDF'); };
    db.onclick = async () => { if (!confirm('Remove “' + u.name + '” and its practice from this device?')) return; await PDFStore.del('user/' + u.id); await PDFStore.del('deck/' + u.id, 'meta'); S.userPdfs = S.userPdfs.filter(x => x.id !== u.id); B.chapters = B.chapters.filter(c => c.id !== u.id); delete CH[u.id]; for (let i = ITEMS.length - 1; i >= 0; i--) if (ITEMS[i].ch === u.id) { delete BYID[ITEMS[i].id]; ITEMS.splice(i, 1); } save(); r.remove(); toast('Removed'); }; mine.append(r); });
  $('#addpdf', p).onchange = async e => { const fs = [...e.target.files].filter(f => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)); if (!fs.length) return toast('Choose a PDF file'); let last; for (const f of fs) { const id = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); try { await PDFStore.put('user/' + id, f); } catch (x) { toast('Not enough storage on this device'); return; } last = { id, name: f.name.replace(/\.pdf$/i, ''), size: f.size, at: Date.now() }; (S.userPdfs ||= []).push(last); save(); await ingestUI(last); } route(); };
  const chs = $('#chs', p);
  GROUPS.filter(g => B.chapters.some(c => c.group === g)).forEach(g => {
    chs.append(h(`<div class="group-h">${GROUP_LABEL[g]}</div>`)); const box = h('<div class="list"></div>');
    B.chapters.filter(c => c.group === g).forEach(c => {
      const r = h(`<button class="row tap" type="button">${tint(g === 'Companies Act' ? 'blue' : g === 'Corporate Laws' ? 'indigo' : 'teal', I.book)}<div class="tx"><div class="t1">${esc(chLabel(c))}</div><div class="t2">Concept Book pp.${c.p}–${c.pe}</div></div>${I.chev}</button>`);
      r.onclick = () => {
        const b = openModal(c.name, ''); const l = h('<div class="list"></div>');
        c.concepts.forEach(k => { const rr = h(`<button class="row tap plain" type="button"><div class="tx"><div class="t1">${esc(k.t)}</div><div class="t2">Page ${k.p} · ${ITEMS.filter(i => i.ch === c.id && i.cn === k.n).length} questions</div></div>${I.chev}</button>`); rr.onclick = () => { closeModal(); Viewer.open('CB', k.p); }; l.append(rr); });
        b.append(l); const go = h(`<div class="btnrow" style="margin-top:14px"><button class="btn gray">${I.bell}<span>Remind me</span></button><button class="btn primary">${I.play}<span>Practise</span></button></div>`); go.children[1].onclick = () => { closeModal(); Session.start(buildQueue({ sel: { [c.id]: true }, fmt: 'mix', count: 12 }), c.name); }; go.children[0].onclick = () => { closeModal(); setTimeout(() => remindTopic(c.id), 350); }; b.append(go);
      };
      box.append(r);
    });
    chs.append(box);
  });
}

function chapterStats() {
  return B.chapters.map(c => { let n = 0, ok = 0, att = 0; const its = ITEMS.filter(i => i.ch === c.id); its.forEach(i => { const s = S.stats[i.id]; if (s) { att++; n += s.n; ok += s.c; } }); return { c, total: its.length, att, acc: n ? ok / n : null }; });
}
function pageProgress(main) {
  const lv = level(S.xp), all = Object.values(S.stats); const n = all.reduce((a, s) => a + s.n, 0), ok = all.reduce((a, s) => a + s.c, 0);
  const secs = Object.values(S.days).reduce((a, d) => a + (d.secs || 0), 0);
  const p = h(`<div class="page"><header class="navbar"><div><p class="eyebrow">${lv.title}</p><h1 class="largetitle">Progress</h1></div><div class="navbtns"><button class="iconbtn" id="setBtn" aria-label="Settings">${I.gear}</button></div></header>
    <div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:20px">Level ${lv.n}</b><span style="color:var(--label2);font-size:15px">${S.xp} / ${lv.nxt} XP</span></div><div class="bar" style="height:10px"><i style="width:${Math.round((S.xp - lv.cur) / (lv.nxt - lv.cur) * 100)}%;background:linear-gradient(90deg,var(--indigo),var(--pink))"></i></div>
    <div class="stat3"><div><b>${Object.keys(S.stats).length}</b><span>questions done</span></div><div><b>${n ? Math.round(ok / n * 100) : 0}%</b><span>accuracy</span></div><div><b>${Math.round(secs / 60)}</b><span>minutes</span></div></div></div>
    <button class="btn green block" id="sum" style="margin-top:14px;min-height:54px">${I.sum} Summarise my learning</button>
    <h2 class="section-h">This week</h2><div class="card hl-card"><div class="hc-h" style="color:var(--teal)">${I.clock}<span>Study minutes</span></div><p class="hl-say" id="wk"></p><div id="wkc"></div></div>
    <h2 class="section-h">Awards <small id="awn"></small></h2><div id="awg"></div>
    <h2 class="section-h">By chapter</h2><div class="list" id="bych"></div>
    <h2 class="section-h">Starred by me <button class="chip blue" id="mkall" type="button">${I.play.replace('<svg', '<svg width="12" height="12"')} Practise all</button></h2><div class="list" id="mk"></div>
    <h2 class="section-h">Recent sessions</h2><div class="list" id="hist"></div></div>`);
  main.append(p);
  $('#sum', p).onclick = showSummary; $('#setBtn', p).onclick = showSettings;
  checkAwards(); $('#awg', p).append(awardsGrid()); $('#awn', p).textContent = Object.keys(S.awards || {}).length + ' of ' + AW.length;
  const d7 = Array.from({ length: 7 }, (_, i) => dayAt(6 - i)); const mins = d7.map(x => Math.round((x.v.secs || 0) / 60)); const tot = mins.reduce((a, b) => a + b, 0);
  $('#wk', p).innerHTML = tot ? `You studied <b>${tot} minutes</b> in the last 7 days — about <b>${Math.round(tot / 7)} min</b> a day.` : 'Your study minutes appear here as you practise.';
  $('#wkc', p).innerHTML = barsSVG(mins, d7.map(x => DOW[x.d.getDay()]), 'var(--teal)', 6);
  const bych = $('#bych', p);
  chapterStats().forEach(({ c, total, att, acc }) => {
    const col = acc == null ? 'var(--fill2)' : acc >= .8 ? 'var(--green)' : acc >= .6 ? 'var(--orange)' : 'var(--red)';
    const r = h(`<button class="row tap plain" type="button"><div class="tx"><div class="t1" style="display:flex;justify-content:space-between;gap:8px"><span>${esc(c.name)}</span><span class="val">${acc == null ? '—' : Math.round(acc * 100) + '%'}</span></div><div class="bar"><i style="width:${Math.round(att / total * 100)}%;background:${col}"></i></div><div class="t2">${att} of ${total} attempted</div></div></button>`);
    r.onclick = () => Session.start(buildQueue({ sel: { [c.id]: true }, fmt: 'mix', count: 12 }), c.name); bych.append(r);
  });
  const mk = $('#mk', p); const mids = Object.keys(S.marked).filter(id => BYID[id]);
  if (!mids.length) mk.outerHTML = `<div class="card empty">${I.star}<div>Tap the star on any question to save it here.<br>It will come back in your next practice.</div></div>`;
  else mids.slice(0, 40).forEach(id => { const it = BYID[id]; const q = Array.isArray(it.q) ? it.q[0] : it.q; const r = h(`<div class="row plain"><div class="tx"><div class="t1" style="font-size:15px">${esc(q.slice(0, 110))}${q.length > 110 ? '…' : ''}</div><div class="t2">${esc(chShort(it.ch))} · ${it.k === 'desc' ? 'Written' : 'MCQ'}</div></div><button class="iconbtn" style="color:var(--yellow)" aria-label="Unmark">${I.starf}</button></div>`); r.querySelector('button').onclick = () => { delete S.marked[id]; save(); r.remove(); }; mk.append(r); });
  $('#mkall', p).onclick = () => mids.length ? Session.start(buildQueue({ ids: mids, count: 40 }), 'Marked by me') : toast('Nothing marked yet');
  const hist = $('#hist', p); const ss = S.sessions.slice(-8).reverse();
  if (!ss.length) hist.outerHTML = `<div class="card empty">${I.clock}<div>Your sessions will appear here.</div></div>`;
  else ss.forEach(s => hist.append(h(`<div class="row plain"><div class="tx"><div class="t1">${esc(s.title)}</div><div class="t2">${new Date(s.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · ${s.n} questions · ${Math.round(s.secs / 60)} min</div></div><span class="val" style="font-weight:700;color:${s.pct >= 70 ? 'var(--green)' : s.pct >= 50 ? 'var(--orange)' : 'var(--red)'}">${s.pct}%</span></div>`)));
}

/* ---------- Summary, updates, settings ---------- */
function conceptAgg() {
  const m = {}; ITEMS.forEach(it => { const s = S.stats[it.id]; if (!s) return; const k = it.ch + ':' + it.cn; const a = (m[k] ||= { ch: it.ch, cn: it.cn, n: 0, c: 0, items: [], wrong: [] }); a.n += s.n; a.c += s.c; a.items.push(it.id); if (s.box <= 2 && s.w) a.wrong.push(it.id); }); return Object.values(m);
}
function showSummary() {
  const agg = conceptAgg(); const tot = Object.values(S.stats); const N = tot.reduce((a, s) => a + s.n, 0), C = tot.reduce((a, s) => a + s.c, 0);
  const mastered = agg.filter(a => a.n >= 3 && a.c / a.n >= .8).sort((a, b) => b.n - a.n);
  const needs = agg.filter(a => a.wrong.length || a.c / a.n < .6).sort((a, b) => (a.c / a.n) - (b.c / b.n));
  const week = Array.from({ length: 7 }, (_, i) => S.days[todayKey(new Date(Date.now() - i * DAY))] || {}); const wq = week.reduce((a, d) => a + (d.n || 0), 0), wm = Math.round(week.reduce((a, d) => a + (d.secs || 0), 0) / 60);
  const nm = a => `${chShort(a.ch)} · ${conceptTitle(a.ch, a.cn) || 'General'}`;
  let txt = `Rank Rank — learning summary (${todayKey()})\nAnswered ${N} times · ${N ? Math.round(C / N * 100) : 0}% correct · this week ${wq} questions, ${wm} min\n\nMastered:\n` + (mastered.map(a => '✓ ' + nm(a) + ` (${a.c}/${a.n})`).join('\n') || '—') + '\n\nPractise next:\n' + (needs.map(a => '• ' + nm(a) + ` (${a.c}/${a.n})`).join('\n') || '—');
  const b = openModal('Your learning summary', '');
  if (!N) { b.innerHTML = `<div class="empty">${I.sum}<div>Answer a few questions first — your summary builds itself from what you practise.</div></div>`; return; }
  b.append(h(`<div class="stat3" style="margin-top:0"><div><b>${N}</b><span>answers</span></div><div><b>${Math.round(C / N * 100)}%</b><span>correct</span></div><div><b>${wq}</b><span>this week</span></div></div>`));
  b.append(h(`<div class="group-h" style="margin-left:4px">What you have learnt</div>`));
  const l1 = h('<div class="list"></div>'); (mastered.length ? mastered.slice(0, 12) : []).forEach(a => l1.append(h(`<div class="row plain"><div class="tx"><div class="t1" style="font-size:15px">${esc(nm(a))}</div><div class="t2">${a.c}/${a.n} correct</div></div><span style="color:var(--green)">${I.ok.replace('<svg', '<svg width="22" height="22"')}</span></div>`)));
  if (!mastered.length) l1.append(h(`<div class="row plain"><div class="tx"><div class="t2">No topic has 3+ answers at 80% yet. Keep going — it shows up here.</div></div></div>`)); b.append(l1);
  b.append(h(`<div class="group-h" style="margin-left:4px">Where practice is needed</div>`));
  const l2 = h('<div class="list"></div>'); needs.slice(0, 12).forEach(a => { const tr = B.tricks.find(t => t.ch === a.ch && t.cn === a.cn) || B.tricks.find(t => t.ch === a.ch); l2.append(h(`<div class="row plain"><div class="tx"><div class="t1" style="font-size:15px">${esc(nm(a))}</div><div class="t2">${a.c}/${a.n} correct${tr ? ' · Trick: ' + esc(tr.t) : ''}</div></div><button class="chip blue" data-p="${conceptPage(a.ch, a.cn)}" data-f="${a.ch.startsWith('u-') ? a.ch : 'CB'}">p.${conceptPage(a.ch, a.cn)}</button><button class="iconbtn" data-rm="${a.ch}|${a.cn}" aria-label="Remind me">${I.bell}</button></div>`)); });
  if (!needs.length) l2.append(h(`<div class="row plain"><div class="tx"><div class="t2">Nothing weak right now. Try a new chapter or the June 2026 paper.</div></div></div>`)); b.append(l2);
  $$('[data-p]', l2).forEach(x => x.onclick = () => { closeModal(); Viewer.open(x.dataset.f, +x.dataset.p); });
  $$('[data-rm]', l2).forEach(x => x.onclick = () => { const [c, n] = x.dataset.rm.split('|'); closeModal(); setTimeout(() => remindTopic(c, n === 'null' || n === 'undefined' ? null : +n), 350); });
  const row = h(`<div class="btnrow" style="margin-top:16px"><button class="btn primary">${I.play} Practise weak topics</button><button class="btn gray">Copy summary</button></div>`);
  row.children[0].onclick = () => { const ids = needs.flatMap(a => a.wrong.length ? a.wrong : a.items); if (!ids.length) return toast('Nothing weak to practise'); closeModal(); Session.start(buildQueue({ ids, count: 20 }), 'Weak topics'); };
  row.children[1].onclick = () => { navigator.clipboard?.writeText(txt).then(() => toast('Summary copied')); };
  b.append(row);
}
function showUpdates() {
  S.seenUpdates = B.updates.length; save();
  const b = openModal('Law updates', `<p style="color:var(--label2);font-size:15px;margin-top:0">Changes after your material was written, checked against official and professional sources in Nov 2026. Always confirm with ICMAI’s applicability notice for your attempt.</p>`);
  const l = h('<div class="list"></div>');
  B.updates.forEach(u => l.append(h(`<div class="row plain" style="align-items:flex-start"><div class="tx"><div class="t2" style="margin:0 0 2px">${esc(u.area)} · ${esc(u.date)}</div><div class="t1" style="font-weight:600">${esc(u.title)}</div><div class="t2" style="color:var(--label)">${esc(u.text)}</div><a href="${esc(u.u)}" target="_blank" rel="noopener" style="font-size:14px;font-weight:600;display:inline-flex;gap:4px;margin-top:6px">Check the source ${I.ext.replace('<svg', '<svg width="14" height="14"')}</a></div></div>`)));
  b.append(l);
}
function showSettings() {
  const st = S.settings;
  const b = openModal('Settings', '');
  const stepRow = (label, key, obj, step, min, max, fmt) => { const r = h(`<div class="row plain"><div class="tx"><div class="t1">${label}</div></div><div class="stepper"><button aria-label="Decrease">${I.minus}</button><b>${fmt(obj[key])}</b><button aria-label="Increase">${I.plus}</button></div></div>`); const [m, v, p] = r.querySelectorAll('.stepper > *'); m.onclick = () => { obj[key] = Math.max(min, obj[key] - step); v.textContent = fmt(obj[key]); save(); }; p.onclick = () => { obj[key] = Math.min(max, obj[key] + step); v.textContent = fmt(obj[key]); save(); }; return r; };
  b.append(h(`<div class="group-h" style="margin-left:4px">You</div>`));
  const nm = h(`<div class="list"><label class="row plain"><div class="tx"><div class="t1">Your name</div></div><input id="nm" value="${esc(st.name)}" placeholder="Optional" style="border:0;background:none;text-align:right;color:var(--label2);width:50%"></label></div>`); b.append(nm);
  $('#nm', nm).oninput = e => { st.name = e.target.value.slice(0, 24); save(); };
  b.append(h(`<div class="group-h" style="margin-left:4px">Reminders</div>`));
  const rm = h(`<div class="list"><button class="row tap plain"><div class="tx"><div class="t1" style="color:var(--blue)">Study reminders</div><div class="t2">${st.notify ? 'Notifications on · ' + (st.remind || '07:00') : 'Google Calendar, Apple Calendar or device notifications'}</div></div>${I.chev}</button></div>`); rm.children[0].onclick = () => { closeModal(); setTimeout(() => Remind.modal(), 350); }; b.append(rm);
  b.append(h(`<div class="group-h" style="margin-left:4px">Daily rings</div>`));
  const g = h('<div class="list"></div>'); g.append(stepRow('MCQs', 'mcq', st.goals, 5, 5, 100, x => x), stepRow('Case-based', 'case', st.goals, 1, 1, 30, x => x), stepRow('Written answers', 'desc', st.goals, 1, 1, 20, x => x)); b.append(g);
  b.append(h(`<div class="group-h" style="margin-left:4px">Timers</div>`));
  const t = h('<div class="list"></div>'); t.append(stepRow('MCQ', 'mcq', st.t, 15, 30, 300, x => x + 's'), stepRow('Open recall', 'recall', st.t, 15, 15, 180, x => x + 's'), stepRow('Written, per mark', 'perMark', st.t, 18, 36, 300, x => (x / 60).toFixed(1) + ' min'), stepRow('Reading time', 'read', st.t, 30, 30, 900, x => fmtTime(x))); b.append(t);
  b.append(h(`<div class="group-h" style="margin-left:4px">Reading</div>`));
  const r = h(`<div class="list"><label class="row plain"><div class="tx"><div class="t1">Highlight key points</div><div class="t2">Sections, days, %, ₹, authorities</div></div><span class="switch"><input type="checkbox" id="kw" ${st.kw ? 'checked' : ''}><span></span></span></label>
    <label class="row plain"><div class="tx"><div class="t1">Underline legal terms</div><div class="t2">Tap a term for its meaning and an example</div></div><span class="switch"><input type="checkbox" id="gl" ${st.gl ? 'checked' : ''}><span></span></span></label>
    <div class="row plain"><div class="tx"><div class="t1">Appearance</div></div><div class="seg" id="thm" style="width:200px">${['auto', 'light', 'dark'].map(x => `<button aria-pressed="${st.theme === x}" data-t="${x}">${x[0].toUpperCase() + x.slice(1)}</button>`).join('')}</div></div></div>`); b.append(r);
  $('#kw', r).onchange = e => { st.kw = e.target.checked; save(); }; $('#gl', r).onchange = e => { st.gl = e.target.checked; save(); };
  $$('#thm button', r).forEach(x => x.onclick = () => { st.theme = x.dataset.t; $$('#thm button', r).forEach(y => y.setAttribute('aria-pressed', y === x)); applyTheme(); save(); });
  b.append(h(`<div class="group-h" style="margin-left:4px">Your data</div>`));
  const dd = h(`<div class="list"><button class="row tap plain"><div class="tx"><div class="t1" style="color:var(--blue)">Export progress</div><div class="t2">Move to another device</div></div></button><label class="row tap plain"><div class="tx"><div class="t1" style="color:var(--blue)">Import progress</div></div><input type="file" accept="application/json" class="sr"></label><button class="row tap plain"><div class="tx"><div class="t1" style="color:var(--red)">Reset all progress</div></div></button></div>`); b.append(dd);
  dd.children[0].onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'rank-rank-progress.json'; a.click(); };
  $('input', dd).onchange = async e => { try { const j = JSON.parse(await e.target.files[0].text()); if (!j.stats) throw 0; S = Object.assign(structuredClone(DEFAULT), j); save(); toast('Progress imported'); closeModal(); route(); } catch (x) { toast('That file is not a Rank Rank export'); } };
  dd.children[2].onclick = () => { if (confirm('Erase all answers, marks, highlights and XP on this device?')) { const keep = S.settings; S = structuredClone(DEFAULT); S.settings = keep; save(); toast('Progress reset'); closeModal(); route(); } };
  b.append(h(`<p class="foot" style="margin-top:14px">Question bank ${esc(B.version)} · ${ITEMS.length} questions. Content comes from your uploaded material; corrections are marked and linked to their source.</p>`));
}

/* ---------- Clock (count-down to a target, then overtime) ---------- */
class Clock {
  constructor(target) { this.target = target; this.t0 = Date.now(); this.acc = 0; this.running = true; this.els = []; this.ls = []; this.warned = false; this.iv = setInterval(() => this.tick(), 500); }
  elapsed() { return (this.acc + (this.running ? Date.now() - this.t0 : 0)) / 1000; }
  pause() { if (!this.running) return; this.acc += Date.now() - this.t0; this.running = false; this.tick(); this.ls.forEach(f => f(false)); }
  resume() { if (this.running) return; this.t0 = Date.now(); this.running = true; this.tick(); this.ls.forEach(f => f(true)); }
  toggle() { this.running ? this.pause() : this.resume(); vibrate(10); return this.running; }
  reset() { this.acc = 0; this.t0 = Date.now(); this.warned = false; const was = this.running; this.running = true; this.tick(); if (!was) this.ls.forEach(f => f(true)); }
  stop() { this.pause(); clearInterval(this.iv); return this.elapsed(); }
  on(f) { this.ls.push(f); f(this.running); }
  attach(el) { this.els.push(el); this.tick(); return el; }
  tick() {
    const e = this.elapsed(), over = e > this.target;
    if (over && !this.warned) { this.warned = true; vibrate([30, 60, 30]); }
    this.els.forEach(el => { const c = el.querySelector('.tf'); const C = +c.dataset.c; c.style.strokeDashoffset = C * (1 - Math.min(e / this.target, 1)); el.classList.toggle('over', over); el.classList.toggle('paused', !this.running); el.querySelector('b').textContent = over ? '+' + fmtTime(e - this.target) : fmtTime(this.target - e); });
  }
}
const ringT = (r, cls) => { const C = 2 * Math.PI * r; const s = (r + 4) * 2; return h(`<button class="${cls}" type="button" aria-label="Pause or resume the timer"><svg viewBox="0 0 ${s} ${s}"><circle class="tb" cx="${s / 2}" cy="${s / 2}" r="${r}"/><circle class="tf" cx="${s / 2}" cy="${s / 2}" r="${r}" data-c="${C}" stroke-dasharray="${C}"/></svg><b>0:00</b></button>`); };
const flashOf = t => String(t || '').replace(/^\|T\|/, '').slice(0, 160);

/* ---------- Session ---------- */
const Session = {
  el: $('#session'),
  shell() {
    this.el.innerHTML = `<div class="sheet-top"><button class="iconbtn" id="sx" aria-label="Close — your place is saved">${I.close}</button><button class="iconbtn" id="sback" aria-label="Previous question">${I.prev}</button><div class="ttl"><span id="st1"></span><small id="st2"></small></div><span id="stimer"></span><button class="iconbtn" id="shl" aria-label="Highlight options">${I.hl}</button><button class="iconbtn" id="sstar" aria-label="Star this question">${I.star}</button></div><div class="progress"><i id="sprog"></i></div><div class="sheet-body" id="sbody"></div>`;
    $('#sx').onclick = () => this.close();
    $('#sback').onclick = () => this.back();
    $('#shl').onclick = () => this.hlMenu();
    $('#sstar').onclick = () => { const id = this.cur?.id; if (!id) return; if (S.marked[id]) { delete S.marked[id]; toast('Removed from starred'); } else { S.marked[id] = Date.now(); toast('Starred — it comes back next practice'); vibrate(15); } save(); this.starUI(); };
    this.el.classList.add('open'); document.body.style.overflow = 'hidden';
  },
  hlMenu() {
    const id = this.cur?.id; const n = (S.hl[id] || []).length;
    const b = openModal('Highlights', `<div class="list"><label class="row plain"><div class="tx"><div class="t1">Highlight key points</div><div class="t2">Sections, days, %, ₹, forms, authorities</div></div><span class="switch"><input type="checkbox" id="mkw" ${S.settings.kw ? 'checked' : ''}><span></span></span></label><label class="row plain"><div class="tx"><div class="t1">Underline legal terms</div><div class="t2">Tap a term for meaning and example</div></div><span class="switch"><input type="checkbox" id="mgl" ${S.settings.gl ? 'checked' : ''}><span></span></span></label></div>
      <p class="foot">To add your own highlight, select any text in the question or answer. Tap a yellow highlight to remove it.</p>
      <button class="btn red block" id="mclr" style="margin-top:12px" ${n ? '' : 'disabled'}>${I.trash}<span>Clear my ${n || ''} highlight${n === 1 ? '' : 's'} on this question</span></button>`);
    $('#mkw', b).onchange = e => { S.settings.kw = e.target.checked; save(); $$('.hlzone', this.el).forEach(z => z.classList.toggle('nokw', !S.settings.kw)); };
    $('#mgl', b).onchange = e => { S.settings.gl = e.target.checked; save(); $$('.hlzone', this.el).forEach(z => z.classList.toggle('nogl', !S.settings.gl)); };
    $('#mclr', b).onclick = () => { delete S.hl[id]; save(); rerenderZones(id); closeModal(); toast('Highlights cleared'); };
  },
  start(queue, title, opts = {}) {
    if (!queue.length) return toast('No questions found');
    Object.assign(this, { q: queue.map(x => ({ ...x })), n0: queue.length, i: 0, title, opts, t0: Date.now(), xp: 0, run: 0 });
    this.shell(); this.render();
  },
  async resume() {
    const A = S.active; if (!A) return;
    if (A.q.some(x => /^[CK]-/.test(x.id))) await Cheat.load().catch(() => {});
    await decksReady;
    Object.assign(this, { q: A.q, n0: A.n0 || A.q.length, i: A.i, title: A.title, opts: {}, t0: Date.now() - (A.spent || 0) * 1000, xp: A.xp || 0, run: 0 });
    this.shell(); this.render();
  },
  restart() { const A = S.active; if (!A) return; this.start(A.q.slice(0, A.n0 || A.q.length).map(x => ({ id: x.id, mode: x.mode })), A.title); },
  persist() { if (!this.q || this.i >= this.q.length) return; S.active = { q: this.q, n0: this.n0, i: this.i, title: this.title, xp: this.xp, at: Date.now(), spent: Math.round((Date.now() - this.t0) / 1000) }; save(); },
  get res() { return this.q.filter(x => x.done).map(x => ({ id: x.id, ok: x.done.ok, secs: x.done.secs })); },
  starUI() { const on = !!S.marked[this.cur?.id]; const b = $('#sstar'); if (!b) return; b.innerHTML = on ? I.starf : I.star; b.style.color = on ? 'var(--yellow)' : 'var(--blue)'; },
  close() {
    this.clock?.stop(); this.cleanup?.(); this.cleanup = null; hidePill();
    if (this.q && this.i < this.q.length) { this.persist(); toast('Saved — continue from Today anytime'); }
    this.el.classList.remove('open'); if (!$('#viewer').classList.contains('open')) document.body.style.overflow = ''; route();
  },
  get cur() { return this.q[this.i]; },
  header() {
    const it = BYID[this.cur.id]; const done = this.q.filter(x => x.done).length;
    $('#st1').textContent = this.title; $('#st2').textContent = `${this.i + 1} of ${this.q.length} · ${chShort(it.ch)}`;
    $('#sprog').style.width = (done / this.q.length * 100) + '%'; this.starUI(); $('#sback').disabled = this.i === 0; $('#sback').style.opacity = this.i === 0 ? .35 : 1;
  },
  newClock(target, smallInTop) {
    this.clock?.stop(); const holder = $('#stimer'); holder.innerHTML = '';
    this.clock = new Clock(target);
    if (smallInTop) { const t = ringT(12, 'timer'); t.onclick = () => this.clock.toggle(); holder.append(this.clock.attach(t)); }
    return this.clock;
  },
  ppBtn(clock) { const b = h(`<button class="btn gray icon" type="button"></button>`); b.onclick = () => clock.toggle(); clock.on(run => { b.innerHTML = run ? I.pause : I.play; b.setAttribute('aria-label', run ? 'Pause timer' : 'Resume timer'); b.classList.toggle('resume', !run); }); return b; },
  retryBtn(clock) { return this.btn('Retry', 'gray', () => { clock.reset(); toast('Timer restarted'); }, I.retry); },
  back() { if (this.i === 0) return; this.clock?.stop(); this.i--; this.render(); },
  skip() {
    const c = this.cur; c.sk = (c.sk || 0) + 1; this.clock?.stop();
    if (c.sk <= 2 && this.i < this.q.length - 1) { this.q.splice(this.i, 1); this.q.push(c); toast('Moved to the end — you’ll get another go'); this.render(); }
    else { c.skipped = true; this.i++; if (this.i >= this.q.length) return this.finish(); this.render(); }
  },
  render() {
    hidePill(); this.cleanup?.(); this.cleanup = null; const body = $('#sbody'); body.innerHTML = ''; body.scrollTop = 0;
    const it = BYID[this.cur.id]; if (!it) { this.q.splice(this.i, 1); if (this.i >= this.q.length) return this.finish(); return this.render(); }
    this.header(); this.persist(); this.recorded = false; this.ph = null;
    if (this.cur.done) return this.renderReview(it);
    if (it.k === 'cloze') return this.renderCloze(it);
    if (this.cur.mode === 'desc') return this.renderDesc(it, 'attempt');
    if (this.cur.mode === 'recall') return this.renderRecall(it);
    return this.renderMCQ(it);
  },
  meta(it, extra = '') {
    const tags = it.tags.map(t => /^AI/.test(t) ? `<span class="chip purple">${I.ai} ${esc(t)}</span>` : /IMP/.test(t) ? `<span class="chip orange">${esc(t)}</span>` : /PYQ|MQP/.test(t) ? `<span class="chip purple">${esc(t)}</span>` : `<span class="chip">${esc(t)}</span>`).join('');
    const ct = conceptTitle(it.ch, it.cn); const sk = this.cur?.sk ? `<span class="chip orange">${I.retry.replace('<svg', '<svg width="12" height="12"')} Skipped earlier — have another go</span>` : '';
    const upd = it.orig ? `<span class="chip green">${I.check.replace('<svg', '<svg width="12" height="12"')} Updated to current law</span>` : '';
    return `<div class="qmeta">${sk}<span class="chip blue">${esc(chShort(it.ch))}${ct ? ' · ' + esc(ct.length > 38 ? ct.slice(0, 36) + '…' : ct) : ''}</span><span class="chip">${it.m} mark${it.m === 1 ? '' : 's'}</span>${it.sc ? '<span class="chip green">Case</span>' : ''}${upd}${extra}${tags}</div>`;
  },
  qcard(it, extra) {
    const c = h(`<article class="qcard">${this.meta(it, extra)}</article>`);
    if (it.case) { const cb = h('<div class="casebox"><b>Case study</b></div>'); const z = richParas([it.case], it.id, 'prose'); z.style.cssText = 'font-family:var(--font);font-size:15px;line-height:1.5;margin-top:4px'; cb.append(z); c.append(cb); }
    c.append(richParas(Array.isArray(it.q) ? it.q : [it.q], it.id, 'qtext'));
    return c;
  },
  collapse(card) {
    if (innerWidth >= 1100 || card.querySelector('.qtext').textContent.length < 280) return;
    card.classList.add('collapsed'); const b = h(`<button class="more" type="button">Show full question</button>`); b.onclick = () => { const c = card.classList.toggle('collapsed'); b.textContent = c ? 'Show full question' : 'Hide question'; }; card.append(b);
  },
  actions(btns, prompt) { const a = h('<div class="actions"></div>'); if (prompt) a.append(h(`<p class="prompt">${esc(prompt)}</p>`)); btns.forEach(b => b && a.append(b)); $('#sbody').append(a); return a; },
  btn(label, cls, fn, icon = '') { const b = h(`<button class="btn ${cls}" type="button">${icon}<span>${esc(label)}</span></button>`); b.onclick = fn; return b; },
  sourceChip(f, p, label, flash) { const m = PDFStore.meta(f); const b = h(`<button class="chip blue" type="button">${I.doc.replace('<svg', '<svg width="13" height="13"')} ${esc(label || (m ? m.name : 'PDF'))} · p.${p}</button>`); b.onclick = () => Viewer.open(f, p, { flash }); return b; },
  notesEl(it) {
    const list = [].concat(it.note ? [it.note] : [], it.notes || []); const frag = document.createDocumentFragment(); const seen = new Set();
    list.forEach(n => { if (seen.has(n.text)) return; seen.add(n.text); frag.append(noteCard(n)); });
    if (it.orig) { const o = it.orig; const parts = []; if (o.q) parts.push('Question wording: “' + o.q + '”'); if (o.o) Object.entries(o.o).forEach(([k, v]) => parts.push(`Option ${k} read “${v}”`)); if (o.a) parts.push(`Book answer key: ${o.a}`); frag.append(noteCard({ kind: 'update', text: 'What your book printed — ' + parts.join(' · ') + '. The version above is updated to current law.', links: [] }, 'Book version')); }
    return frag;
  },
  tricksEl(it) { const frag = document.createDocumentFragment(); tricksFor(it).forEach(t => frag.append(h(`<div class="trick"><b>${I.bulb.replace('<svg', '<svg width="15" height="15" style="vertical-align:-2px"')} ${esc(t.t)}</b><p>${esc(t.x)}</p></div>`))); return frag; },
  materialEl(it) {
    const p = h('<div class="panel"></div>'); const r = it.r || { p: it.src.p, c: it.cn, strong: false, t: '' }; const ct = conceptTitle(it.ch, r.c);
    if (it.why) { p.append(h(`<div class="panel-h"><h3>Why</h3><span class="chip purple">${I.ai} AI explanation</span></div>`)); p.append(richParas([it.why], it.id)); p.append(h('<div style="height:14px"></div>')); }
    p.append(h(`<div class="panel-h"><h3>${r.strong ? 'Related passage in your material' : 'Revise the concept'}</h3></div>`));
    if (r.strong) { const q = richParas([r.t], it.id); q.classList.add('quote'); p.append(q); }
    const chips = h('<div class="chips" style="margin-top:12px"></div>');
    if (B.files.CB && it.src.f in B.files) chips.append(this.sourceChip('CB', r.p, 'Concept Book', r.strong ? r.t : ''));
    if (ct) chips.append(h(`<span class="chip">Concept ${r.c} · ${esc(ct.length > 40 ? ct.slice(0, 38) + '…' : ct)}</span>`));
    chips.append(this.sourceChip(it.src.f, it.src.p, it.src.f === 'PAPER' ? 'June 2026 paper' : it.src.f in B.files ? 'Answer key' : 'Your PDF', flashOf(it.q))); p.append(chips); return p;
  },
  verdict(ok, gain) { return h(`<div class="verdict ${ok ? 'ok' : 'no'}">${ok ? I.ok : I.no}<span>${ok ? ['Correct', 'Spot on', 'Nailed it', 'Exactly right'][Math.random() * 4 | 0] : 'Not quite'}</span>${gain != null ? `<span class="chip" style="margin-left:auto">+${gain} XP</span>` : ''}</div>`); },
  done(it, ok, mode, secs, extra = {}) {
    if (this.recorded) return 0; this.recorded = true;
    const gain = record(it, ok, mode, secs); this.xp += gain; this.cur.done = Object.assign({ ok, secs: Math.round(secs || 0) }, extra);
    this.run = ok ? this.run + 1 : 0; if (ok && this.run && this.run % 5 === 0) setTimeout(() => toast(this.run + ' in a row — you’re on fire', I.flame), 300);
    checkAwards(); this.persist(); this.header(); return gain;
  },
  next() { this.clock?.stop(); this.i++; if (this.i >= this.q.length) return this.finish(); const b = $('#sbody'); b.style.opacity = 0; setTimeout(() => { b.style.opacity = ''; this.render(); }, 120); },
  optsEl(it, sel, reveal) {
    const opts = h('<div class="opts" role="radiogroup"></div>'); const key = it.a;
    Object.entries(it.o).sort().forEach(([k, v]) => { const up = it.orig?.o && k in it.orig.o; const b = h(`<button class="opt" role="radio" aria-checked="false" type="button" data-k="${k}"><span class="l">${k}</span><span>${esc(v)}${up ? ' <em class="upd">updated</em>' : ''}</span></button>`); if (reveal) { if (k === key) b.classList.add('right'); else if (k === sel) b.classList.add('wrong'); else b.classList.add('dim'); } opts.append(b); });
    return opts;
  },
  reveal(it, ok, gain, card, wrap) {
    const ans = h('<div class="ans"></div>'); ans.append(this.verdict(ok, gain));
    if (it.an && !it.orig) ans.append(h(`<div class="chips" style="margin-top:10px"><span class="chip orange">Updated figure in your book: ${esc(it.an)}</span></div>`));
    ans.append(this.notesEl(it), this.materialEl(it), this.tricksEl(it)); card.after(ans); wrap.classList.add('split'); return ans;
  },
  renderReview(it) {
    const d = this.cur.done; const body = $('#sbody'); const wrap = h('<div class="qwrap"></div>'); body.append(wrap);
    body.prepend(h(`<div class="review-bar">${(d.ok ? I.ok : I.no).replace('<svg', '<svg width="18" height="18"')} You answered this earlier — ${d.ok ? 'correct' : 'needs practice'}</div>`));
    const card = this.qcard(it); wrap.append(card); $('#stimer').innerHTML = '';
    if (it.k === 'mcq' && this.cur.mode !== 'recall') { card.append(this.optsEl(it, d.sel, true)); this.reveal(it, d.ok, null, card, wrap); }
    else if (it.k === 'cloze') { card.after(this.clozeAns(it)); wrap.classList.add('split'); }
    else if (it.k === 'mcq') { const a = h('<div class="ans"></div>'); a.append(h(`<div class="panel"><div class="panel-h"><h3>Answer</h3></div><p class="qtext" style="font-size:21px">${esc(it.o[it.a])}</p></div>`), this.notesEl(it), this.materialEl(it)); card.after(a); wrap.classList.add('split'); }
    else { const r = h('<div></div>'); r.append(this.answerPanel(it)); wrap.append(r); wrap.classList.add('split'); this.collapse(card); }
    this.actions([this.i > 0 ? this.btn('Back', 'gray', () => this.back(), I.prev) : null, this.btn('Next', 'primary', () => this.next(), I.next)]);
  },

  renderMCQ(it) {
    const body = $('#sbody'); const wrap = h('<div class="qwrap"></div>'); body.append(wrap);
    const card = this.qcard(it); wrap.append(card); let sel = null;
    const opts = this.optsEl(it); $$('.opt', opts).forEach(b => b.onclick = () => { if (this.recorded) return; sel = b.dataset.k; $$('.opt', opts).forEach(o => { o.classList.toggle('sel', o === b); o.setAttribute('aria-checked', o === b); }); chk.disabled = false; vibrate(8); });
    card.append(opts); card.append(h(`<p class="hint">Read the facts twice, the options once.<span class="kbd"> Keys 1–4 select, Enter checks, Space pauses.</span></p>`));
    const timed = S.settings.timer; const clock = this.newClock(S.settings.t.mcq, timed); if (!timed) $('#stimer').innerHTML = '';
    const chk = this.btn('Check', 'primary', () => check(), I.check); chk.disabled = true;
    const acts = this.actions([this.btn('Skip', 'gray', () => this.skip(), I.skip), timed ? this.ppBtn(clock) : null, chk]);
    const keyh = e => { if (!this.el.classList.contains('open') || modal.classList.contains('on') || e.target.matches('input,textarea')) return; const m = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', a: 'A', b: 'B', c: 'C', d: 'D' }[e.key.toLowerCase()]; if (m && !this.recorded) $(`.opt[data-k="${m}"]`, opts)?.click(); if (e.key === ' ' && !this.recorded) { e.preventDefault(); clock.toggle(); } if (e.key === 'Enter') { e.preventDefault(); this.recorded ? this.next() : sel && check(); } };
    document.addEventListener('keydown', keyh); this.cleanup = () => document.removeEventListener('keydown', keyh);
    const check = () => {
      const secs = clock.stop(); const ok = sel === it.a; const gain = this.done(it, ok, 'mcq', secs, { sel }); vibrate(ok ? 20 : [40, 40, 40]);
      $$('.opt', opts).forEach(o => { const k = o.dataset.k; o.classList.remove('sel'); if (k === it.a) o.classList.add('right'); else if (k === sel) o.classList.add('wrong'); else o.classList.add('dim'); });
      const ans = this.reveal(it, ok, gain, card, wrap);
      acts.innerHTML = ''; acts.append(this.btn('Next question', 'primary', () => this.next(), I.next));
      if (!ok) setTimeout(() => ans.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
    };
  },
  renderRecall(it) {
    const body = $('#sbody'); const wrap = h('<div class="qwrap"></div>'); body.append(wrap);
    const card = this.qcard(it, `<span class="chip purple">${I.ai} AI format · open recall</span>`); wrap.append(card);
    card.append(h(`<p class="hint">No options this time. Say or write the answer from memory, then check yourself honestly.</p>`));
    const clock = this.newClock(S.settings.t.recall, true);
    const reveal = () => {
      const secs = clock.stop(); const ans = h('<div class="ans"></div>');
      ans.append(h(`<div class="panel"><div class="panel-h"><h3>Answer</h3><span class="chip">Option ${it.a} in the MCQ book</span></div><p class="qtext" style="font-size:22px">${esc(it.o[it.a])}</p></div>`));
      ans.append(this.notesEl(it), this.materialEl(it), this.tricksEl(it)); card.after(ans); wrap.classList.add('split');
      acts.innerHTML = ''; acts.append(h('<p class="prompt">Did you recall it?</p>'), this.btn('Missed it', 'red', () => { const g = this.done(it, false, 'recall', secs); toast('+' + g + ' XP · it comes back soon'); this.next(); }, I.xs), this.btn('Recalled it', 'green', () => { const g = this.done(it, true, 'recall', secs); toast('+' + g + ' XP'); this.next(); }, I.check));
    };
    const acts = this.actions([this.btn('Skip', 'gray', () => this.skip(), I.skip), this.ppBtn(clock), this.btn('Reveal', 'primary', reveal, I.eye)]);
  },
  clozeAns(it) {
    const a = h('<div class="ans"></div>');
    const p = h(`<div class="panel"><div class="panel-h"><h3>Answer</h3></div><p class="cloze-a">${esc(it.a)}</p></div>`);
    const full = richParas([it.full], it.id); full.classList.add('quote'); p.append(full);
    const chips = h('<div class="chips" style="margin-top:12px"></div>'); chips.append(this.sourceChip(it.src.f, it.src.p, null, it.full));
    const ct = conceptTitle(it.ch, it.cn); if (ct) chips.append(h(`<span class="chip">${esc(ct.length > 44 ? ct.slice(0, 42) + '…' : ct)}</span>`));
    p.append(chips); a.append(p); if (it.notes) a.append(this.notesEl(it)); return a;
  },
  renderCloze(it) {
    const body = $('#sbody'); const wrap = h('<div class="qwrap"></div>'); body.append(wrap);
    const card = h(`<article class="qcard">${this.meta(it, `<span class="chip purple">${I.bolt.replace('<svg', '<svg width="12" height="12"')} Key value</span>`)}</article>`);
    const q = h('<p class="qtext cloze"></p>'); const parts = it.q.split('_____'); parts.forEach((s, i) => { q.append(s); if (i < parts.length - 1) q.append(h('<span class="blank">?</span>')); }); card.append(q);
    card.append(h(`<p class="hint">Fill the blank from memory — the exact value is what earns the mark.</p>`)); wrap.append(card);
    const clock = this.newClock(S.settings.t.recall, true);
    const reveal = () => { const secs = clock.stop(); $('.blank', card).textContent = it.a; $('.blank', card).classList.add('shown'); card.after(this.clozeAns(it)); wrap.classList.add('split');
      acts.innerHTML = ''; acts.append(h('<p class="prompt">Did you know it?</p>'), this.btn('Missed it', 'red', () => { this.done(it, false, 'recall', secs); this.next(); }, I.xs), this.btn('Knew it', 'green', () => { const g = this.done(it, true, 'recall', secs); toast('+' + g + ' XP'); this.next(); }, I.check)); };
    const acts = this.actions([this.btn('Skip', 'gray', () => this.skip(), I.skip), this.ppBtn(clock), this.btn('Reveal', 'primary', reveal, I.eye)]);
  },

  answerPanel(it, mode) {
    const wrap = h('<div class="ans"></div>');
    if (mode === 'hidden') { wrap.append(h(`<div class="panel"><div class="empty" style="padding:22px 8px">${I.eyeoff}<div><b style="color:var(--label)">Answer hidden</b><br>Write or say it from memory. You’ll compare when you tap Complete.</div></div></div>`)); return wrap; }
    wrap.append(this.notesEl(it));
    const p = h('<div class="panel"></div>'); const head = h(`<div class="panel-h"><h3>${it.plan ? 'Exam plan' : 'Answer from your material'}</h3></div>`);
    head.append(this.sourceChip(it.src.f, it.src.p, it.src.f === 'PAPER' ? 'June 2026 paper' : null, flashOf(Array.isArray(it.q) ? it.q[0] : it.q))); p.append(head);
    if (it.plan) { p.append(h(`<div class="chips" style="margin-bottom:8px"><span class="chip purple">${I.ai} AI-structured from your Concept Book — verify</span></div>`)); p.append(richParas([it.plan], it.id)); }
    else p.append(richParas(it.ans, it.id));
    wrap.append(p);
    if (it.secs) it.secs.forEach(sc => { const sp = h('<div class="panel"></div>'); const hh = h(`<div class="panel-h"><h3>Concept ${sc.n} · ${esc(sc.t)}</h3></div>`); hh.append(this.sourceChip('CB', sc.p, 'Concept Book', sc.paras[0])); sp.append(hh, richParas(sc.paras, it.id)); wrap.append(sp); });
    const kws = keywordsOf((it.ans || []).join(' ') + ' ' + (it.plan || '') + ' ' + (it.secs || []).map(s => s.paras.join(' ')).join(' '));
    if (kws.length) { const k = h(`<div class="panel"><div class="panel-h"><h3>Keywords the examiner looks for</h3></div><div class="chips"></div></div>`); kws.forEach(w => $('.chips', k).append(h(`<span class="chip blue">${esc(w)}</span>`))); wrap.append(k); }
    wrap.append(h(`<div class="panel"><div class="panel-h"><h3>Write it like a topper</h3></div><div class="structure">${(it.sc ? ['1 · Provision & section', '2 · Key facts', '3 · Apply the law', '4 · Conclusion'] : ['1 · One-line intro', '2 · Section + sub-points', '3 · Numbers & time limits', '4 · Conclusion']).map(s => `<span>${s}</span>`).join('')}</div><p class="hint" style="margin-top:10px">Explain the reason behind each rule in your own words — that is what survives the exam hall, not memorised lines.</p></div>`));
    wrap.append(this.tricksEl(it));
    if (it.cn && it.src.f in B.files) { const c = h(`<div class="chips" style="margin-top:12px"><span class="chip">Understand it first:</span></div>`); c.append(this.sourceChip('CB', conceptPage(it.ch, it.cn), 'Concept ' + it.cn)); wrap.append(c); }
    return wrap;
  },
  phaseBar(step, color, icon, title, sub, clock) {
    const steps = ['Answer', 'Check', 'Read', 'Practise'];
    const bar = h(`<div class="phasebar"><div class="pb-main"><span class="ph-ic" style="background:var(--${color})">${icon}</span><div class="ph-t"><b>${esc(title)}</b><span>${esc(sub)}</span></div></div><div class="steps">${steps.map((s, i) => `<span class="${i < step ? 'done' : i === step ? 'now' : ''}">${s}</span>`).join('')}</div></div>`);
    if (clock) { const t = ringT(22, 'pbtimer'); t.onclick = () => clock.toggle(); clock.attach(t); $('.pb-main', bar).append(t); }
    return bar;
  },
  renderDesc(it, ph) {
    this.ph = ph; const body = $('#sbody'); body.innerHTML = ''; body.scrollTop = 0; $('#stimer').innerHTML = ''; this.clock?.stop(); this.clock = null;
    const target = Math.round((it.m || 7) * S.settings.t.perMark); const say = `Aim for ${Math.round(target / 60)} min · ${it.m} marks`;
    const wrap = h('<div class="qwrap"></div>'); const left = h('<div></div>'); const right = h('<div></div>');
    const card = this.qcard(it); left.append(card);
    const timed = (t, step, color, icon, title, sub) => { const c = new Clock(t); this.clock = c; body.append(this.phaseBar(step, color, icon, title, sub, c)); return c; };
    const showAns = mode => { right.append(this.answerPanel(it, mode)); wrap.classList.add('split'); };
    let acts;
    if (ph === 'attempt') {
      const c = timed(target, 0, 'blue', I.pen, 'Your turn — write or say it', say + ' · tap the ring to pause');
      const hint = h(`<button class="btn gray block" style="margin-top:12px">${I.bulb}<span>Need a hint? Show first keywords</span></button>`);
      hint.onclick = () => { const kws = keywordsOf((it.ans || []).join(' ') + ' ' + (it.plan || '')).slice(0, 4); hint.replaceWith(h(`<div class="chips" style="justify-content:center;margin-top:12px">${kws.map(k => `<span class="chip blue">${esc(k)}</span>`).join('') || '<span class="chip">No keywords found</span>'}</div>`)); };
      const sk = h(`<button class="more" type="button" style="display:block;margin:14px auto 0">${I.skip.replace('<svg', '<svg width="13" height="13" style="vertical-align:-2px"')} Skip — bring it back at the end</button>`); sk.onclick = () => this.skip();
      left.append(hint, sk);
      const go = () => { this.secs = c.stop(); this.renderDesc(it, 'reveal'); };
      acts = [this.retryBtn(c), this.ppBtn(c), this.btn('Complete', 'primary', go, I.check)];
    }
    if (ph === 'reveal') {
      body.append(this.phaseBar(1, 'green', I.eye, 'Compare with the material', 'Be honest — it decides what comes back')); showAns(); this.collapse(card);
      acts = ['Was your answer correct?', this.btn('No', 'red', () => this.renderDesc(it, 'read'), I.xs), this.btn('Partly', 'orange', () => this.renderDesc(it, 'read'), I.half), this.btn('Yes', 'green', () => { const g = this.done(it, true, 'first', this.secs); toast('+' + g + ' XP · well written'); this.next(); }, I.check)];
    }
    if (ph === 'read') {
      const c = timed(S.settings.t.read, 2, 'teal', I.book, 'Read & understand', 'Find the section, the numbers and the reason behind each rule'); showAns(); this.collapse(card);
      const go = () => { c.stop(); this.renderDesc(it, 'ready'); };
      acts = [this.retryBtn(c), this.ppBtn(c), this.btn('Complete', 'primary', go, I.check)];
    }
    if (ph === 'ready') {
      body.append(this.phaseBar(3, 'indigo', I.pen, 'Ready to practise?', 'From memory works best — seeing it is fine for a first pass')); showAns(); this.collapse(card);
      const sk = this.btn('Not now — bring it back at the end', 'gray', () => { this.done(it, false, 'first', this.secs); this.requeue(); this.next(); }, I.skip); sk.classList.add('block'); sk.style.marginTop = '12px'; left.append(sk);
      acts = ['Ready to practise this answer?', this.btn('Seeing it', 'tinted', () => { this.pmode = 'seeing'; this.renderDesc(it, 'practice'); }, I.eye), this.btn('From memory', 'primary', () => { this.pmode = 'memory'; this.renderDesc(it, 'practice'); }, I.pen)];
    }
    if (ph === 'practice') {
      const seeing = this.pmode === 'seeing';
      const c = timed(target, 3, seeing ? 'indigo' : 'blue', seeing ? I.eye : I.mic, seeing ? 'Practise while seeing it' : 'Practise from memory', seeing ? 'Use your own words, glance only when stuck' : say + ' · answer hidden');
      showAns(seeing ? '' : 'hidden'); if (seeing) this.collapse(card);
      const go = () => { this.secs2 = c.stop(); this.renderDesc(it, seeing ? 'check-seen' : 'check'); };
      acts = [this.retryBtn(c), this.ppBtn(c), this.btn('Complete', 'primary', go, I.check)];
    }
    if (ph === 'check' || ph === 'check-seen') {
      body.append(this.phaseBar(3, 'green', I.eye, 'Check your practice', ph === 'check' ? 'Compare what you wrote with the material' : 'Could you put it in your own words?')); showAns(); this.collapse(card);
      const t = (this.secs || 0) + (this.secs2 || 0);
      acts = [ph === 'check' ? 'Did you get it right this time?' : 'Could you write it fully?', this.btn('Not yet', 'red', () => { this.done(it, false, 'retry', t); this.requeue(); this.next(); }, I.xs), this.btn(ph === 'check' ? 'Yes, got it' : 'Yes', 'green', () => { const g = this.done(it, true, 'retry', t); toast('+' + g + ' XP · that’s how it sticks'); this.next(); }, I.check)];
      if (ph === 'check-seen') { const mem = this.btn('Now try once from memory', 'tinted', () => { this.pmode = 'memory'; this.renderDesc(it, 'practice'); }, I.pen); mem.classList.add('block'); mem.style.marginTop = '12px'; left.append(mem); }
    }
    wrap.append(left, right); body.append(wrap);
    const prompt = typeof acts[0] === 'string' ? acts.shift() : null; this.actions(acts, prompt);
  },
  requeue() { const id = this.cur.id; if (this.q.some((x, j) => j > this.i && x.id === id)) return; this.q.push({ id, mode: 'desc', sk: 1 }); toast('We’ll bring this one back at the end'); },

  finish() {
    this.clock?.stop(); this.cleanup?.(); $('#stimer').innerHTML = ''; S.active = null;
    const res = this.res; const n = res.length, ok = res.filter(r => r.ok).length, pct = n ? Math.round(ok / n * 100) : 0, secs = Math.round((Date.now() - this.t0) / 1000);
    const skipped = [...new Set(this.q.filter(x => x.skipped && !this.q.some(y => y.id === x.id && y.done)).map(x => x.id))];
    if (n) { S.sessions.push({ title: this.title, at: Date.now(), n, ok, pct, secs }); S.sessions = S.sessions.slice(-60); } save(); checkAwards();
    $('#sprog').style.width = '100%'; $('#st2').textContent = 'Session complete'; $('#sback').disabled = true; $('#sback').style.opacity = .35;
    const body = $('#sbody'); body.innerHTML = ''; const C = 2 * Math.PI * 75; const col = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)';
    const nm = S.settings.name ? ', ' + S.settings.name : '';
    const head = pct >= 85 ? 'Outstanding' + nm : pct >= 70 ? 'Strong session' + nm : pct >= 50 ? 'Good effort' + nm : 'Every miss is now on your list';
    const sub = pct >= 70 ? 'This is rank-holder consistency. Keep the rings closing.' : 'The questions you missed come back first next time — that is how you get stronger.';
    const v = h(`<div class="qwrap"><div class="result-hero"><div class="score-ring"><svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="75" stroke="var(--fill)" stroke-width="14"/><circle class="fg" cx="85" cy="85" r="75" stroke="${col}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C * (1 - pct / 100)}"/></svg><div class="center"><b>${pct}%</b></div></div><h2>${esc(head)}</h2><p>${sub}</p></div>
      <div class="stat3"><div><b>${ok}/${n}</b><span>correct</span></div><div><b>${fmtTime(secs)}</b><span>time</span></div><div><b>+${this.xp}</b><span>XP</span></div></div>
      ${skipped.length ? `<div class="card" style="margin-top:14px;display:flex;align-items:center;gap:12px"><span style="color:var(--orange)">${I.skip.replace('<svg', '<svg width="22" height="22"')}</span><div style="flex:1"><b>${skipped.length} skipped</b><div class="t2" style="font-size:13px;color:var(--label2)">Cover them now while the topic is fresh.</div></div><button class="btn tinted" id="tryskip"><span>Try them</span></button></div>` : ''}
      <h2 class="section-h">Review</h2><div class="list" id="rv"></div></div>`);
    body.append(v); animateRings(v); if (pct >= 70 && n >= 3) setTimeout(confetti, 500);
    $('#tryskip', v)?.addEventListener('click', () => this.start(skipped.map(id => ({ id, mode: BYID[id].k === 'desc' ? 'desc' : 'mcq' })), 'Skipped questions'));
    const rv = $('#rv', v);
    res.forEach(r => { const it = BYID[r.id]; const q = String(Array.isArray(it.q) ? it.q[0] : it.q).replace(/^\|T\|/, ''); rv.append(h(`<div class="row plain"><span style="color:${r.ok ? 'var(--green)' : 'var(--red)'};width:24px">${(r.ok ? I.ok : I.no).replace('<svg', '<svg width="22" height="22"')}</span><div class="tx"><div class="t1" style="font-size:15px">${esc(q.slice(0, 120))}${q.length > 120 ? '…' : ''}</div><div class="t2">${esc(chShort(it.ch))} · ${it.k === 'desc' ? 'Written' : it.k === 'cloze' ? 'Key value' : 'MCQ'}${r.secs ? ' · ' + fmtTime(r.secs) : ''}</div></div></div>`)); });
    if (!n) rv.append(h('<div class="row plain"><div class="tx"><div class="t2">No answers recorded.</div></div></div>'));
    const wrong = [...new Set(res.filter(r => !r.ok).map(r => r.id))];
    const acts = this.actions([this.btn('Summarise', 'gray', () => showSummary(), I.sum)]);
    if (wrong.length) acts.append(this.btn('Practise mistakes', 'primary', () => this.start(wrong.map(id => ({ id, mode: BYID[id].k === 'desc' ? 'desc' : 'mcq' })), 'My mistakes'), I.retry));
    else acts.append(this.btn('Done', 'primary', () => this.close(), I.check));
    this.i = this.q.length;
  }
};
function noteCard(n, label) {
  const lab = label || { error: 'Correction', update: 'Law update', debate: 'Check this' }[n.kind]; const col = n.kind === 'error' ? 'red' : n.kind === 'update' ? 'blue' : 'orange';
  const el = h(`<div class="note ${n.kind}"><b style="color:var(--${col})">${n.kind === 'error' ? I.warn : I.info} ${esc(lab)}<button class="copy" type="button" aria-label="Copy">${I.copy}</button></b><span class="nt">${esc(n.text)}</span><div>${(n.links || []).map(l => `<a href="${esc(l.u)}" target="_blank" rel="noopener">${esc(l.t)} ${I.ext.replace('<svg', '<svg width="13" height="13" style="vertical-align:-1px"')}</a>`).join('')}</div></div>`);
  $('.copy', el).onclick = () => { navigator.clipboard?.writeText(n.text + ((n.links || []).length ? '\nSource: ' + n.links.map(l => l.u).join(' ') : '')).then(() => toast('Copied')); };
  return el;
}
/* ---------- PDF storage ---------- */
const PDFStore = {
  _db: null, _site: {},
  meta(k) { if (B.files[k]) return B.files[k]; const u = (S.userPdfs || []).find(x => x.id === k); return u ? { name: u.name, file: u.name + '.pdf', user: true } : null; },
  db() { return this._db ||= new Promise((res, rej) => { const r = indexedDB.open('rankrank', 1); r.onupgradeneeded = () => { const d = r.result; ['files', 'meta'].forEach(s => d.objectStoreNames.contains(s) || d.createObjectStore(s)); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); },
  async get(name, store = 'files') { try { const db = await this.db(); return await new Promise(res => { const q = db.transaction(store).objectStore(store).get(name); q.onsuccess = () => res(q.result ?? null); q.onerror = () => res(null); }); } catch (e) { return null; } },
  async put(name, val, store = 'files') { const db = await this.db(); return new Promise((res, rej) => { const t = db.transaction(store, 'readwrite'); t.objectStore(store).put(val, name); t.oncomplete = res; t.onerror = () => rej(t.error); }); },
  async del(name, store = 'files') { const db = await this.db(); return new Promise(res => { const t = db.transaction(store, 'readwrite'); t.objectStore(store).delete(name); t.oncomplete = res; t.onerror = res; }); },
  async site(k) { if (!B.files[k]) return false; if (k in this._site) return this._site[k]; try { const r = await fetch('pdfs/' + B.files[k].file, { method: 'HEAD' }); this._site[k] = r.ok; } catch (e) { this._site[k] = false; } return this._site[k]; },
  async status(k) { if (await this.site(k)) return 'site'; return (await this.get(B.files[k].file)) ? 'device' : 'none'; },
  async data(k) {
    if (!B.files[k]) { const b = await this.get('user/' + k); return b ? new Uint8Array(await b.arrayBuffer()) : null; }
    const local = await this.get(B.files[k].file); if (local) return new Uint8Array(await local.arrayBuffer());
    if (await this.site(k)) { try { const r = await fetch('pdfs/' + B.files[k].file); if (r.ok) return new Uint8Array(await r.arrayBuffer()); } catch (e) {} }
    return null;
  }
};

/* ---------- pdf.js loader ---------- */
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
let pdfjsReady;
const loadPdfjs = () => pdfjsReady ||= new Promise((res, rej) => { const s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js'; s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; res(window.pdfjsLib); }; s.onerror = () => { pdfjsReady = null; rej(new Error('pdf.js failed to load')); }; document.head.append(s); });
/* disableFontFace draws glyphs itself — fixes PDFs whose embedded fonts the browser rejects (blank pages that still copy text) */
const openDoc = async data => (await loadPdfjs()).getDocument({ data, disableFontFace: true, useSystemFonts: false, standardFontDataUrl: PDFJS + 'standard_fonts/', cMapUrl: PDFJS + 'cmaps/', cMapPacked: true }).promise;

/* ---------- Turn any uploaded PDF into practice ---------- */
const VAL_RE = /(\d+(?:\.\d+)?\s?%|₹\s?[\d,.]+\s?(?:lakhs?|crores?|cr\b)?|\bUSD\s?[\d,.]+\s?(?:million|billion)?|\b\d+\s?(?:working\s|trading\s)?(?:days?|months?|years?|hours?)\b|\b(?:one|two|three|four|five|seven|ten|fifteen|thirty|sixty|ninety)\s(?:days|months|years)\b|\b(?:one-third|two-third|three-fourth|one-tenth)\b|\bForm\s+(?:No\.\s?)?[A-Z]{2,5}[-\s]?\d+[A-Z]?\b|\b(?:Section|Sec\.?)\s+\d+[A-Z]?(?:\(\d+\))?)/i;
const Ingest = {
  async lines(pdf, prog) {
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const tc = await (await pdf.getPage(i)).getTextContent(); const rows = [];
      tc.items.forEach(it => { if (!it.str || !it.str.trim()) return; const x = it.transform[4], y = it.transform[5]; let r = rows.find(r => Math.abs(r.y - y) <= 3); if (!r) rows.push(r = { y, its: [] }); r.its.push({ x, s: it.str, w: it.width || 0 }); });
      rows.sort((a, b) => b.y - a.y);
      pages.push(rows.map(r => { r.its.sort((a, b) => a.x - b.x); let out = '', end = null; r.its.forEach(t => { if (end != null) { const g = t.x - end; out += g > 18 ? '   ' : (g > 1.5 && !out.endsWith(' ') && !t.s.startsWith(' ') ? ' ' : ''); } out += t.s; end = t.x + t.w; }); return out.replace(/\s+$/, ''); }));
      prog && prog(i, pdf.numPages); if (i % 5 === 0) await new Promise(r => setTimeout(r));
    }
    return pages;
  },
  topics(pages) {
    const tp = []; const HD = /^\s*((?:Concept|Chapter|Unit|Module|Part|Lesson|Topic)\s+[\dIVX]+\b.{0,90})$/i;
    pages.forEach((ls, pi) => ls.forEach(l => { const s = l.trim(); if (HD.test(s) && (!tp.length || tp[tp.length - 1].t !== s)) tp.push({ n: tp.length + 1, t: s.replace(/\s{2,}/g, ' ').slice(0, 90), p: pi + 1 }); }));
    if (tp.length < 2) { tp.length = 0; for (let p = 1; p <= pages.length; p += 10) tp.push({ n: tp.length + 1, t: `Pages ${p}–${Math.min(pages.length, p + 9)}`, p }); }
    tp.forEach((t, i) => t.pe = (tp[i + 1] ? tp[i + 1].p : pages.length)); return tp;
  },
  cnAt(tp, p) { let n = tp[0].n; tp.forEach(t => { if (t.p <= p) n = t.n; }); return n; },
  mcqs(pages, tp) {
    const blocks = []; let cur = null, q = null, mode = 'q', last = 0; const out = [];
    const newBlock = () => { cur = { qs: [] }; blocks.push(cur); }; newBlock();
    pages.forEach((ls, pi) => ls.forEach(raw => {
      const s = raw.trim(); if (!s) return;
      if (/^(answers?|answer key|key)\s*:?\s*$/i.test(s)) { mode = 'a'; return; }
      if (mode === 'a') { const pairs = [...s.matchAll(/\b(\d{1,3})\s*[.):-]?\s*\(?([A-Da-d])\)?(?=\s|$)/g)]; if (pairs.length) { pairs.forEach(m => { const it = cur.qs.find(x => x.n === +m[1]); if (it && !it.a) it.a = m[2].toUpperCase(); }); return; } mode = 'q'; }
      const qm = s.match(/^(?:Q\.?\s*)?(\d{1,3})[.)]\s+(.{6,})$/); const om = /^\(?[A-Da-d][.)]\s+/.test(s);
      if (qm && !om) { const n = +qm[1]; if (n <= last && n === 1) newBlock(); last = n; q = { n, q: qm[2].trim(), o: {}, p: pi + 1 }; cur.qs.push(q); return; }
      const am = s.match(/^(?:ans(?:wer)?|correct answer)\s*[:.\-]?\s*\(?([A-Da-d])\)?\b/i); if (am && q) { q.a = am[1].toUpperCase(); return; }
      if (om && q) { s.split(/\s{3,}(?=\(?[A-Da-d][.)]\s)/).forEach(part => { const m = part.trim().match(/^\(?([A-Da-d])[.)]\s+(.*)$/); if (m) { q.o[m[1].toUpperCase()] = m[2].trim(); q._l = m[1].toUpperCase(); } }); return; }
      if (q && mode === 'q') { if (Object.keys(q.o).length) { if (q._l && s.length < 160) q.o[q._l] += ' ' + s; } else if (q.q.length < 600) q.q += ' ' + s; }
    }));
    blocks.forEach(b => b.qs.forEach(x => { if (x.a && Object.keys(x.o).length >= 2 && x.o[x.a]) out.push(x); }));
    return out;
  },
  qas(pages) {
    const out = []; let cur = null, part = 'q';
    pages.forEach((ls, pi) => ls.forEach(raw => { const s = raw.trim(); if (!s) return;
      const qm = s.match(/^(?:Question|Q\.)\s*(\d{1,3})\b[.:)]?\s*(.*)$/i); if (qm) { cur = { n: +qm[1], q: qm[2] ? [qm[2]] : [], a: [], p: pi + 1 }; out.push(cur); part = 'q'; return; }
      if (cur && /^(Answer|Ans\.?|Solution)\s*[:.\-]?\s*$/i.test(s)) { part = 'a'; return; }
      const am = cur && s.match(/^(?:Answer|Ans\.?)\s*[:.\-]\s*(.+)$/i); if (am) { part = 'a'; cur.a.push(am[1]); return; }
      if (cur) cur[part].push(s.replace(/\s{3,}/g, ' · ')); }));
    return out.filter(x => x.q.join(' ').length > 20 && x.a.join(' ').length > 40).map(x => ({ ...x, q: Ingest.paras(x.q), a: Ingest.paras(x.a) }));
  },
  paras(ls) { const res = []; let buf = ''; ls.forEach(s => { if (buf && (/^(\(?[a-z]{1,4}\)|\(?[ivx]+\)|\d+\)|•|[a-z]\.)\s/.test(s) || /[:.]$/.test(buf) && buf.length > 120)) { res.push(buf); buf = s; } else buf = buf ? buf + ' ' + s : s; }); if (buf) res.push(buf); return res; },
  cloze(pages) {
    const out = [], seen = new Set();
    pages.forEach((ls, pi) => { const text = ls.join(' ').replace(/\s+/g, ' '); text.split(/(?<=[.;])\s+(?=[A-Z(])/).forEach(sen => { if (out.length >= 400 || sen.length < 40 || sen.length > 280) return; const m = sen.match(VAL_RE); if (!m) return; const key = sen.slice(0, 80); if (seen.has(key)) return; seen.add(key); out.push({ full: sen, a: m[0].trim(), q: sen.slice(0, m.index) + '_____' + sen.slice(m.index + m[0].length), p: pi + 1 }); }); });
    return out;
  },
  async run(id, name, onProg) {
    const data = await PDFStore.data(id); const pdf = await openDoc(data);
    const pages = await this.lines(pdf, (i, n) => onProg(i, n));
    const tp = this.topics(pages); const items = [];
    this.mcqs(pages, tp).forEach((x, i) => items.push({ id: `X-${id}-${i}`, k: 'mcq', ch: id, cn: this.cnAt(tp, x.p), q: x.q, o: x.o, a: x.a, src: { f: id, p: x.p }, r: { t: '', p: x.p, c: this.cnAt(tp, x.p), strong: false }, m: 2, tags: ['From your PDF'], sc: /\b(Ltd|Limited|Mr\.|Mrs\.)/.test(x.q) }));
    this.qas(pages).forEach((x, i) => items.push({ id: `W-${id}-${i}`, k: 'desc', ch: id, cn: this.cnAt(tp, x.p), q: x.q, ans: x.a, src: { f: id, p: x.p }, m: 7, tags: ['From your PDF'], sc: /\b(Ltd|Limited|Mr\.|Mrs\.)/.test(x.q.join(' ')) }));
    this.cloze(pages).forEach((x, i) => items.push({ id: `Z-${id}-${i}`, k: 'cloze', ch: id, cn: this.cnAt(tp, x.p), q: x.q, a: x.a, full: x.full, src: { f: id, p: x.p }, m: 1, tags: ['From your PDF'], sc: false }));
    const deck = { id, name, pages: pages.length, topics: tp, items, at: Date.now() };
    await PDFStore.put('deck/' + id, JSON.stringify(deck), 'meta'); registerDeck(deck); return deck;
  }
};
function registerDeck(d) {
  if (CH[d.id]) { B.chapters = B.chapters.filter(c => c.id !== d.id); for (let i = ITEMS.length - 1; i >= 0; i--) if (ITEMS[i].ch === d.id) { delete BYID[ITEMS[i].id]; ITEMS.splice(i, 1); } }
  const c = { id: d.id, name: d.name, group: 'My PDFs', p: 1, pe: d.pages, concepts: d.topics }; CH[d.id] = c; B.chapters.push(c);
  d.items.forEach(it => { ITEMS.push(it); BYID[it.id] = it; });
}
let decksReady = (async () => { for (const u of (S.userPdfs || [])) { try { const raw = await PDFStore.get('deck/' + u.id, 'meta'); if (raw) registerDeck(JSON.parse(raw)); } catch (e) {} } })();
async function ingestUI(u) {
  const b = openModal('Reading your PDF', `<p style="margin-top:0">Turning <b>${esc(u.name)}</b> into practice — MCQs with answer keys, question-and-answer pairs, and key values to recall.</p><div class="bar" style="height:10px"><i id="ingb" style="width:0;background:var(--blue)"></i></div><p class="foot" id="ingt">Starting…</p>`);
  try {
    const d = await Ingest.run(u.id, u.name, (i, n) => { const bi = $('#ingb'); if (bi) bi.style.width = (i / n * 100) + '%'; const t = $('#ingt'); if (t) t.textContent = `Reading page ${i} of ${n}`; });
    const c = { mcq: 0, desc: 0, cloze: 0 }; d.items.forEach(i => c[i.k]++); Object.assign(u, { n: d.items.length, c }); save();
    b.innerHTML = `<div class="stat3" style="margin-top:0"><div><b>${c.mcq}</b><span>MCQs</span></div><div><b>${c.desc}</b><span>written Q&A</span></div><div><b>${c.cloze}</b><span>key values</span></div></div><p class="foot">${d.topics.length} topics found. ${c.mcq ? 'MCQs need an answer key in the PDF (an “Answers” table or “Ans: B”) — questions without one were left out.' : 'No MCQs with answer keys were found, so you get key-value recall and any Q&A pairs.'} Everything links back to its page.</p>`;
    const go = h(`<button class="btn primary block" style="margin-top:14px">${I.play}<span>Practise this PDF</span></button>`); go.onclick = () => { closeModal(); Session.start(buildQueue({ sel: { [u.id]: true }, fmt: 'mix', count: 15 }), u.name); }; b.append(go);
    if (!d.items.length) b.innerHTML = `<div class="empty">${I.doc}<div>This PDF has no selectable text (it may be a scan), so practice can’t be built from it. It still opens in the viewer.</div></div>`;
  } catch (e) { b.innerHTML = `<div class="empty">${I.warn}<div>Couldn’t read this PDF (${esc(e.message || 'error')}). It may be password-protected or damaged.</div></div>`; }
}

/* ---------- PDF viewer: continuous scroll, lazy pages, notes for this page ---------- */
const docCache = {};
let noteIndex = null;
function buildNoteIndex() {
  const idx = {}; const add = (f, p, n) => { const k = f + ':' + p; (idx[k] ||= []); if (!idx[k].some(x => x.text === n.text)) idx[k].push(n); };
  ITEMS.forEach(it => { const ns = [].concat(it.note ? [it.note] : [], it.notes || []); if (it.orig) ns.push({ kind: 'update', text: 'Corrected in the app — ' + (it.note?.text || 'see question'), links: [] }); ns.forEach(n => { const pe = it.src.pe || it.src.p; for (let p = it.src.p; p <= pe; p++) add(it.src.f, p, n); }); });
  (B.cnotes || []).forEach(c => { const k = CH[c.ch]?.concepts.find(x => x.n === c.cn); if (k) for (let p = k.p; p <= (k.pe || k.p); p++) add('CB', p, { kind: c.kind, text: c.text, links: [{ t: 'Check the source', u: c.u }] }); });
  B.updates.forEach(u => (u.refs || []).forEach(([f, p]) => add(f, p, { kind: 'update', text: u.title + ' (' + u.date + '): ' + u.text, links: [{ t: 'Check the source', u: u.u }] })));
  return idx;
}
function itemsOnPage(f, p) { return ITEMS.filter(it => (it.src.f === f && it.src.p <= p && p <= (it.src.pe || it.src.p)) || (f === 'CB' && it.r && it.r.strong && it.r.p === p)); }
const Viewer = {
  el: $('#viewer'), pdf: null, key: null, page: 1, zoom: 1, q: '', fit: null,
  async open(k, page, opts = {}) {
    const f = PDFStore.meta(k); if (!f) return toast('That PDF is no longer on this device');
    this.key = k; this.page = page || S.lastPage?.[k] || 1; this.q = opts.q || ''; this.flash = opts.flash || ''; this.zoom = 1; this.pdf = null; this.texts = {}; this.fit = this.fit || (innerWidth > innerHeight && innerWidth >= 900 ? 'page' : 'width');
    this.el.innerHTML = `<div class="sheet-top"><button class="iconbtn" id="vx" aria-label="Close PDF">${I.close}</button><div class="ttl">${esc(f.name)}<small id="vsub">${esc(f.file)}</small></div><button class="iconbtn" id="vnb" aria-label="Notes for this page" style="position:relative">${I.info.replace('width="16" height="16"', 'width="20" height="20"')}<i class="dot hidden" id="vnd"></i></button><button class="iconbtn" id="vext" aria-label="Open in a new tab">${I.ext}</button></div>
      <div class="pdfbar"><button class="iconbtn" id="vp" aria-label="Previous page">${I.prev}</button><input type="number" id="vpg" min="1" value="${this.page}" aria-label="Page number" inputmode="numeric"><span id="vtot" class="vtot">/ …</span><button class="iconbtn" id="vn" aria-label="Next page">${I.next}</button>
      <span class="vsep"></span><button class="iconbtn" id="vzo" aria-label="Zoom out">${I.minus}</button><button class="iconbtn" id="vzi" aria-label="Zoom in">${I.plus}</button><button class="iconbtn" id="vfit" aria-label="Fit page or width">${this.fit === 'page' ? I.fitw : I.fitp}</button>
      <div class="vsearch">${I.search}<input type="search" id="vq" placeholder="Search this PDF" value="${esc(this.q)}" aria-label="Search this PDF" enterkeyhint="search"></div></div>
      <div class="list pdfres hidden" id="vres"></div><div class="vwrap"><div class="pdfstage" id="vstage"><div class="spinner" aria-label="Loading"></div></div><aside class="vnotes hidden" id="vnotes" aria-label="Notes for this page"></aside></div>`;
    this.el.classList.add('open'); document.body.style.overflow = 'hidden';
    $('#vx').onclick = () => this.close(); $('#vp').onclick = () => this.go(this.page - 1); $('#vn').onclick = () => this.go(this.page + 1);
    $('#vpg').onchange = e => this.go(+e.target.value);
    $('#vzi').onclick = () => this.setZoom(this.zoom + .25); $('#vzo').onclick = () => this.setZoom(this.zoom - .25);
    $('#vfit').onclick = () => { this.fit = this.fit === 'page' ? 'width' : 'page'; $('#vfit').innerHTML = this.fit === 'page' ? I.fitw : I.fitp; this.zoom = 1; this.layout(); toast(this.fit === 'page' ? 'Whole page' : 'Fit width'); };
    $('#vq').onkeydown = e => { if (e.key === 'Enter') { e.target.blur(); this.search(e.target.value.trim()); } };
    $('#vq').oninput = e => { if (!e.target.value) this.search(''); };
    $('#vnb').onclick = () => { S.notesHideUntil = 0; save(); this.notes(true); };
    $('#vext').onclick = async () => { const d = await PDFStore.data(k); if (!d) return toast('Add this PDF first'); window.open(URL.createObjectURL(new Blob([d], { type: 'application/pdf' })) + '#page=' + this.page, '_blank'); };
    try {
      if (!docCache[k]) { const data = await PDFStore.data(k); if (!data) return this.attachUI(); docCache[k] = await openDoc(data); }
      this.pdf = docCache[k]; $('#vtot').textContent = '/ ' + this.pdf.numPages; this.page = Math.min(this.page, this.pdf.numPages);
      const p1 = await this.pdf.getPage(Math.min(this.page, this.pdf.numPages)); const v = p1.getViewport({ scale: 1 }); this.base = { w: v.width, h: v.height };
      this.layout(); if (this.q) this.search(this.q);
    } catch (e) { $('#vstage').innerHTML = `<div class="empty">Couldn’t open the PDF. The viewer loads once from cdnjs, then works offline.<br><br><button class="btn tinted" id="vret">${I.retry}<span>Try again</span></button></div>`; $('#vret').onclick = () => this.open(k, page, opts); }
  },
  scale() { const st = $('#vstage'); const W = st.clientWidth - 28, H = st.clientHeight - 28; const fw = W / this.base.w, fp = Math.min(fw, H / this.base.h); return Math.max(.3, (this.fit === 'page' ? fp : Math.min(fw, 2)) * this.zoom); },
  setZoom(z) { this.zoom = Math.max(.5, Math.min(3, z)); this.layout(); },
  layout() {
    const st = $('#vstage'); if (!st || !this.pdf) return; this.io?.disconnect(); const sc = this.sc = this.scale(); const keep = this.page;
    st.innerHTML = ''; this.slots = [];
    for (let i = 1; i <= this.pdf.numPages; i++) { const d = h(`<div class="pdfpage" data-p="${i}" style="width:${this.base.w * sc}px;height:${this.base.h * sc}px"><span class="pnum">${i}</span></div>`); st.append(d); this.slots.push(d); }
    this.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) this.draw(+e.target.dataset.p); }), { root: st, rootMargin: '700px 0px' });
    this.slots.forEach(s => this.io.observe(s));
    st.onscroll = () => { clearTimeout(this._st); this._st = setTimeout(() => this.track(), 90); };
    let sx = 0, sy = 0; st.ontouchstart = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }; st.ontouchend = e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (this.fit === 'page' && this.zoom <= 1 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) this.go(this.page + (dx < 0 ? 1 : -1)); };
    st.onwheel = e => { if (e.ctrlKey) { e.preventDefault(); this.setZoom(this.zoom * (e.deltaY < 0 ? 1.1 : .9)); } };
    this.page = 0; this.go(keep, true);
  },
  track() { const st = $('#vstage'); if (!st || !this.slots) return; const y = st.scrollTop + st.clientHeight * .3; let p = 1; for (const s of this.slots) { if (s.offsetTop <= y) p = +s.dataset.p; else break; } if (p !== this.page) { this.page = p; $('#vpg').value = p; (S.lastPage ||= {})[this.key] = p; S.lastRead = { key: this.key, page: p, at: Date.now() }; save(); this.notes(); } },
  go(n, instant) { if (!this.pdf) return; n = Math.max(1, Math.min(this.pdf.numPages, n || 1)); const s = this.slots[n - 1]; const st = $('#vstage'); st.scrollTo({ top: s.offsetTop - 12, behavior: instant ? 'auto' : 'smooth' }); this.page = n; $('#vpg').value = n; (S.lastPage ||= {})[this.key] = n; S.lastRead = { key: this.key, page: n, at: Date.now() }; save(); this.draw(n); this.notes(); },
  draw(n) {
    const slot = this.slots?.[n - 1]; const sc = this.sc; if (!slot || slot._sc === sc) return; slot._sc = sc;
    this.chain = (this.chain || Promise.resolve()).then(async () => {
      if (slot._sc !== sc || !slot.isConnected) return;
      const page = await this.pdf.getPage(n); const css = page.getViewport({ scale: sc }); const dpr = Math.min(devicePixelRatio || 1, 2); const vp = page.getViewport({ scale: sc * dpr });
      slot.style.width = css.width + 'px'; slot.style.height = css.height + 'px';
      const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height; cv.style.width = css.width + 'px'; cv.style.height = css.height + 'px';
      await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise; if (slot._sc !== sc) return;
      const tl = h('<div class="textLayer"></div>'); tl.style.setProperty('--scale-factor', sc);
      slot.querySelectorAll('canvas,.textLayer').forEach(x => x.remove()); slot.append(cv, tl); slot.classList.add('drawn');
      try { const tc = await page.getTextContent(); await window.pdfjsLib.renderTextLayer({ textContentSource: tc, container: tl, viewport: css, textDivs: [] }).promise; this.marks(n, tl); } catch (e) {}
      this.prune(n);
    }).catch(() => {});
  },
  prune() { const drawn = this.slots.filter(s => s.classList.contains('drawn')); if (drawn.length <= 14) return; drawn.sort((a, b) => Math.abs(+b.dataset.p - this.page) - Math.abs(+a.dataset.p - this.page)).slice(0, drawn.length - 14).forEach(s => { s.querySelectorAll('canvas,.textLayer').forEach(x => x.remove()); s.classList.remove('drawn'); s._sc = null; }); },
  marks(n, tl) {
    const norm = s => s.toLowerCase().replace(/[^a-z0-9₹%]+/g, ' ').trim();
    if (this.q) { const ql = this.q.toLowerCase(); $$('span', tl).forEach(s => { if (s.textContent.toLowerCase().includes(ql)) s.classList.add('hit'); }); }
    if (this.flash && n === this.page) {
      const tgt = norm(this.flash); let first = null;
      $$('span', tl).forEach(s => { const t = norm(s.textContent); if (t.length >= 8 && (tgt.includes(t) || (t.length > 30 && t.includes(tgt.slice(0, 30))))) { s.classList.add('flash'); first ||= s; } });
      if (first) { const st = $('#vstage'); setTimeout(() => st.scrollTo({ top: this.slots[n - 1].offsetTop + first.offsetTop - st.clientHeight * .3, behavior: 'smooth' }), 120); }
      this.flash = ''; setTimeout(() => $$('.flash', tl).forEach(s => s.classList.remove('flash')), 4200);
    }
  },
  notes(force) {
    const box = $('#vnotes'); if (!box) return; noteIndex ||= buildNoteIndex();
    const list = noteIndex[this.key + ':' + this.page] || []; const qs = itemsOnPage(this.key, this.page);
    const dot = $('#vnd'); dot && dot.classList.toggle('hidden', !list.length);
    const hidden = !force && (S.notesHideUntil || 0) > Date.now();
    if ((!list.length && !qs.length) || hidden) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden'); box.innerHTML = `<div class="vn-h"><b>Page ${this.page}</b><span>${list.length ? list.length + ' update' + (list.length > 1 ? 's' : '') : 'No corrections'}</span><button class="chip" id="vnh">Hide 30 min</button><button class="iconbtn" id="vnc" aria-label="Close notes">${I.close}</button></div>`;
    list.forEach(n => box.append(noteCard(n)));
    if (qs.length) { const b = h(`<button class="btn tinted block" style="margin-top:12px">${I.play}<span>Practise ${qs.length} question${qs.length > 1 ? 's' : ''} from this page</span></button>`); b.onclick = () => { this.close(); Session.start(buildQueue({ ids: qs.map(x => x.id), count: 30 }), 'Page ' + this.page); }; box.append(b); }
    $('#vnh', box).onclick = () => { S.notesHideUntil = Date.now() + 30 * 60e3; save(); box.classList.add('hidden'); toast('Notes hidden for 30 minutes — tap ⓘ to show'); };
    $('#vnc', box).onclick = () => box.classList.add('hidden');
  },
  attachUI() {
    const f = PDFStore.meta(this.key); const st = $('#vstage');
    st.innerHTML = `<div class="card" style="max-width:520px;width:100%;margin:auto"><div class="dropzone">${I.upload.replace('<svg', '<svg width="44" height="44"')}<p style="margin:8px 0 4px;color:var(--label);font-weight:600">Add “${esc(f.file)}”</p><p style="margin:0 0 14px;font-size:14px">Choose the PDF from your device once. It stays private in this browser and opens instantly next time.</p><label class="btn primary">Choose PDF<input type="file" accept="application/pdf" class="sr" id="vfile"></label></div></div>`;
    $('#vfile').onchange = async e => { const file = e.target.files[0]; if (!file) return; if (B.files[this.key]) await PDFStore.put(B.files[this.key].file, file); else await PDFStore.put('user/' + this.key, file); toast('PDF added'); this.open(this.key, this.page); };
  },
  close() { this.io?.disconnect(); this.el.classList.remove('open'); if (!Session.el.classList.contains('open')) { document.body.style.overflow = ''; if ((location.hash || '#today').startsWith('#study')) route(); } },
  async search(q) {
    this.q = q; const res = $('#vres'); $$('.hit', $('#vstage')).forEach(s => s.classList.remove('hit'));
    if (!q) { res.classList.add('hidden'); return; }
    res.classList.remove('hidden'); res.innerHTML = '<div class="row plain"><div class="tx t2">Searching…</div></div>'; const hits = []; const ql = q.toLowerCase();
    for (let i = 1; i <= this.pdf.numPages && hits.length < 60; i++) { if (!this.texts[i]) { const p = await this.pdf.getPage(i); this.texts[i] = (await p.getTextContent()).items.map(x => x.str).join(' '); } const t = this.texts[i]; const at = t.toLowerCase().indexOf(ql); if (at >= 0) hits.push([i, t.slice(Math.max(0, at - 50), at + q.length + 70)]); }
    res.innerHTML = `<div class="row plain"><div class="tx t2">${hits.length ? hits.length + ' page' + (hits.length > 1 ? 's' : '') + ' match “' + esc(q) + '”' : 'No matches'}</div><button class="chip blue" id="vclr">Clear</button></div>`;
    $('#vclr', res).onclick = () => { $('#vq').value = ''; this.search(''); };
    hits.forEach(([pg, sn]) => { const r = h(`<button class="row tap plain" type="button"><div class="tx"><div class="t2" style="margin:0">Page ${pg}</div><div class="t1" style="font-size:14px">…${esc(sn)}…</div></div></button>`); r.onclick = () => this.go(pg); res.append(r); });
    this.slots.forEach(s => s._sc = null); this.slots.filter(s => s.classList.contains('drawn')).forEach(s => this.draw(+s.dataset.p));
    if (hits.length) this.go(hits[0][0]);
  }
};
document.addEventListener('keydown', e => { if (!Viewer.el.classList.contains('open') || e.target.matches('input')) return; if (e.key === 'ArrowRight' || e.key === 'PageDown') Viewer.go(Viewer.page + 1); if (e.key === 'ArrowLeft' || e.key === 'PageUp') Viewer.go(Viewer.page - 1); });
addEventListener('resize', () => { clearTimeout(Viewer._rz); Viewer._rz = setTimeout(() => { if (Viewer.el.classList.contains('open') && Viewer.pdf) Viewer.layout(); }, 250); });
/* ---------- Motivation by time of day ---------- */
const GREET = {
  morning: ['Fresh mind, sharp recall — 15 minutes now beats an hour tonight.', 'Mornings are for the hard chapters. Start with one, finish strong.', 'The rank is built before breakfast. Let’s close a ring.'],
  afternoon: ['A quick round now keeps yesterday’s learning from fading.', 'Ten MCQs between tasks — that’s how toppers find time.', 'Halfway through the day; let’s get halfway through today’s rings.'],
  evening: ['Evening revision locks in what you read today.', 'One written answer tonight is one less worry in the exam hall.', 'Wind down with the questions you missed — they’re your marks waiting.'],
  night: ['Short and sharp before sleep — your brain files it overnight.', 'Five key values before bed. Tomorrow they’ll still be there.', 'Late night? Keep it light: recall, don’t cram.']
};
const slot = () => { const hr = new Date().getHours(); return hr < 5 ? 'night' : hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : hr < 22 ? 'evening' : 'night'; };
const greetLine = () => { const g = GREET[slot()]; return g[(new Date().getDate()) % g.length]; };
function splash() {
  if (sessionStorage.getItem('rr-splash') || matchMedia('(prefers-reduced-motion: reduce)').matches) return; sessionStorage.setItem('rr-splash', 1);
  const d = day(); const nm = S.settings.name;
  const el = h(`<div class="splash" role="status"><img src="icons/icon-192.png" alt=""><h1>${greeting()}${nm ? ',<br>' + esc(nm) : ''}</h1><p>${esc(greetLine())}</p>${streak() ? `<span class="streak">${I.flame} ${streak()}-day streak</span>` : ''}${d.n ? `<span class="chip blue">${d.n} answered today</span>` : ''}</div>`);
  document.body.append(el); const go = () => { el.classList.add('out'); setTimeout(() => el.remove(), 600); }; el.onclick = go; setTimeout(go, 2300);
}

/* ---------- Reminders: Google Calendar, Apple/Outlook (.ics), device notifications ---------- */
const pad = n => String(n).padStart(2, '0');
const localStamp = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';
const appURL = hash => location.href.split('#')[0] + '#' + hash;
const Remind = {
  gcal(o) { const end = new Date(o.start.getTime() + (o.mins || 25) * 60e3); const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(o.title) + '&dates=' + localStamp(o.start) + '/' + localStamp(end) + '&details=' + encodeURIComponent(o.details + '\n\nOpen: ' + o.url) + '&ctz=' + encodeURIComponent(tz) + (o.daily ? '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY') : ''); },
  ics(o) { const end = new Date(o.start.getTime() + (o.mins || 25) * 60e3); const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rank Rank//EN', 'BEGIN:VEVENT', 'UID:rankrank-' + Date.now() + '@rankrank', 'DTSTAMP:' + now, 'DTSTART:' + localStamp(o.start), 'DTEND:' + localStamp(end)].concat(o.daily ? ['RRULE:FREQ=DAILY'] : []).concat(['SUMMARY:' + o.title, 'DESCRIPTION:' + (o.details + ' Open: ' + o.url).replace(/\n/g, ' '), 'URL:' + o.url, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + o.title, 'TRIGGER:-PT5M', 'END:VALARM', 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + o.title, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR']);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' })); a.download = (o.file || 'rank-rank-reminder') + '.ics'; a.click(); },
  topics() { const agg = conceptAgg().filter(a => a.n).sort((a, b) => a.c / a.n - b.c / b.n); const weak = agg[0]; let last = null, lt = 0; Object.entries(S.stats).forEach(([id, s]) => { if (s.last > lt && BYID[id]) { lt = s.last; last = BYID[id]; } }); return { weak, last }; },
  messages() {
    const nm = S.settings.name ? S.settings.name + ', ' : ''; const { weak, last } = this.topics(); const due = ITEMS.filter(i => isDue(i.id)).length; const sk = streak();
    const t = x => x ? `${chShort(x.ch)} · ${conceptTitle(x.ch, x.cn) || CH[x.ch]?.name}` : null;
    const m = [];
    if (weak) m.push([`${nm}let’s fix ${t(weak)}`, `You’re at ${Math.round(weak.c / weak.n * 100)}% there. Ten focused minutes turns it into marks.`, '#go/' + weak.ch + '/' + weak.cn]);
    if (last) m.push([`Pick up where you left off`, `${t(last)} is still fresh — one more round makes it stick.`, '#go/' + last.ch + (last.cn ? '/' + last.cn : '')]);
    if (due) m.push([`${due} questions are due for revision`, `${nm}revising right before you forget is the fastest way to remember for good.`, '#today']);
    if (sk) m.push([`Keep your ${sk}-day streak alive 🔥`, `${nm}one short session keeps the chain going.`, '#today']);
    m.push([`${greeting()}${S.settings.name ? ', ' + S.settings.name : ''}`, greetLine(), '#today']);
    return m;
  },
  async syncMeta() { try { await PDFStore.put('state', { notify: !!S.settings.notify, remind: S.settings.remind || '', today: todayKey(), practised: day().n > 0, msgs: this.messages(), topic: (S.topicRem || []).filter(r => r.at > Date.now() - 864e5), name: S.settings.name || '' }, 'meta'); } catch (e) {} },
  async enable() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) { toast('This browser can’t show notifications — use the calendar reminder'); return false; }
    const p = await Notification.requestPermission(); if (p !== 'granted') { toast('Notifications are blocked — allow them in browser settings'); return false; }
    S.settings.notify = true; S.settings.remind ||= '07:00'; save(); await this.syncMeta();
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (reg && 'periodicSync' in reg) { try { await reg.periodicSync.register('rr-daily', { minInterval: 4 * 3600e3 }); } catch (e) {} }
    const [title, body] = this.messages()[0]; reg?.showNotification('Reminders are on', { body: 'We’ll nudge you around ' + S.settings.remind + '. ' + body, icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', tag: 'rr-on' });
    this.schedule(); return true;
  },
  schedule() {
    clearTimeout(this._t); (S.topicRem || []).forEach(() => {}); if (!S.settings.notify || Notification.permission !== 'granted') return;
    const [hh, mm] = (S.settings.remind || '07:00').split(':').map(Number); const at = new Date(); at.setHours(hh, mm, 0, 0); if (at < new Date()) at.setDate(at.getDate() + 1);
    const nextTopic = (S.topicRem || []).filter(r => r.at > Date.now()).sort((a, b) => a.at - b.at)[0];
    const fire = Math.min(at.getTime(), nextTopic ? nextTopic.at : Infinity);
    if (fire - Date.now() < 2 ** 31 - 1) this._t = setTimeout(() => this.fire(nextTopic && nextTopic.at === fire ? nextTopic : null), fire - Date.now());
  },
  async fire(topic) {
    const reg = await navigator.serviceWorker.ready.catch(() => null); if (!reg) return;
    if (topic) { reg.showNotification('Time to study: ' + topic.title, { body: 'You planned this. 25 focused minutes — let’s go.', icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', tag: 'rr-topic', data: { url: topic.url } }); S.topicRem = (S.topicRem || []).filter(r => r !== topic); save(); }
    else if (!day().n) { const ms = this.messages(); const [t, b, u] = ms[Math.random() * ms.length | 0]; reg.showNotification(t, { body: b, icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', tag: 'rr-daily', data: { url: appURL(u.slice(1)) } }); }
    this.schedule();
  },
  modal(topic) {
    const tomorrow = new Date(Date.now() + DAY); const ds = tomorrow.getFullYear() + '-' + pad(tomorrow.getMonth() + 1) + '-' + pad(tomorrow.getDate());
    const isTopic = !!topic; const title = isTopic ? 'Remind me to study' : 'Daily reminder';
    const b = openModal(title, `${isTopic ? `<div class="card" style="margin-bottom:12px"><b>${esc(topic.title)}</b><div class="t2" style="font-size:13px;color:var(--label2)">${esc(topic.sub || '')}</div></div>` : `<p style="margin-top:0;color:var(--label2);font-size:15px">Pick a time. Calendar reminders work on every phone and computer; device notifications work when the app is installed.</p>`}
      <div class="list">${isTopic ? `<label class="row plain"><div class="tx"><div class="t1">Date</div></div><input type="date" id="rd" value="${ds}" class="field"></label>` : ''}<label class="row plain"><div class="tx"><div class="t1">Time</div></div><input type="time" id="rt" value="${S.settings.remind || '07:00'}" class="field"></label></div>
      <div class="btnrow" style="margin-top:16px"><button class="btn primary" id="rg">${I.gcal}<span>Google Calendar</span></button><button class="btn gray" id="ri">${I.clock}<span>Apple / Outlook</span></button></div>
      <button class="btn tinted block" id="rn" style="margin-top:10px">${I.bell}<span>${S.settings.notify ? 'Notifications on — update time' : 'Notify me on this device'}</span></button>
      <p class="foot">${isTopic ? 'The event links straight to practice for this topic.' : 'Daily notifications pick a motivating topic — your weakest one, where you left off, or what’s due.'} iPhone shows device notifications only for apps added to the Home Screen; the calendar reminder always works.</p>`);
    const get = () => { const t = $('#rt', b).value || '07:00'; const [hh, mm] = t.split(':'); const d = isTopic ? new Date($('#rd', b).value + 'T00:00') : new Date(); d.setHours(+hh, +mm, 0, 0); if (!isTopic && d < new Date()) d.setDate(d.getDate() + 1); return { t, d }; };
    const g = S.settings.goals; const base = () => isTopic ? { title: 'Study: ' + topic.title, details: (topic.sub || '') + '\nPractise in Rank Rank — attempt, check, read, practise.', url: appURL(topic.hash), daily: false, file: 'study-' + topic.hash.replace(/\W+/g, '-') } : { title: 'Rank Rank — close your rings', details: `${g.mcq} MCQs · ${g.case} case · ${g.desc} written answers. ${greetLine()}`, url: appURL('today'), daily: true };
    $('#rg', b).onclick = () => { const { t, d } = get(); if (!isTopic) { S.settings.remind = t; save(); } window.open(Remind.gcal({ ...base(), start: d }), '_blank', 'noopener'); };
    $('#ri', b).onclick = () => { const { t, d } = get(); if (!isTopic) { S.settings.remind = t; save(); } Remind.ics({ ...base(), start: d }); toast('Open the downloaded file to add it'); };
    $('#rn', b).onclick = async () => { const { t, d } = get(); if (isTopic) { (S.topicRem ||= []).push({ at: d.getTime(), title: topic.title, url: appURL(topic.hash) }); } else S.settings.remind = t; save(); if (await Remind.enable()) { toast(isTopic ? 'We’ll notify you ' + d.toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : 'Daily nudge set for ' + t); closeModal(); } };
  }
};
function remindTopic(ch, cn) { const c = CH[ch]; const t = cn != null ? conceptTitle(ch, cn) : ''; Remind.modal({ title: (c.id.startsWith('U') ? 'Unit ' + c.id.slice(1) + ' · ' : '') + (t || c.name), sub: c.name + (cn != null && c.id in CH && B.files.CB && !c.id.startsWith('u-') ? ' · Concept Book p.' + conceptPage(ch, cn) : ''), hash: 'go/' + ch + (cn != null ? '/' + cn : '') }); }

/* ---------- Cheat sheet: key values, confused pairs, memory tricks ---------- */
const Cheat = {
  data: null,
  load() { return this._p ||= new Promise((res, rej) => { if (window.CHEAT) return res(this.data = window.CHEAT); const s = document.createElement('script'); s.src = 'data/cheat.js'; s.onload = () => { this.data = window.CHEAT; this.register(); res(this.data); }; s.onerror = () => { this._p = null; rej(); }; document.head.append(s); }); },
  register() {
    this.data.confuse.forEach((c, i) => { const id = 'K-' + i; BYID[id] = { id, k: 'desc', ch: c.ch, cn: null, q: ['Explain the difference: ' + c.t + '. Give one real-life example.'], ans: c.rows.map(r => r[0] + ' — ' + r[1]).concat(['Example: ' + c.ex]), src: { f: 'CB', p: c.p || 1 }, m: 4, tags: ['Often confused'], sc: false }; });
    this.data.values.forEach(c => c.cons.forEach(k => k.rows.forEach((r, i) => { const id = `C-${c.id}-${k.n}-${i}`; const v = r.v[0]; const at = r.t.indexOf(v); if (at < 0) return; BYID[id] = { id, k: 'cloze', ch: c.id, cn: k.n, q: r.t.slice(0, at) + '_____' + r.t.slice(at + v.length), a: v, full: r.t, src: { f: 'CB', p: r.p }, m: 1, tags: ['Concept Book'], sc: false, notes: cnoteFor(c.id, k.n) }; r.id = id; }))); },
  rowsFor(ch) { if (ch.startsWith('u-')) { return ITEMS.filter(i => i.ch === ch && i.k === 'cloze').map(i => ({ id: i.id, t: i.full, v: [i.a], p: i.src.p, cn: i.cn })); } const c = this.data.values.find(x => x.id === ch); return c ? c.cons.flatMap(k => k.rows.map(r => ({ ...r, cn: k.n }))) : []; }
};
const cnoteFor = (ch, cn) => { const r = (B.cnotes || []).filter(x => x.ch === ch && x.cn === cn).map(x => ({ kind: x.kind, text: x.text, links: [{ t: 'Check the source', u: x.u }] })); return r.length ? r : undefined; };
async function pageCheat(main) {
  const p = h(`<div class="page"><header class="navbar"><div><p class="eyebrow">Unit-wise, straight from your Concept Book</p><h1 class="largetitle">Cheat sheet</h1></div></header>
    <div class="seg" id="cmode">${[['values', 'Key values'], ['confuse', 'Often confused'], ['tricks', 'Memory tricks']].map(([k, t]) => `<button aria-pressed="${(S.settings.cmode || 'values') === k}" data-m="${k}">${t}</button>`).join('')}</div>
    <div class="chipscroll" id="cch"></div><div id="cbody"><div class="spinner"></div></div></div>`);
  main.append(p);
  try { await Cheat.load(); } catch (e) { $('#cbody', p).innerHTML = `<div class="empty">Couldn’t load the cheat sheet. Check your connection and reopen this tab.</div>`; return; }
  const chs = B.chapters.filter(c => c.group !== 'My PDFs' || ITEMS.some(i => i.ch === c.id && i.k === 'cloze'));
  let cur = S.settings.cch && CH[S.settings.cch] ? S.settings.cch : 'U1';
  const cbar = $('#cch', p);
  const drawChips = () => { cbar.innerHTML = ''; chs.forEach(c => { const b = h(`<button class="chip ${c.id === cur ? 'on' : ''}" type="button">${esc(c.id.startsWith('U') ? 'Unit ' + c.id.slice(1) : c.group === 'My PDFs' ? c.name.slice(0, 18) : chShort(c.id))}</button>`); b.onclick = () => { cur = c.id; S.settings.cch = cur; save(); drawChips(); draw(); }; cbar.append(b); }); $('.on', cbar)?.scrollIntoView({ inline: 'center', block: 'nearest' }); };
  const body = $('#cbody', p);
  const draw = () => {
    const mode = S.settings.cmode || 'values'; body.innerHTML = ''; const c = CH[cur];
    body.append(h(`<h2 class="section-h" style="margin-top:18px">${esc(chLabel(c))}</h2>`));
    if (mode === 'values') {
      const rows = Cheat.rowsFor(cur);
      if (!rows.length) { body.append(h(`<div class="card empty">No numeric values found for this chapter.</div>`)); return; }
      const acts = h(`<div class="btnrow" style="margin-bottom:14px"><button class="btn primary">${I.play}<span>Practise ${Math.min(rows.length, 20)} values</span></button><button class="btn gray">${I.bell}<span>Remind me</span></button></div>`);
      acts.children[0].onclick = () => Session.start(shuffle(rows.filter(r => r.id).map(r => ({ id: r.id, mode: 'mcq' }))).slice(0, 20), 'Key values · ' + chShort(cur));
      acts.children[1].onclick = () => remindTopic(cur); body.append(acts);
      const byCn = {}; rows.forEach(r => (byCn[r.cn] ||= []).push(r));
      Object.entries(byCn).forEach(([cn, rs]) => {
        const g = h(`<div class="vgroup"><div class="vg-h"><b>${esc(conceptTitle(cur, +cn) || 'Topic ' + cn)}</b><button class="chip" type="button">p.${rs[0].p}</button></div></div>`);
        $('.chip', g).onclick = () => Viewer.open(cur.startsWith('u-') ? cur : 'CB', rs[0].p);
        (cnoteFor(cur, +cn) || []).forEach(n => g.append(noteCard(n)));
        rs.forEach(r => { const row = h(`<div class="vrow"><div class="vv">${r.v.map(v => `<span class="vchip">${esc(v)}</span>`).join('')}</div></div>`); const t = richParas([r.t], 'cheat-' + cur + '-' + r.p); t.classList.add('vt'); row.append(t);
          const tools = h(`<div class="vtools"><button class="chip" type="button">${I.doc.replace('<svg', '<svg width="12" height="12"')} p.${r.p}</button><button class="chip" type="button" aria-label="Copy">${I.copy.replace('<svg', '<svg width="12" height="12"')} Copy</button></div>`);
          tools.children[0].onclick = () => Viewer.open(cur.startsWith('u-') ? cur : 'CB', r.p, { flash: r.t }); tools.children[1].onclick = () => navigator.clipboard?.writeText(r.t + ' (p.' + r.p + ')').then(() => toast('Copied'));
          row.append(tools); g.append(row); });
        body.append(g);
      });
    }
    if (mode === 'confuse') {
      const list = Cheat.data.confuse.filter(x => x.ch === cur);
      if (!list.length) { body.append(h(`<div class="card empty">No “often confused” pairs for this chapter yet — try Unit 1, 2, 4, 5, 8, 10, 11, IBC, Banking, FEMA, Insurance, Competition, SEBI or PMLA.</div>`)); }
      list.forEach((x, i) => { const card = h(`<div class="card confuse"><h3>${esc(x.t)}</h3><div class="cgrid">${x.rows.map(r => `<div class="ccell"><b>${esc(r[0])}</b><p>${esc(r[1])}</p></div>`).join('')}</div><div class="cex"><b>${I.bulb.replace('<svg', '<svg width="14" height="14" style="vertical-align:-2px"')} Real-life example</b><p>${esc(x.ex)}</p></div><div class="chips" style="margin-top:10px"></div></div>`);
        if (x.p) { const b = h(`<button class="chip blue" type="button">${I.doc.replace('<svg', '<svg width="12" height="12"')} Concept Book p.${x.p}</button>`); b.onclick = () => Viewer.open('CB', x.p); $('.chips', card).append(b); } else $('.chips', card).append(h(`<span class="chip">From the Act — not detailed in your book</span>`));
        const qz = h(`<button class="chip purple" type="button">Quiz me</button>`); qz.onclick = () => quizPair(x); $('.chips', card).append(qz); body.append(card); });
      const all = Cheat.data.confuse; const qa = h(`<button class="btn tinted block" style="margin-top:14px">${I.play}<span>Quiz me on all ${all.length} confused pairs</span></button>`); qa.onclick = () => quizPair(null); body.append(qa);
    }
    if (mode === 'tricks') {
      const list = B.tricks.filter(t => t.ch === cur);
      if (!list.length) body.append(h(`<div class="card empty">No memory tricks for this chapter yet.</div>`));
      list.forEach(t => body.append(h(`<div class="trick" style="margin-top:12px"><b>${I.bulb.replace('<svg', '<svg width="15" height="15" style="vertical-align:-2px"')} ${esc(t.t)}</b><p>${esc(t.x)}</p></div>`)));
      body.append(h(`<p class="foot">Mnemonics are study aids written for this app (marked AI); the figures inside them come from your material and the updates list.</p>`));
    }
  };
  $$('#cmode button', p).forEach(b => b.onclick = () => { S.settings.cmode = b.dataset.m; save(); $$('#cmode button', p).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  drawChips(); draw();
}
function quizPair(x) {
  const list = x ? [x] : shuffle(Cheat.data.confuse.slice());
  const ids = list.map(c => ({ id: 'K-' + Cheat.data.confuse.indexOf(c), mode: 'desc' }));
  Session.start(ids, x ? 'Often confused' : 'All confused pairs');
}
/* ---------- Welcome & boot ---------- */
function welcome() {
  if (S.welcomed) return;
  const row = (c, ic, t, s) => `<div class="row plain"><span style="color:var(--${c})">${ic.replace('<svg', '<svg width="26" height="26"')}</span><div class="tx"><div class="t1">${t}</div><div class="t2">${s}</div></div></div>`;
  const b = openModal('Welcome to Rank Rank', `<p style="font-size:17px;margin-top:0">Daily practice for CMA Final Law (Paper 13), built from your study material — so what you remember is exactly what the exam asks.</p>
   <div class="list" style="margin-bottom:14px"><label class="row plain"><div class="tx"><div class="t1">What should we call you?</div></div><input id="wn" class="field" placeholder="Your name" autocomplete="given-name" style="width:45%"></label></div>
   <div class="list">${row('pink', I.today, 'Close three rings a day', 'MCQs, case-based and written answers')}${row('blue', I.clock, 'Exam timing on every card', 'Answer → check → read → practise')}${row('purple', I.cheat, 'Cheat sheet by unit', 'Key values, confused pairs, memory tricks')}${row('red', I.warn, 'Errors and law changes fixed', 'Book version kept, with links to verify')}${row('green', I.medal, 'Streaks, awards and reminders', 'Calendar and device notifications')}</div>`);
  const go = h(`<button class="btn primary block" style="margin-top:16px">Pick the topics I’ve studied</button>`);
  go.onclick = () => { S.settings.name = ($('#wn', b).value || '').trim().slice(0, 24); S.welcomed = 1; save(); closeModal(); location.hash = '#practice'; toast(S.settings.name ? 'Welcome, ' + S.settings.name + '!' : 'Welcome!'); };
  b.append(go); $('#wn', b).onkeydown = e => { if (e.key === 'Enter') go.click(); };
}
async function deepLink() {
  const parts = location.hash.slice(1).split('/'); if (parts[0] !== 'go') return false;
  await decksReady; const ch = parts[1], cn = parts[2] != null && parts[2] !== '' ? +parts[2] : null; history.replaceState(null, '', '#today'); route();
  if (!CH[ch]) { toast('That topic isn’t available on this device'); return true; }
  const sel = { [ch]: cn == null ? true : [cn] }; const q = buildQueue({ sel, fmt: 'mix', count: 12 });
  Session.start(q.length ? q : buildQueue({ sel: { [ch]: true }, fmt: 'mix', count: 12 }), cn != null ? conceptTitle(ch, cn) || CH[ch].name : CH[ch].name); return true;
}
addEventListener('hashchange', () => { if (location.hash.startsWith('#go/')) deepLink(); });
(async () => {
  if (!(await deepLink())) route();
  splash(); setTimeout(welcome, 2500);
  decksReady.then(() => { if ((S.userPdfs || []).length && /^#(practice|study|cheat)/.test(location.hash)) route(); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) { navigator.serviceWorker.register('sw.js').catch(() => {}); navigator.serviceWorker.addEventListener?.('message', e => { if (e.data?.url) location.href = e.data.url; }); }
  Remind.schedule(); Remind.syncMeta();
  window.__rr = { Session, Viewer, Cheat, BYID };
  document.addEventListener('visibilitychange', () => { if (document.hidden) Remind.syncMeta(); });
})();
})();
