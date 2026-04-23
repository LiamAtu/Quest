# Quest — User Guide

## Overview

Quest is a Progressive Web Application (PWA) built with Ionic 7 and Angular. 
It gamifies daily habit tracking by rewarding users with XP, levels, cosmetic 
upgrades, and trophies as they complete habits each day. The app features a hero character that evolves as the player levels up.

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or above recommended)
- Ionic CLI v7 or above

### Install Ionic CLI
```bash
npm install -g @ionic/cli
```

### Clone and run
```bash
git clone https://github.com/LiamAtu/Quest.git
cd Quest
npm install
ionic serve
```

The app will open automatically at `http://localhost:8100`.

### Production build
```bash
npx ng build --configuration=production
cp -r public/icons www/icons
cp public/manifest.webmanifest www/manifest.webmanifest
npx http-server www -p 8080
```

### Live deployment
The app is deployed and accessible at: `https://quests-2e4cb.web.app`

---

## Features

### Dashboard
The main home screen displays:
- A personalised hero character that changes appearance as you level up
- Your current level, title, and XP progress bar
- A daily streak counter showing consecutive days of habit completion
- Today's habit list with one-tap completion
- A stats row showing habits done today, total habits, and XP earned today
- A weekly dot tracker showing which days you completed habits

### Quests
The Quests page fetches habit suggestions from an external JSON API hosted on 
GitHub. Users can:
- Browse 32 habit suggestions across 4 categories — Health, Mind, Body, Social
- Filter quests by category using the chip filters
- Add any quest to their daily habit list with one tap
- See which quests have already been added (shown with a checkmark)

### Progress
The Progress page gives a full overview of the player's journey:
- Tier badge showing current tier (Iron, Bronze, Silver, Gold, Diamond)
- Total XP, level, streak, and habit count stats
- XP progress bar showing how far into the current level they are
- A full level journey list showing all 15 levels and which have been reached

### Trophy Cabinet
The Trophy Cabinet displays all 11 trophies in the game:
- Earned trophies are shown with a gold trophy icon and colour
- Locked trophies are shown with a padlock icon
- Filter by All, Earned, Locked, Tier, or Streak
- Stats row showing earned count, locked count, and completion percentage

### Settings
The Settings page allows users to:
- Set their username (saves automatically on blur)
- Enable or disable daily reminder notifications
- Set a custom reminder time (hour and minute)
- View app version and build info
- Reset all progress with a confirmation alert

---

## Gameplay & Progression

### Habits
- Add habits from the Quests page
- Tick habits off on the Dashboard each day to earn XP
- Habits reset automatically each day so they can be completed again
- Each habit awards between 30 and 120 XP depending on difficulty

### XP & Levels
The game has 15 levels with increasing XP thresholds:

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Newcomer | 0 |
| 2 | Apprentice | 100 |
| 3 | Initiate | 200 |
| 4 | Squire | 400 |
| 5 | Scout | 600 |
| 6 | Warrior | 900 |
| 7 | Knight | 1200 |
| 8 | Champion | 1600 |
| 9 | Guardian | 2100 |
| 10 | Hero | 2700 |
| 11 | Veteran | 3400 |
| 12 | Commander | 4200 |
| 13 | Legend | 5100 |
| 14 | Mythic | 6100 |
| 15 | Immortal | 7200 |

### Level-Up Rewards
Reaching certain levels unlocks cosmetic rewards for the hero character:

| Level | Reward |
|-------|--------|
| 1 | Starter trophy |
| 2 | Blue hero colour |
| 3 | Red hero colour |
| 4 | Bronze armour + Bronze trophy |
| 7 | Silver armour + Silver trophy |
| 9 | Cape accessory |
| 10 | Gold armour + Gold trophy |
| 12 | Sword accessory |
| 13 | Diamond armour + Diamond trophy |
| 15 | Rainbow aura + Immortal crown |

### Streaks
- Completing at least one habit per day builds a streak
- Streaks increment once per day regardless of how many habits are completed
- Missing a day resets the streak to 1

### Trophies
Trophies are awarded for two things — reaching level milestones and maintaining streaks:

| Trophy | How to earn |
|--------|-------------|
| First step | Complete your first habit |
| Bronze/Silver/Gold/Diamond hero | Reach the corresponding tier |
| Immortal crown | Reach level 15 |
| On a roll | 3-day streak |
| Week warrior | 7-day streak |
| Fortnight iron | 14-day streak |
| Monthly master | 30-day streak |
| Half century | 50-day streak |

---

## Technical Highlights

### Angular Standalone Components
All pages and components use Angular standalone architecture with no NgModules. 
Each component declares its own imports explicitly.

### HTTP + Observable
The Quests page fetches habit data from a raw GitHub JSON file using 
`HttpClient.get<Quest[]>()` which returns an `Observable`. The Observable is 
subscribed to in the component — the service remains stateless and reusable. 
`catchError` handles network failures gracefully by returning an empty array.

### Ionic Storage
All player data including XP, level, streak, trophies, unlocked rewards, and 
hero appearance is persisted using `@ionic/storage-angular`. Habit data is also 
persisted separately. Data survives app restarts and browser refreshes.

### Capacitor Local Notifications
The Settings page uses `@capacitor/local-notifications` to schedule a daily 
reminder notification at a user-defined time. The plugin works on both mobile 
devices and Windows desktop. Permissions are requested on first use.

### Angular Router with Lazy Loading
All 5 pages use lazy-loaded routes via `loadComponent` in the router 
configuration. Pages only load when navigated to, improving initial load time.

### Data Binding
The app demonstrates multiple forms of Angular data binding:
- **Interpolation** — `{{ playerService.profile.xp }}` for displaying data
- **Property binding** — `[style.width]="xpPercent + '%'"` for the XP bar
- **Event binding** — `(click)="toggleHabit(habit)"` for habit completion
- **Two-way binding** — `[(ngModel)]="username"` on the Settings inputs
- **Class binding** — `[class.done]="habit.completedToday"` for completed habits

### Progressive Web App
The app is configured as a PWA using `@angular/service-worker`. It includes:
- A web app manifest with app name, theme colour, and icons
- A service worker for offline caching of app assets
- Installable on desktop and mobile via the browser install prompt

---

## Project Structure

src/

app/

components/

hero.component.ts              — SVG hero character with dynamic skin/colour/accessories

level-up-modal.component.ts    — Modal shown when player levels up

services/

player.service.ts              — XP, levels, streaks, trophies, hero appearance

habit.service.ts               — CRUD for habits, daily reset logic

quest-api.service.ts           — HTTP Observable fetching quests from GitHub JSON

notification.service.ts        — Capacitor Local Notifications scheduling

dashboard/                       — Home page with hero, habits, stats

quests/                          — Browse and add habits from external API

progress/                        — XP history, level journey, stats

trophies/                        — Trophy cabinet with filters

settings/                        — Username, notifications, reset

tabs/                            — Bottom tab navigation

---

## Notes for Grader

- No code comments are used anywhere in the project in line with the brief requirements
- All pages use standalone components with explicit imports
- The external JSON API is hosted at: `https://raw.githubusercontent.com/LiamAtu/Quest/master/quests.json`
- The Capacitor Local Notifications plugin satisfies the native plugin requirement and works on both mobile and Windows desktop
- The app is deployed as a PWA at: `https://quests-2e4cb.web.app`
- All data binding requirements are met — interpolation, property binding, event binding, and two-way binding are all demonstrated across the app
