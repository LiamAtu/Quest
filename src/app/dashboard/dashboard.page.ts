import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/angular/standalone';
import { PlayerService } from '../services/player.service';
import { HabitService, Habit } from '../services/habit.service';
import { HeroComponent } from '../components/hero.component';
import { LevelUpModalComponent } from '../components/level-up-modal.component';import { ModalController } from '@ionic/angular/standalone';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon,
    HeroComponent,
  ],
})
export class DashboardPage implements OnInit {

  habits: Habit[] = [];
  xpToday = 0;

  constructor(
    public playerService: PlayerService,
    private habitService: HabitService,
    private modalCtrl: ModalController,

  ) {}

  async ngOnInit() {
    this.habits = await this.habitService.getHabits();
  }

  get timeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  get doneToday(): number {
    return this.habits.filter(h => h.completedToday).length;
  }

  get nextLevelXp(): number {
    return this.playerService.xpRequired(this.playerService.profile.level + 1);
  }

  get xpPercent(): number {
    return this.playerService.xpPercent();
  }

  get weekDays() {
    const today = new Date().getDay();
    return ['M','T','W','T','F','S','S'].map((d, i) => ({
      label: d,
      isToday: i === (today === 0 ? 6 : today - 1),
      completed: i < (today === 0 ? 6 : today - 1),
    }));
  }

  async toggleHabit(habit: Habit) {
    if (habit.completedToday) return;
    habit.completedToday = true;
    this.xpToday += habit.xp;
    await this.habitService.markComplete(habit.id);
    const newRewards = await this.playerService.addXp(habit.xp);
    if (this.habitService.completedCount === 1) {
      await this.playerService.updateStreak();
    }
    if (newRewards.length > 0) {
      await this.showLevelUpModal(newRewards);
    }
  }
  
  private async showLevelUpModal(rewards: any[]) {
    const modal = await this.modalCtrl.create({
      component: LevelUpModalComponent,
      componentProps: {
        level:       this.playerService.profile.level,
        levelTitle:  this.playerService.profile.title,
        rewards,
        currentXp:   this.playerService.profile.xp,
        nextLevelXp: this.nextLevelXp,
      },
      breakpoints:       [0, 0.75],
      initialBreakpoint: 0.75,
    });
    await modal.present();
  }
}