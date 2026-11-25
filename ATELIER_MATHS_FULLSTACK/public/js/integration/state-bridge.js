/* Keep all original examination, worksheet, and presentation generators working,
 * while storing their saved data on the local Node.js backend automatically.
 * No external network service or account is involved. */
(function () {
  'use strict';
  const KEYS = [
    'atelier-maths-fr-2026-v1',
    'atelier-maths-presentation-studio-v1',
    'atelier-maths-language'
  ];
  const server = window.__ATELIER_SERVER_INITIAL_STATE__ || {};
  const nativeSet = Storage.prototype.setItem;
  const originals = new Map();
  const pending = new Map();
  const writes = new Map();
  const state = { online: true, errors: [], lastSavedAt: null };
  function changed() { document.dispatchEvent(new CustomEvent('atelier:backend-status', { detail: { ...state } })); }
  async function send(key, value) {
    const previous = writes.get(key) || Promise.resolve();
    const next = previous.catch(() => {}).then(async () => {
      const r = await fetch('/api/state/' + encodeURIComponent(key), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      if (!r.ok) throw Error('Server save failed: ' + r.status);
      state.online = true;
      state.lastSavedAt = Date.now();
      changed();
    }).catch(err => {
      state.online = false;
      state.errors.push(String(err.message || err));
      if (state.errors.length > 5) state.errors.shift();
      console.error('[Atelier Maths] Local server save failed', err);
      changed();
    });
    writes.set(key, next);
    await next;
    if (writes.get(key) === next) writes.delete(key);
  }
  function schedule(key, value) {
    const previous = pending.get(key);
    if (previous) clearTimeout(previous.timer);
    pending.set(key, { value, timer: setTimeout(() => {
      const item = pending.get(key);
      pending.delete(key);
      if (item) send(key, item.value);
    }, 200) });
  }
  for (const key of KEYS) {
    const current = localStorage.getItem(key);
    originals.set(key, current);
    if (server[key] !== null && server[key] !== undefined) {
      // The Node.js backend is canonical on this machine after the first save.
      try { nativeSet.call(localStorage, key, server[key]); }
      catch (e) { console.warn('[Atelier Maths] Browser cache full; using local server state',e.message); }
    } else if (current !== null) {
      // Automatically migrate data from a previous single-HTML browser copy.
      schedule(key, current);
    }
  }
  Storage.prototype.setItem = function (key, value) {
    const persistent = this === localStorage && KEYS.includes(String(key));
    if (!persistent) return nativeSet.call(this, key, value);
    try { nativeSet.call(this, key, value); } catch (error) {
      // Browser quotas must not prevent saving to the actual local backend.
      if (error.name !== 'QuotaExceededError') throw error;
    }
    schedule(String(key), String(value));
  };
  // Best-effort final flush if the user closes the browser immediately after editing.
  window.addEventListener('pagehide', () => {
    for (const [key, item] of pending) {
      clearTimeout(item.timer);
      navigator.sendBeacon('/api/state/' + encodeURIComponent(key),
        new Blob([JSON.stringify({ value: item.value })], { type: 'application/json' }));
    }
    pending.clear();
  });
  window.ATELIER_BACKEND = {
    status: state,
    flush: async () => {
      for (const [key, item] of pending) {
        clearTimeout(item.timer);
        pending.delete(key);
        await send(key, item.value);
      }
      await Promise.all([...writes.values()]);
    }
  };
})();
