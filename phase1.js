/* Phase 1 runtime balance patch. Load after index.html's main script. */
(() => {
  'use strict';
  const KEY = 'por_difficulty_v1';
  const MODES = {
    easy: { label: 'Легко', xp: 0.80, click: 1.35, miniGame: 1.00 },
    normal: { label: 'Норма', xp: 1.00, click: 1.00, miniGame: 1.25 },
    hard: { label: 'Хардкор', xp: 1.20, click: 0.82, miniGame: 1.75 }
  };
  const valid = value => Object.prototype.hasOwnProperty.call(MODES, value);
  const getMode = () => valid(localStorage.getItem(KEY)) ? localStorage.getItem(KEY) : 'normal';
  const toast = message => {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 1800);
  };

  window.GameDifficulty = {
    get mode() { return getMode(); },
    get config() { return MODES[getMode()]; },
    modes: MODES,
    set(mode) {
      if (!valid(mode)) return false;
      localStorage.setItem(KEY, mode);
      toast(`Сложность: ${MODES[mode].label}`);
      return true;
    }
  };

  function installSelector() {
    if (document.getElementById('phase1-difficulty')) return;
    const panel = document.getElementById('left-panel');
    if (!panel) return;
    const section = document.createElement('section');
    section.id = 'phase1-difficulty';
    section.style.cssText = 'padding:6px;border-top:1px solid #4a3a55;margin-top:6px';
    section.innerHTML = '<div class="panel-title">⚔️ Сложность</div><select aria-label="Сложность" style="width:100%;padding:7px;border-radius:8px;background:#2a1e35;color:#f5e6d3;border:1px solid #6a5070"></select>';
    const select = section.querySelector('select');
    Object.entries(MODES).forEach(([id, config]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = config.label;
      select.appendChild(option);
    });
    select.value = getMode();
    select.addEventListener('change', () => window.GameDifficulty.set(select.value));
    panel.appendChild(section);
  }

  function patchGame() {
    const game = window.G;
    if (!game || game.__phase1Patched) return;
    game.__phase1Patched = true;

    if (typeof game.click === 'function') {
      const originalClick = game.click.bind(game);
      game.click = (...args) => {
        const before = Number(game.pp) || 0;
        originalClick(...args);
        const gained = (Number(game.pp) || 0) - before;
        const bonus = gained * (GameDifficulty.config.click - 1);
        if (bonus > 0) {
          game.pp += bonus;
          if (typeof game.touch === 'function') game.touch();
        }
      };
    }

    if (window.PrestigeSystem && typeof window.PrestigeSystem.openFlush === 'function') {
      const system = window.PrestigeSystem;
      const originalOpenFlush = system.openFlush.bind(system);
      system.openFlush = (...args) => {
        if ((Number(game.level) || 0) < 7) {
          toast('🌀 Великое смывание откроется на 7-й локации');
          return;
        }
        return originalOpenFlush(...args);
      };
    }
  }

  function boot() {
    installSelector();
    patchGame();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  const timer = setInterval(() => {
    boot();
    if (window.G && window.G.__phase1Patched && document.getElementById('phase1-difficulty')) clearInterval(timer);
  }, 250);
})();
