import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Habit {
  id: string;
  title: string;
  category: 'health' | 'mind' | 'body' | 'social';
  xp: number;
  completedToday: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class HabitService {

  private storageKey = 'habits';
  private habits: Habit[] = [];

  constructor(private storage: Storage) {}

  async initialise() {
    const saved = await this.storage.get(this.storageKey);
    if (saved) {
      this.habits = saved;
    } else {
      this.habits = [];
    }
    this.resetDailyCompletions();
  }

  async getHabits(): Promise<Habit[]> {
    return this.habits;
  }

  async addHabit(title: string, category: Habit['category'], xp: number = 20): Promise<void> {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      category,
      xp,
      completedToday: false,
      createdAt: new Date().toISOString(),
    };
    this.habits.push(newHabit);
    await this.save();
  }

  async markComplete(id: string): Promise<void> {
    const habit = this.habits.find(h => h.id === id);
    if (habit) {
      habit.completedToday = true;
      await this.save();
    }
  }

  async removeHabit(id: string): Promise<void> {
    this.habits = this.habits.filter(h => h.id !== id);
    await this.save();
  }

  get completedCount(): number {
    return this.habits.filter(h => h.completedToday).length;
  }

  get totalCount(): number {
    return this.habits.length;
  }

  get allCompletedToday(): boolean {
    return this.habits.length > 0 &&
           this.habits.every(h => h.completedToday);
  }

  private resetDailyCompletions() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('last_reset_date');
    if (lastReset !== today) {
      this.habits.forEach(h => h.completedToday = false);
      localStorage.setItem('last_reset_date', today);
      this.save();
    }
  }

  private async save(): Promise<void> {
    await this.storage.set(this.storageKey, this.habits);
  }
}