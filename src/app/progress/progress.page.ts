import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/angular/standalone';
import { PlayerService } from '../services/player.service';
import { HabitService } from '../services/habit.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
  ],
})
export class ProgressPage implements OnInit {

  totalHabits = 0;

  constructor(
    public playerService: PlayerService,
    private habitService: HabitService,
  ) {}

  async ngOnInit() {
    this.totalHabits = (await this.habitService.getHabits()).length;
  }

  async ionViewWillEnter() {
    this.totalHabits = (await this.habitService.getHabits()).length;
  }

  get xpPercent(): number {
    return this.playerService.xpPercent();
  }

  get nextLevelXp(): number {
    return this.playerService.xpRequired(this.playerService.profile.level + 1);
  }

  get currentLevelXp(): number {
    return this.playerService.xpRequired(this.playerService.profile.level);
  }

  get xpIntoLevel(): number {
    return this.playerService.profile.xp - this.currentLevelXp;
  }

  get xpNeededForLevel(): number {
    return this.nextLevelXp - this.currentLevelXp;
  }

  get tierName(): string {
    const level = this.playerService.profile.level;
    if (level >= 13) return 'Diamond';
    if (level >= 10) return 'Gold';
    if (level >= 7)  return 'Silver';
    if (level >= 4)  return 'Bronze';
    return 'Iron';
  }

  get tierColour(): string {
    const level = this.playerService.profile.level;
    if (level >= 13) return '#AFA9EC';
    if (level >= 10) return '#EF9F27';
    if (level >= 7)  return '#85B7EB';
    if (level >= 4)  return '#F0997B';
    return '#B4B2A9';
  }

  get levelMilestones() {
    return this.playerService.LEVELS.map(l => ({
      ...l,
      reached: this.playerService.profile.level >= l.l,
      current: this.playerService.profile.level === l.l,
    }));
  }
}