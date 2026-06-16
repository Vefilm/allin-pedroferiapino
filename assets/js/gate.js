(function () {
  var KEY       = 'allin_site_auth';
  var PASS_HASH = 'YWxsaW4yMDI2'; // btoa('allin2026')

  function show() {
    document.documentElement.style.visibility = '';
  }

  // Already unlocked — just restore visibility and exit
  if (sessionStorage.getItem(KEY) === '1') {
    show();
    return;
  }

  // ── Inject gate CSS ─────────────────────────────────────────────────────────
  var s = document.createElement('style');
  s.textContent =
    '.ag{position:fixed;inset:0;z-index:9999;background:#0A0A0A;display:flex;align-items:center;justify-content:center;padding:2rem;}' +
    '.ag-i{width:100%;max-width:400px;text-align:center;}' +
    '.ag-wm{font-family:Georgia,"Times New Roman",serif;font-size:2.5rem;font-weight:700;color:#fff;letter-spacing:-0.02em;display:block;margin-bottom:.35rem;}' +
    '.ag-lb{font-family:Calibri,system-ui,sans-serif;font-size:.5625rem;font-weight:700;letter-spacing:.45em;text-transform:uppercase;color:#B11226;display:block;margin-bottom:3rem;}' +
    '.ag-rl{width:40px;height:2px;background:#B11226;margin:0 auto 2.5rem;}' +
    '.ag-pr{font-family:Calibri,system-ui,sans-serif;font-size:.6875rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:1rem;display:block;}' +
    '.ag-in{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:#fff;font-family:"Courier New",monospace;font-size:1.125rem;letter-spacing:.18em;padding:.9rem 1.25rem;text-align:center;outline:none;transition:border-color .2s;-webkit-text-security:disc;}' +
    '.ag-in:focus{border-color:rgba(177,18,38,.6);}' +
    '.ag-bt{width:100%;margin-top:.75rem;background:#B11226;color:#fff;font-family:Calibri,system-ui,sans-serif;font-size:.6875rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;border:none;padding:.9rem 1.25rem;cursor:pointer;transition:background .2s;}' +
    '.ag-bt:hover{background:#7A0C1C;}' +
    '.ag-er{margin-top:.9rem;font-family:Calibri,system-ui,sans-serif;font-size:.75rem;color:#B11226;letter-spacing:.1em;min-height:1.2em;}';
  document.head.appendChild(s);

  // ── Build overlay ────────────────────────────────────────────────────────────
  var gate = document.createElement('div');
  gate.className = 'ag';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-label', 'Access required');
  gate.innerHTML =
    '<div class="ag-i">' +
      '<span class="ag-wm">ALL IN</span>' +
      '<span class="ag-lb">Internal Access Only</span>' +
      '<div class="ag-rl"></div>' +
      '<span class="ag-pr">Enter access code</span>' +
      '<input class="ag-in" id="ag-in" type="text" autocomplete="off" spellcheck="false" autofocus>' +
      '<button class="ag-bt" id="ag-bt">Enter</button>' +
      '<p class="ag-er" id="ag-er" aria-live="polite"></p>' +
    '</div>';
  document.body.appendChild(gate);

  // Restore visibility — gate overlay now covers the page
  show();

  // ── Logic ────────────────────────────────────────────────────────────────────
  function check(val) {
    try { return btoa(val) === PASS_HASH; } catch(e) { return false; }
  }

  function unlock() {
    gate.style.transition = 'opacity 0.4s ease';
    gate.style.opacity = '0';
    setTimeout(function () { if (gate.parentNode) gate.parentNode.removeChild(gate); }, 420);
    sessionStorage.setItem(KEY, '1');
  }

  function attempt() {
    var input = document.getElementById('ag-in');
    var err   = document.getElementById('ag-er');
    var val   = (input.value || '').trim().toLowerCase();
    if (!val) return;
    if (check(val)) {
      unlock();
    } else {
      err.textContent = 'Incorrect access code.';
      input.value = '';
      input.focus();
    }
  }

  document.getElementById('ag-bt').addEventListener('click', attempt);
  document.getElementById('ag-in').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { attempt(); }
    document.getElementById('ag-er').textContent = '';
  });
})();
