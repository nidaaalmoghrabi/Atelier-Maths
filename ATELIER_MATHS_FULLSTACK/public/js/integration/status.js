/* A quiet local-save indicator in the existing top bar. */
(function () {
  'use strict';
  const bar = document.querySelector('.topbar .top-actions') || document.querySelector('.topbar');
  if (!bar) return;
  const el = document.createElement('span');
  el.id = 'atelier-server-indicator';
  el.style.cssText = 'font-size:10px;color:#316a5b;white-space:nowrap;margin:0 7px';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = '● Local';
  bar.appendChild(el);
  document.addEventListener('atelier:backend-status', e => {
    const ok = e.detail.online;
    el.textContent = ok ? '● Local' : '● Save error';
    el.style.color = ok ? '#316a5b' : '#b53131';
    el.title = ok ? 'Saved on this laptop' : 'Could not save to the local Node.js server';
  });
})();
