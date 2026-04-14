import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonChip, IonLabel
} from '@ionic/angular/standalone';
import { PlayerService, Trophy } from '../services/player.service';

type FilterType = 'all' | 'unlocked' | 'locked' | 'tier' | 'streak';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.page.html',
  styleUrls: ['./trophies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonChip, IonLabel,
  ],
})
export class TrophiesPage implements OnInit {

  allTrophies: Trophy[] = [];
  activeFilter: FilterType = 'all';
  readonly filters: FilterType[] = ['all', 'unlocked', 'locked', 'tier', 'streak'];

  constructor(private playerService: PlayerService) {}

  async ngOnInit() {
    this.allTrophies = await this.playerService.getAllTrophies();
  }

  async ionViewWillEnter() {
    this.allTrophies = await this.playerService.getAllTrophies();
  }

  get filteredTrophies(): Trophy[] {
    if (this.activeFilter === 'all')      return this.allTrophies;
    if (this.activeFilter === 'unlocked') return this.allTrophies.filter(t => t.unlocked);
    if (this.activeFilter === 'locked')   return this.allTrophies.filter(t => !t.unlocked);
    return this.allTrophies.filter(t => t.type === this.activeFilter);
  }

  get earnedCount(): number {
    return this.allTrophies.filter(t => t.unlocked).length;
  }

  get lockedCount(): number {
    return this.allTrophies.filter(t => !t.unlocked).length;
  }

  get completionPct(): number {
    if (this.allTrophies.length === 0) return 0;
    return Math.round((this.earnedCount / this.allTrophies.length) * 100);
  }
}