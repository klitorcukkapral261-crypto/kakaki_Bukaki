# 🎮 Kakaki Bukaki - Balance Design Document

## Current State Analysis

### 🎯 Target Audience
- **Primary:** Mobile players (harcore + casual)
- **Secondary:** PC players
- **Difficulty levels:** Easy, Normal, Hard (to be implemented)

### 📊 First Hour Goals
- 0-5 min: Learn basic mechanics (clicking, PP, stats)
- 5-15 min: Explore shop, buy first upgrades
- 15-30 min: Try mini-games, understand abilities
- 30-45 min: Reach location 5-6
- 45-60 min: Early prestige understanding (NOT unlock yet)

---

## 🔴 Problems Identified

### 1. **Progression is TOO SLOW**
- Current: XP_BASE = 120, formula: `XP_BASE * (level ^ 2.8)`
- Result: Level 1→2 takes ~1-2 min, but Level 5→6 takes way too long
- **Impact:** Players don't see location 5-6 in first hour

### 2. **Prestige unlocks TOO EARLY**
- Current: Available at "level 5 of location" (5th level when in location 5)
- **Problem:** This is ~30 minutes, prestige should be ENDGAME
- **Fix:** Move to location 7+ or 120+ minutes of gameplay

### 3. **Mini-games appear RARELY**
- Should trigger more frequently during gameplay
- Currently: Unknown trigger rate
- **Fix:** Make them appear ~every 3-5 minutes of active play

### 4. **Difficulty selector MISSING**
- Game needs Easy/Normal/Hard modes
- **Fix:** Add selector on game start

---

## 📈 Balance Changes for Phase 1

### A) XP Curve Adjustment
```
OLD:  xpNeeded(lv) = 120 * (lv ^ 2.8)
      Level 1→2: 120 PP
      Level 5→6: 15,000 PP (too slow!)
      Level 9→10: 60,000 PP (insane)

NEW:  xpNeeded(lv) = 80 * (lv ^ 2.4)
      Level 1→2: 80 PP (30 sec of clicking)
      Level 5→6: 4,000 PP (2-3 min)
      Level 9→10: 20,000 PP (5-7 min active)
```

**Result:** Locations unlock faster, keeps player engaged

### B) Location Unlock Timeline (Active Play)
| Location | Current | New | Time |
|----------|---------|-----|------|
| 1 (Home) | Instant | Instant | 0 min |
| 2 (Festival) | ~Level 2 | ~Level 2 | 1-2 min |
| 3 (Dacha) | ~Level 3 | ~Level 3 | 3-4 min |
| 4 (Station) | ~Level 4 | ~Level 4 | 8-10 min |
| 5 (Restaurant) | ~Level 5 | ~Level 5 | 15-18 min |
| 6 (Penthouse) | ~Level 6 | ~Level 6 | 25-30 min |
| 7 (ISS) | ~Level 7 | ~Level 7 | 40-45 min |
| 8 (Volcano) | ~Level 8 | ~Level 8 | 55-65 min |
| 9 (Temple) | ~Level 9 | ~Level 9 | 80+ min |

### C) Mini-Games Frequency
**Current:** Unknown / Infrequent
**New:** Trigger every 3-5 minutes of gameplay
- Dirt scrape: 30% chance
- Paper roll: 30% chance
- Plumber: 20% chance
- Door noise: 20% chance

**Reward scaling:** 
- Easy: 1x bonus
- Normal: 1.5x bonus
- Hard: 2x bonus

### D) Upgrade Pricing & Effect
**Philosophy:** Each upgrade should feel IMMEDIATE and STRONG

| Upgrade | Cost | Effect | Visibility |
|---------|------|--------|------------|
| Fiber | 100 PP | +10% income | Clear |
| Laxative | 50 PP | -5% constipation instantly | Visual feedback |
| Coffee | 200 PP | +15% click damage | Immediate boost |

### E) Prestige System
**Current Problem:** Too early unlock (30 min)
**New Rule:** Unlock at Level 7 (ISS location) = ~45-60 min

**Bushing rewards:**
- Easy: +0.5% per bushing
- Normal: +1% per bushing  
- Hard: +1.5% per bushing

---

## 🎮 Difficulty Modes (To Implement)

### Easy
- XP requirement: -20%
- Click damage: x1.5
- Mini-game rewards: x1
- Prestige unlock: +10% sooner
- **Target:** Casual players, speedrunners

### Normal (Default)
- XP requirement: 100%
- Click damage: x1
- Mini-game rewards: x1.5
- Prestige unlock: Level 7
- **Target:** Standard players

### Hard
- XP requirement: +30%
- Click damage: x0.7
- Mini-game rewards: x2
- Crit chance: +10% (Phase 2)
- Prestige unlock: Level 8
- **Target:** Hardcore players

---

## 🔍 Feedback & Polish (Phase 1)

### Visual Feedback Per Action
- **Clicking:** Screen shake (exists, needs tuning)
- **Leveling up:** Bright flash + sound + toast message
- **New location:** Fade to location + modal
- **Upgrade bought:** Positive sound + color change

### Mini-Game Triggers
- Should show banner 2-3 sec before starting
- Visual/audio cue when appearing
- Big reward display when completed

---

## 📋 Phase 1 Checklist

- [ ] Update XP formula from 2.8 → 2.4 exponent
- [ ] Adjust XP_BASE: 120 → 80
- [ ] Add difficulty selector to start screen
- [ ] Increase mini-game frequency
- [ ] Boost mini-game rewards
- [ ] Add prestige unlock delay (level 7+)
- [ ] Improve visual feedback for upgrades
- [ ] Test progression timing (should hit loc 5-6 in 30-45 min)
- [ ] Adjust ability cooldowns if needed
- [ ] Polish prestige messaging

---

## 📈 Success Metrics

After Phase 1, a player should:
- ✅ Reach Location 5-6 within 45-60 minutes
- ✅ Feel progression every 2-3 minutes
- ✅ Trigger mini-game ~every 4-5 minutes
- ✅ Understand prestige is ENDGAME, not early-game
- ✅ See clear visual/audio feedback for every action
- ✅ Feel "harcore" or "casual" based on difficulty choice

---

**Next Phase:** Phase 2 - Crits, Combos, Animations, Sounds
