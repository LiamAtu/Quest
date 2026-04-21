import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonChip, IonLabel, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline } from 'ionicons/icons';
import { QuestApiService, Quest } from '../services/quest-api.service';
import { HabitService } from '../services/habit.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonChip, IonLabel,
  ],
})
export class QuestsPage implements OnInit {

  quests: Quest[] = [];
  addedIds: string[] = [];
  activeCategory: string = 'all';
  isLoading = true;

  readonly categories = ['all', 'health', 'mind', 'body', 'social'];

  constructor(
    private questApiService: QuestApiService,
    private habitService: HabitService,
    private toastCtrl: ToastController,
  ) {
    addIcons({ addOutline, checkmarkOutline });
  }

  async ngOnInit() {
    this.questApiService.getQuests().subscribe({
      next: (quests) => {
        this.quests = quests;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
    const existing = await this.habitService.getHabits();
    this.addedIds = existing.map(h => h.title);
  }

  get filteredQuests(): Quest[] {
    if (this.activeCategory === 'all') return this.quests;
    return this.quests.filter(q => q.category === this.activeCategory);
  }

  isAdded(quest: Quest): boolean {
    return this.addedIds.includes(quest.title);
  }

  async addQuest(quest: Quest) {
    if (this.isAdded(quest)) return;
    await this.habitService.addHabit(quest.title, quest.category, quest.xp);
    this.addedIds.push(quest.title);
    const toast = await this.toastCtrl.create({
      message: `"${quest.title}" added to your habits!`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}