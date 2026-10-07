/* Zeus Tools · Arc Top 10 widget (MIT): the Arc Top 10 by real buyers, as @ZeusTrending ranks it, in <div data-zeus-top10></div>.
   Read-only: one GET of /api/top10 a minute, no cookies, values set as text. Options on the div: data-theme="dark"|"light",
   data-link="dex" (rows open DexScreener), data-api (another URL), data-ref (a /referral code: the footer opens Zeus with it). */
(function () {
  'use strict';
  var d = document, R = Math.round, SITE = 'https://zeustools.app', API = SITE + '/api/top10';
  var DARK = '--bg:#0b1834;--fg:#eef4ff;--mu:#8fa1c6;--ln:rgba(110,160,255,.2);--ac:#74b6ff;--dn:#ff8f8f;--rk:rgba(61,142,230,.2)';
  var CSS = '.zt10{--bg:#fff;--fg:#0b1834;--mu:#56658a;--ln:#dfe6f3;--ac:#1f63b8;--dn:#c62f2f;--rk:#e8f1fc;--au:#e8b04a;' +
    'container-type:inline-size;box-sizing:border-box;padding:12px 14px 10px;border:1px solid var(--ln);border-radius:14px;' +
    'background:var(--bg);color:var(--fg);font:14px/1.35 system-ui,sans-serif;text-align:left}' +
    '.zt10 *{box-sizing:border-box;margin:0}' +
    '@media (prefers-color-scheme:dark){.zt10:not(.zt10-light){' + DARK + '}}.zt10.zt10-dark{' + DARK + '}' +
    '.zt10-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:0 0 8px 9px;border-left:3px solid var(--au)}' +
    '.zt10-ti{font-weight:800;font-size:15px}.zt10-su{color:var(--mu);font-size:12px;white-space:nowrap}' +
    '.zt10-l{list-style:none;padding:0}.zt10-l li+li{border-top:1px solid var(--ln)}' +
    '.zt10-r{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:1px 10px;align-items:center;padding:7px 2px;color:inherit;text-decoration:none}' +
    'a.zt10-r:hover .zt10-s{color:var(--ac)}a.zt10-r:focus-visible{outline:2px solid var(--ac);border-radius:8px}' +
    '.zt10-n{grid-row:span 2;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--rk);color:var(--ac);font-weight:700;font-size:12px}' +
    '.zt10-t .zt10-n{background:var(--au);color:#050b1a}' +
    '.zt10-s,.zt10-m,.zt10-x{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.zt10-s{font-weight:700}' +
    '.zt10-g{margin-left:6px;padding:0 5px;border:1px solid var(--au);border-radius:6px;font-size:10px;vertical-align:1px}' +
    '.zt10-p,.zt10-x{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}.zt10-u{color:var(--ac)}.zt10-d{color:var(--dn)}' +
    '.zt10-m,.zt10-x{color:var(--mu);font-size:12px}.zt10-e{padding:16px 2px;color:var(--mu);text-align:center}' +
    '.zt10-f{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 8px;margin-top:4px;padding-top:8px;border-top:1px solid var(--ln);color:var(--mu);font-size:12px}' +
    '.zt10-f a{color:var(--ac);font-weight:600;text-decoration:none}' +
    '@container (max-width:300px){.zt10-m,.zt10-x,.zt10-su{display:none}.zt10-n{grid-row:auto}}';

  function el(tag, cls, text) { var e = d.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function num(x) { return typeof x === 'number' && isFinite(x); }
  function link(a, href) { a.href = href; a.target = '_blank'; a.rel = 'noopener nofollow'; return a; }
  function safe(u) { return typeof u === 'string' && /^https:\/\/[^\s"<>]+$/.test(u) ? u : null; }
  // (as the bot writes them: $10.2K, $0.0₄1019)
  function amt(x) {
    var a = Math.abs(x), f = function (v, s) { return (v >= 100 ? R(v) : v >= 10 ? R(v * 10) / 10 : R(v * 100) / 100) + s; };
    return a >= 1e12 ? f(x / 1e12, 'T') : a >= 1e9 ? f(x / 1e9, 'B') : a >= 1e6 ? f(x / 1e6, 'M') : a >= 1e3 ? f(x / 1e3, 'K') : String(a >= 1 ? R(x * 100) / 100 : Number(x.toPrecision(3)));
  }
  function price(p) {
    if (p >= 1) return '$' + p.toLocaleString('en-US', { maximumFractionDigits: 4 });
    var m = (p * (1 + 1e-12)).toFixed(20).match(/^0\.(0*)(\d{1,4})/);
    if (!m) return '$' + p.toPrecision(4);
    if (m[1].length >= 4) return '$0.0' + String(m[1].length).replace(/\d/g, function (c) { return String.fromCharCode(8320 + +c); }) + m[2].replace(/0+$/, '');
    return '$0.' + m[1] + m[2].replace(/0+$/, '');
  }
  function chg(c) { var a = Math.abs(c), v = a >= 10 ? R(a) : R(a * 10) / 10; return (c < 0 ? '▼ -' : '▲ +') + v + '%'; }

  function row(r, dex) {
    var li = el('li', r.rank <= 3 ? 'zt10-t' : null), href = safe(dex ? r.dex : r.chart) || safe(r.chart) || safe(r.dex);
    var a = href ? link(el('a', 'zt10-r'), href) : el('div', 'zt10-r'), b = num(r.buyers) ? Math.max(0, R(r.buyers)) : 0;
    var s = el('span', 'zt10-s', '$' + String(r.symbol || '?')), p = el('span', 'zt10-p', num(r.price) && r.price > 0 ? price(r.price) : '—');
    a.appendChild(el('span', 'zt10-n', num(r.rank) ? String(r.rank) : '·'));
    if (r.ad || r.booked) s.appendChild(el('span', 'zt10-g', r.ad ? 'AD' : 'Booked'));
    if (num(r.change24h)) { p.appendChild(d.createTextNode(' ')); p.appendChild(el('span', r.change24h < 0 ? 'zt10-d' : 'zt10-u', chg(r.change24h))); }
    a.appendChild(s); a.appendChild(p);
    a.appendChild(el('span', 'zt10-m', r.name ? String(r.name) : ''));
    a.appendChild(el('span', 'zt10-x', (num(r.mc) && r.mc > 0 ? 'MC $' + amt(r.mc) + ' · ' : '') + b + (b === 1 ? ' buyer' : ' buyers')));
    li.appendChild(a);
    return li;
  }
  // j: the API's answer, or null (not loaded)
  function draw(box, j, dex) {
    var r = box.getAttribute('data-ref') || '', w = j && num(j.windowMinutes) ? j.windowMinutes : 60, h = el('div', 'zt10-h'), f = el('div', 'zt10-f'), rows = j ? j.board.slice(0, 10) : null;
    box.textContent = '';
    h.appendChild(el('span', 'zt10-ti', 'Arc Top 10'));
    h.appendChild(el('span', 'zt10-su', 'Real buyers, last ' + (w === 60 ? 'hour' : w + ' min')));
    box.appendChild(h);
    if (rows && rows.length) { var ol = el('ol', 'zt10-l'); for (var i = 0; i < rows.length; i++) if (rows[i]) ol.appendChild(row(rows[i], dex)); box.appendChild(ol); }
    else box.appendChild(el('p', 'zt10-e', rows ? 'No tokens on the board right now.' : 'The Top 10 could not be loaded. Trying again in a minute.'));
    f.appendChild(link(el('a', null, 'Arc Top 10 by real buyers · Zeus Tools'), /^[a-z\d]{4,16}$/i.test(r) ? 'https://t.me/TheZeusBuybot?start=r_' + r : SITE));
    if (rows && num(j.at)) f.appendChild(el('span', null, 'Updated ' + new Date(j.at).toISOString().slice(11, 16) + ' UTC'));
    box.appendChild(f);
  }
  function mount(box) {
    if (!box || box.getAttribute('data-zt10-on')) return;
    box.setAttribute('data-zt10-on', '1');
    if (!d.getElementById('zt10-css')) { var st = el('style', null, CSS); st.id = 'zt10-css'; (d.head || d.documentElement).appendChild(st); }
    var t = box.getAttribute('data-theme'), url = box.getAttribute('data-api') || API, dex = box.getAttribute('data-link') === 'dex', ok = false;
    box.className = (box.className ? box.className + ' ' : '') + 'zt10' + (t === 'dark' || t === 'light' ? ' zt10-' + t : '');
    box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Arc Top 10 by real buyers');
    box.textContent = '';
    box.appendChild(el('p', 'zt10-e', 'Loading the Arc Top 10…'));
    function load() {
      if (ok && d.hidden) return; // (a hidden tab reads nothing)
      if (typeof fetch !== 'function') return draw(box, null, dex);
      fetch(url, { headers: { accept: 'application/json' }, credentials: 'omit' }).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (j) {
        if (!j || j.ok !== true || !Array.isArray(j.board)) throw 0;
        ok = true;
        draw(box, j, dex);
      }).catch(function () { if (!ok) draw(box, null, dex); }); // (a failed refresh: the last good card stays)
    }
    load();
    setInterval(load, 60000);
  }
  function init() { var l = d.querySelectorAll('[data-zeus-top10]'); for (var i = 0; i < l.length; i++) mount(l[i]); }
  window.ZeusTop10 = { mount: mount, init: init };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
