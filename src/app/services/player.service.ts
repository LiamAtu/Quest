import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface HeroAppearance {
  skin: 'default' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'rainbow';
  colour: string;
  accessories: string[];
}

export interface Reward {
  type: 'skin' | 'colour' | 'trophy' | 'accessory';
  id: string;
  label: string;
}

export interface Trophy {
  id: string;
  name: string;
  desc: string;
  type: 'start' | 'tier' | 'streak';
  unlocked: boolean;
  icon: string;
  bg: string;
  fg: string;
}

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  title: string;
  currentStreak: number;
  lastCompletedDate: string;
  trophies: string[];
  unlockedRewards: string[];
  appearance: HeroAppearance;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private storageKey = 'player_profile';

  profile: PlayerProfile = this.defaultProfile();

  readonly LEVELS = [
    { l: 1,  name: 'Newcomer',   xp: 0    },
    { l: 2,  name: 'Apprentice', xp: 100  },
    { l: 3,  name: 'Initiate',   xp: 200  },
    { l: 4,  name: 'Squire',     xp: 400  },
    { l: 5,  name: 'Scout',      xp: 600  },
    { l: 6,  name: 'Warrior',    xp: 900  },
    { l: 7,  name: 'Knight',     xp: 1200 },
    { l: 8,  name: 'Champion',   xp: 1600 },
    { l: 9,  name: 'Guardian',   xp: 2100 },
    { l: 10, name: 'Hero',       xp: 2700 },
    { l: 11, name: 'Veteran',    xp: 3400 },
    { l: 12, name: 'Commander',  xp: 4200 },
    { l: 13, name: 'Legend',     xp: 5100 },
    { l: 14, name: 'Mythic',     xp: 6100 },
    { l: 15, name: 'Immortal',   xp: 7200 },
  ];

  readonly LEVEL_REWARDS: Record<number, Reward[]> = {
    1:  [{ type: 'trophy',    id: 'starter', label: 'Starter trophy'      }],
    2:  [{ type: 'colour',    id: 'blue',    label: 'Blue hero colour'     }],
    3:  [{ type: 'colour',    id: 'red',     label: 'Red hero colour'      }],
    4:  [{ type: 'skin',      id: 'bronze',  label: 'Bronze armour'        },
         { type: 'trophy',    id: 'bronze',  label: 'Bronze tier trophy'   }],
    6:  [{ type: 'accessory', id: 'shield',  label: 'Shield accessory'     }],
    7:  [{ type: 'skin',      id: 'silver',  label: 'Silver armour'        },
         { type: 'trophy',    id: 'silver',  label: 'Silver tier trophy'   }],
    9:  [{ type: 'accessory', id: 'cape',    label: 'Cape accessory'       }],
    10: [{ type: 'skin',      id: 'gold',    label: 'Gold armour'          },
         { type: 'trophy',    id: 'gold',    label: 'Gold tier trophy'     }],
    12: [{ type: 'accessory', id: 'sword',   label: 'Sword accessory'      }],
    13: [{ type: 'skin',      id: 'diamond', label: 'Diamond armour'       },
         { type: 'trophy',    id: 'diamond', label: 'Diamond tier trophy'  }],
    15: [{ type: 'skin',      id: 'rainbow', label: 'Rainbow aura'         },
         { type: 'trophy',    id: 'immortal',label: 'Immortal crown'       }],
  };

  readonly ALL_TROPHIES: Trophy[] = [
    { id: 'starter',  name: 'First step',     desc: 'Complete your first habit',    type: 'start',  unlocked: false, icon: 'S', bg: '#E1F5EE', fg: '#085041' },
    { id: 'bronze',   name: 'Bronze hero',    desc: 'Reach Bronze tier (level 4)',  type: 'tier',   unlocked: false, icon: 'B', bg: '#F5C4B3', fg: '#712B13' },
    { id: 'streak3',  name: 'On a roll',      desc: '3-day streak achieved',        type: 'streak', unlocked: false, icon: '3', bg: '#FAEEDA', fg: '#633806' },
    { id: 'streak7',  name: 'Week warrior',   desc: '7-day streak achieved',        type: 'streak', unlocked: false, icon: '7', bg: '#FAEEDA', fg: '#633806' },
    { id: 'silver',   name: 'Silver hero',    desc: 'Reach Silver tier (level 7)',  type: 'tier',   unlocked: false, icon: 'S', bg: '#B5D4F4', fg: '#0C447C' },
    { id: 'streak14', name: 'Fortnight iron', desc: '14-day streak achieved',       type: 'streak', unlocked: false, icon: '14',bg: '#FAEEDA', fg: '#633806' },
    { id: 'gold',     name: 'Gold hero',      desc: 'Reach Gold tier (level 10)',   type: 'tier',   unlocked: false, icon: 'G', bg: '#FAC775', fg: '#633806' },
    { id: 'streak30', name: 'Monthly master', desc: '30-day streak achieved',       type: 'streak', unlocked: false, icon: '30',bg: '#FAEEDA', fg: '#633806' },
    { id: 'diamond',  name: 'Diamond hero',   desc: 'Reach Diamond tier (level 13)',type: 'tier',   unlocked: false, icon: 'D', bg: '#CECBF6', fg: '#3C3489' },
    { id: 'streak50', name: 'Half century',   desc: '50-day streak achieved',       type: 'streak', unlocked: false, icon: '50',bg: '#FAEEDA', fg: '#633806' },
    { id: 'immortal', name: 'Immortal crown', desc: 'Reach max level (level 15)',   type: 'tier',   unlocked: false, icon: 'I', bg: '#AFA9EC', fg: '#26215C' },
  ];

  constructor(private storage: Storage) {}

  async initialise() {
    await this.storage.create();
    const saved = await this.storage.get(this.storageKey);
    if (saved) {
      this.profile = saved;
    } else {
      this.profile = this.defaultProfile();
      await this.saveProfile();
    }
  }

  async addXp(amount: number): Promise<Reward[]> {
    const newRewards: Reward[] = [];
  
    if (this.profile.xp === 0) {
      await this.awardTrophy('starter');
      newRewards.push({ type: 'trophy', id: 'starter', label: 'Starter trophy' });
    }
  
    this.profile.xp += amount;
  
    while (
      this.profile.level < 15 &&
      this.profile.xp >= this.xpRequired(this.profile.level + 1)
    ) {
      this.profile.level++;
      this.profile.title = this.LEVELS[this.profile.level - 1].name;
      const rewards = this.LEVEL_REWARDS[this.profile.level] ?? [];
      for (const reward of rewards) {
        this.profile.unlockedRewards.push(reward.id);
        if (reward.type === 'trophy') await this.awardTrophy(reward.id);
        if (reward.type === 'skin')   this.profile.appearance.skin = reward.id as any;
      }
      newRewards.push(...rewards);
    }
  
    await this.saveProfile();
    return newRewards;
  }

  async updateStreak() {
    const today = new Date().toDateString();
    const last  = this.profile.lastCompletedDate;
  
    if (last === today) return;
  
    const yesterday = new Date(Date.now() - 86400000).toDateString();
  
    if (last === yesterday) {
      this.profile.currentStreak++;
    } else {
      this.profile.currentStreak = 1;
    }
  
    this.profile.lastCompletedDate = today;
    await this.checkStreakTrophies();
    await this.saveProfile();
  }

  async getAllTrophies(): Promise<Trophy[]> {
    const earned = this.profile.trophies ?? [];
    return this.ALL_TROPHIES.map(t => ({ ...t, unlocked: earned.includes(t.id) }));
  }

  xpRequired(level: number): number {
    const entry = this.LEVELS.find(l => l.l === level);
    return entry ? entry.xp : 99999;
  }

  xpPercent(): number {
    const cur = this.xpRequired(this.profile.level);
    const nxt = this.xpRequired(this.profile.level + 1);
    if (nxt === 99999) return 100;
    return Math.round(((this.profile.xp - cur) / (nxt - cur)) * 100);
  }

  private async awardTrophy(id: string) {
    if (!this.profile.trophies.includes(id)) {
      this.profile.trophies.push(id);
    }
  }

  private async checkStreakTrophies() {
    const milestones: Record<number, string> = {
      3: 'streak3', 7: 'streak7', 14: 'streak14',
      30: 'streak30', 50: 'streak50'
    };
    const trophy = milestones[this.profile.currentStreak];
    if (trophy && !this.profile.trophies.includes(trophy)) {
      await this.awardTrophy(trophy);
    }
  }

  private async saveProfile() {
    await this.storage.set(this.storageKey, this.profile);
  }

  private defaultProfile(): PlayerProfile {
    return {
      username: 'Hero',
      level: 1,
      xp: 0,
      title: 'Newcomer',
      currentStreak: 0,
      lastCompletedDate: '',
      trophies: [],
      unlockedRewards: [],
      appearance: {
        skin: 'default',
        colour: '#7F77DD',
        accessories: [],
      },
    };
  }
}