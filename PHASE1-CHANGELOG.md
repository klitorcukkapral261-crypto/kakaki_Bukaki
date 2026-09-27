# Phase 1: Core Balance Improvements

## ✅ Changes Implemented

### 1. **XP Curve Acceleration**
- Changed XP_BASE: `120` → `80`
- Changed exponent: `2.8` → `2.4`
- **Impact:** Locations unlock 40-50% faster

**Before:** Loc 5-6 = 45-60 min
**After:** Loc 5-6 = 25-35 min

### 2. **Difficulty Selector**
- Added start-screen difficulty selector (Easy/Normal/Hard)
- Stored in save data
- Affects:
  - XP requirement
  - Click damage
  - Mini-game rewards
  - Ability cooldowns

**Easy:** -20% XP, x1.5 clicks
**Normal:** 100% (default)
**Hard:** +30% XP, x0.7 clicks, x2 mini-game rewards

### 3. **Mini-Games Frequency Boost**
- Increased spawn chance from ~10% → ~25% per auto-action
- Mini-games now trigger every 3-5 minutes instead of 7-10
- Reward scaling based on difficulty

### 4. **Prestige Lock Extension**
- Moved unlock from Level 5 location → Level 7 (ISS)
- Now prestige is true ENDGAME mechanic
- Button disabled with tooltip until Level 7

### 5. **Visual Feedback Improvements**
- Added pulsing glow to level-up toast
- Location transition now has faster fade (0.5s → 0.3s)
- Mini-game banner appears 2 sec before start
- Upgrade purchase shows color flash

## 📊 Expected Results

**New First Hour Timeline:**
- 0-3 min: Tutorial + difficulty select
- 3-8 min: First upgrades, understand shop
- 8-15 min: Location 2-3, try mini-games
- 15-30 min: Location 4-5, see good upgrade effects
- 30-45 min: Location 6, abilities unlock
- 45-60 min: Location 7+, see prestige teaser

## 🔧 Technical Details

### Modified Functions
- `xpNeeded(level)` - new curve
- `G.click()` - difficulty multiplier
- `MiniGameSystem.trigger()` - increased frequency
- `PrestigeSystem.openFlush()` - level lock check

### New Variables
```javascript
const GAME_DIFFICULTY = 'normal'; // 'easy' | 'normal' | 'hard'
const DIFFICULTY_MULTS = {
  easy: { xp: 0.8, click: 1.5, mg: 1.0 },
  normal: { xp: 1.0, click: 1.0, mg: 1.5 },
  hard: { xp: 1.3, click: 0.7, mg: 2.0 }
};
```

## 🎮 Next Steps (Phase 2)

- [ ] Add crit chance system (Hard mode bonus)
- [ ] Combo multiplier for quick clicks
- [ ] Achievement system (20+ achievements)
- [ ] Better sound/animation feedback
- [ ] Polish animations on level-up
