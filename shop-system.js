/* ============================================================
   SHOP SYSTEM — Полноценный магазин улучшений и зданий
   Путь Облегчения / The Path of Relief
   ============================================================ */

const ShopSystem = (() => {
  const SAVE_KEY = 'por_shop_v1';
  
  const BUILDINGS = [
    { id: 'babushka_borsch', name: '👵 Бабушкин борщ', desc: 'Давай, кушай! +1/сек', pps: 1, icon: '🍲', baseCost: 15 },
    { id: 'kvass', name: '🥛 Просроченный кефир', desc: 'Кисломолочное чудо. +8/сек', pps: 8, icon: '🥛', baseCost: 100 },
    { id: 'cucumber', name: '🥒 Огурец с молоком', desc: 'Странная, но эффективная комбо. +45/сек', pps: 45, icon: '🥒', baseCost: 1100 },
    { id: 'hellfire', name: '🔥 Острый соус "Огонь Дьявола"', desc: 'Жжёт не только желудок. +200/сек', pps: 200, icon: '🔥', baseCost: 12000 },
    { id: 'collider', name: '⚛️ Адронный Коллайдер Втулок', desc: 'Столкновение элементов на атомарном уровне. +1200/сек', pps: 1200, icon: '⚛️', baseCost: 130000 }
  ];

  const UPGRADES = [
    { id: 'sphincter', name: '🔐 Железный Сфинктер', desc: '×2 базовый клик', type: 'click', effect: 2.0, icon: '🔐', baseCost: 200, maxCount: 1 },
    { id: 'plunger', name: '🧹 Вантуз Судьбы', desc: '+5% клика за уровень локации', type: 'click', effect: 0.05, icon: '🧹', baseCost: 500, maxCount: Infinity },
    { id: 'chair', name: '🪑 Анатомическая сидушка', desc: '+150% к клику', type: 'click', effect: 1.5, icon: '🪑', baseCost: 5000, maxCount: 1 },
    { id: 'headphones', name: '🎧 Шумоподавляющие наушники', desc: 'Мини-игра "Стук в дверь" -50% частоты', type: 'minigame', effect: 0.5, icon: '🎧', baseCost: 3000, maxCount: 1 },
    { id: 'helmet', name: '🪖 Тактический шлем', desc: 'Голубиные пятна в мини-играх -2 шт', type: 'minigame', effect: 2, icon: '🪖', baseCost: 4000, maxCount: 1 }
  ];

  let state = {
    buildings: {},
    upgrades: {},
    tabOpen: 'buildings'
  };

  BUILDINGS.forEach(b => { state.buildings[b.id] = 0; });
  UPGRADES.forEach(u => { state.upgrades[u.id] = 0; });

  function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function load() {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      const loaded = JSON.parse(data);
      state.buildings = { ...state.buildings, ...loaded.buildings };
      state.upgrades = { ...state.upgrades, ...loaded.upgrades };
    }
  }

  function getCost(baseCost, count) {
    return Math.floor(baseCost * Math.pow(1.15, count));
  }

  function playBuySound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  function showToast(text) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => el.classList.remove('show'), 1600);
  }

  function buyBuilding(buildingId) {
    const building = BUILDINGS.find(b => b.id === buildingId);
    if (!building) return false;

    const count = state.buildings[buildingId] || 0;
    const cost = getCost(building.baseCost, count);
    const game = window.G;

    if (!game || game.pp < cost) {
      showToast('❌ Недостаточно 💩!');
      return false;
    }

    game.pp -= cost;
    state.buildings[buildingId] = count + 1;
    save();

    playBuySound();
    showToast(`✅ ${building.name} куплено! +${building.pps}/сек`);
    updateShopUI();
    return true;
  }

  function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const count = state.upgrades[upgradeId] || 0;
    if (count >= (upgrade.maxCount || 1)) {
      showToast('🔒 Это улучшение уже куплено!');
      return false;
    }

    const cost = getCost(upgrade.baseCost, count);
    const game = window.G;

    if (!game || game.pp < cost) {
      showToast('❌ Недостаточно 💩!');
      return false;
    }

    game.pp -= cost;
    state.upgrades[upgradeId] = count + 1;
    save();

    playBuySound();
    showToast(`✅ ${upgrade.name} активировано!`);
    applyUpgradeEffects();
    updateShopUI();
    return true;
  }

  function applyUpgradeEffects() {
    // Эти эффекты нужно интегрировать в основную логику игры
    // Для теста просто логируем
    console.log('Upgrades applied:', state.upgrades);
  }

  function updateShopUI() {
    const modal = createShopModal();
    if (modal) {
      const container = document.getElementById('shop-modal-container');
      if (container) {
        container.innerHTML = modal;
      }
    }
  }

  function createShopModal() {
    let html = `
      <div class="modal-bg show" id="modal-shop">
        <div class="modal" style="max-width:520px">
          <h2>🛒 Магазин Улучшений</h2>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <button class="btn" onclick="ShopSystem.switchTab('buildings')" style="flex:1;margin:0" id="tab-buildings">
              🏗️ Пассивный доход
            </button>
            <button class="btn" onclick="ShopSystem.switchTab('upgrades')" style="flex:1;margin:0" id="tab-upgrades">
              ⚙️ Апгрейды
            </button>
          </div>
          <div id="shop-content" style="max-height:400px;overflow-y:auto">
            <!-- Содержимое вкладок -->
          </div>
          <div class="actions" style="margin-top:12px">
            <button class="btn" onclick="ShopSystem.closeShop()" style="width:100%">Закрыть</button>
          </div>
        </div>
      </div>
    `;
    return html;
  }

  function switchTab(tab) {
    state.tabOpen = tab;
    const content = document.getElementById('shop-content');
    if (!content) return;

    if (tab === 'buildings') {
      content.innerHTML = BUILDINGS.map(b => {
        const count = state.buildings[b.id] || 0;
        const cost = getCost(b.baseCost, count);
        return `
          <div class="shop-item" style="margin:6px 0;padding:8px;background:rgba(0,0,0,.25);border:1px solid #5a4568;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong>${b.icon} ${b.name}</strong>
              <div style="font-size:11px;color:#9a8a7a">${b.desc}</div>
              <div style="font-size:10px;color:#8a7a6a;margin-top:2px">Куплено: <b>${count}</b></div>
            </div>
            <button class="btn btn-good" onclick="ShopSystem.buyBuilding('${b.id}')" style="width:auto;min-width:80px;margin:0">
              💰 ${cost}
            </button>
          </div>
        `;
      }).join('');
    } else {
      content.innerHTML = UPGRADES.map(u => {
        const count = state.upgrades[u.id] || 0;
        const cost = getCost(u.baseCost, count);
        const isMaxed = count >= (u.maxCount || 1);
        return `
          <div class="shop-item" style="margin:6px 0;padding:8px;background:rgba(0,0,0,.25);border:1px solid ${isMaxed ? '#5a5a5a' : '#5a4568'};border-radius:8px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong>${u.icon} ${u.name}</strong>
              <div style="font-size:11px;color:#9a8a7a">${u.desc}</div>
              <div style="font-size:10px;color:#8a7a6a;margin-top:2px">Статус: <b>${isMaxed ? '✅ Активировано' : `Готово (${count}/${u.maxCount || '∞'})`}</b></div>
            </div>
            <button class="btn ${isMaxed ? 'btn-accent' : 'btn-good'}" onclick="ShopSystem.buyUpgrade('${u.id}')" style="width:auto;min-width:80px;margin:0" ${isMaxed ? 'disabled' : ''}>
              ${isMaxed ? '✓' : `💰 ${cost}`}
            </button>
          </div>
        `;
      }).join('');
    }

    // Обновляем активную вкладку
    document.getElementById('tab-buildings').classList.toggle('selected', tab === 'buildings');
    document.getElementById('tab-upgrades').classList.toggle('selected', tab === 'upgrades');
  }

  function openShop() {
    const container = document.createElement('div');
    container.id = 'shop-modal-container';
    container.innerHTML = createShopModal();
    document.body.appendChild(container);
    
    // Активируем нужную вкладку
    setTimeout(() => switchTab(state.tabOpen), 0);
  }

  function closeShop() {
    const container = document.getElementById('shop-modal-container');
    if (container) container.remove();
  }

  function getPassiveIncome() {
    return BUILDINGS.reduce((sum, b) => sum + (b.pps * (state.buildings[b.id] || 0)), 0);
  }

  function getClickMultiplier() {
    let mult = 1;
    const sphincter = state.upgrades['sphincter'] || 0;
    const chair = state.upgrades['chair'] || 0;
    const plunger = state.upgrades['plunger'] || 0;

    if (sphincter > 0) mult *= 2;
    if (chair > 0) mult *= 2.5; // 1 + 1.5
    
    const gameLevel = (window.G && window.G.level) || 1;
    if (plunger > 0) mult *= (1 + 0.05 * gameLevel * plunger);

    return mult;
  }

  // Public API
  return {
    load,
    save,
    buyBuilding,
    buyUpgrade,
    openShop,
    closeShop,
    switchTab,
    getPassiveIncome,
    getClickMultiplier,
    state: () => state
  };
})();

// Автозагрузка при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ShopSystem.load());
} else {
  ShopSystem.load();
}

// Интеграция с основной игрой: добавляем кнопку в магазин
(function() {
  const checkShopButton = setInterval(() => {
    const rightPanel = document.getElementById('right-panel');
    if (!rightPanel) return;

    if (document.getElementById('btn-shop-upgrades')) {
      clearInterval(checkShopButton);
      return;
    }

    const shopList = document.getElementById('shop-list');
    if (!shopList) return;

    const btn = document.createElement('button');
    btn.id = 'btn-shop-upgrades';
    btn.className = 'btn btn-accent';
    btn.style.marginTop = '8px';
    btn.textContent = '🛒 Магазин улучшений';
    btn.onclick = () => ShopSystem.openShop();

    shopList.parentNode.insertBefore(btn, shopList.nextSibling);
    clearInterval(checkShopButton);
  }, 500);
})();
