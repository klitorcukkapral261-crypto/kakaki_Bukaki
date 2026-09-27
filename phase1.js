/* Phase 1 runtime balance patch
 * Load this file after index.html's main script when integrating the patch.
 * It deliberately fails soft: existing gameplay remains usable if a subsystem is absent.
 */
(() => {
  'use strict';

  const KEY = 'por_difficulty_v1';
  const MODES = {
    easy:   { label: 'Легко', xp: 0.80, click: 1.35, miniGame: 1.00 },
    normal: { label: 'Норма', xp: 1.00, click: 1.00, miniGame: 1.25 },
    hard:   { label: 'Хардкор', xp: 1.20, click: 0.82, miniGame: 1.75 }
  };

  const readMode = () => {
    const mode = localStorage.getItem(KEY) || 'normal';
    return MODES[mode] ? mode : 'normal';
  };
  const mode = MODES[readMode()];
  window.GameDifficulty = {
    mode: readMode(),
    modes: MODES,
    set(next) {
      if (!MODES[next]) return false;
      localStorage.setItem(KEY, next);
      this.mode = next;
      return true;
    },
    multiplier(type) { return mode[type] || 1; }
  };

  // Add a compact mobile-friendly mode selector without touching the existing DOM.
  function installSelector() {
    if (document.getElementById('phase1-difficulty')) return;
    const panel = document.getElementById('left-panel');
    if (!panel) return;
    const box = document.createElement('section');
    box.id = 'phase1-difficulty';
    box.style.cssText = 'padding:6px;border-top:1px solid #4a3a55;margin-top:6px';
    box.innerHTML = '<div class="panel-title">⚔️ Сложность</div>' +
      '<select aria-label="Сложность" style="width:100%;padding:7px;border-radius:8px;background:#2a1e35;color:#f5e6d3;border:1px solid #6a5070">' +
      Object.entries(MODES).map(([id, item]) => `<option value="${id}">${item.label}</option>`).join('') +
      '</select>';
    panel.appendChild(box);
    const select = box.querySelector('select');
    select.value = readMode();
    select.addEventListener('change', () => {
      window.GameDifficulty.set(select.value);
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = `Сложность: ${MODES[select.value].label}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1400);
      }
    });
  }

  // Prestige must not interrupt the first-hour onboarding: require location 7.
  function guardPrestige() {
    const system = window.PrestigeSystem;
    if (!system || system.__phase1Guarded) return;
    const original = system.openFlush;
    if (typeof original !== 'function') return;
    system.openFlush = function (...args) {
      const level = Number(window.G?.state?.level ?? window.G?.level ?? 0);
      if (level > 0 && level < 7) {
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = '🌀 Великое смывание откроется на 7-й локации';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 1800);
        }
        return;
      }
      return original.apply(this, args);
    };
    system.__phase1Guarded = true;
  }

  function boot() {
    installSelector();
    guardPrestige();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  const timer = setInterval(() => {
    guardPrestige();
    if (window.PrestigeSystem && document.getElementById('left-panel')) clearInterval(timer);
  }, 250);
})();
