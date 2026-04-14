import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonButton, IonIcon, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophyOutline, shirtOutline, colorPaletteOutline, giftOutline } from 'ionicons/icons';
import { Reward } from '../services/player.service';

@Component({
  selector: 'app-level-up-modal',
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon],
  templateUrl: './level-up-modal.component.html',
  styleUrls: ['./level-up-modal.component.scss'],
})
export class LevelUpModalComponent implements OnInit {

  @Input() level!: number;
  @Input() levelTitle!: string;
  @Input() rewards!: Reward[];
  @Input() currentXp!: number;
  @Input() nextLevelXp!: number;

  xpPercent = 0;

  readonly TIER_COLOURS: Record<number, any> = {
    4:  { badge: '#FAECE7', fg: '#712B13', light: '#F5C4B3' },
    7:  { badge: '#E6F1FB', fg: '#0C447C', light: '#B5D4F4' },
    10: { badge: '#FAEEDA', fg: '#633806', light: '#FAC775' },
    13: { badge: '#EEEDFE', fg: '#3C3489', light: '#CECBF6' },
    15: { badge: '#EEEDFE', fg: '#26215C', light: '#AFA9EC' },
  };

  readonly DEFAULT_COLOUR = { badge: '#EEEDFE', fg: '#3C3489', light: '#CECBF6' };

  constructor(private modalCtrl: ModalController) {
    addIcons({ trophyOutline, shirtOutline, colorPaletteOutline, giftOutline });
  }

  ngOnInit() {
    setTimeout(() => {
      this.xpPercent = Math.round((this.currentXp / this.nextLevelXp) * 100);
    }, 500);
  }

  get tierColour() {
    return this.TIER_COLOURS[this.level] ?? this.DEFAULT_COLOUR;
  }

  get xpDisplay() {
    return this.level < 15
      ? `${this.currentXp} / ${this.nextLevelXp} XP`
      : 'Max level!';
  }

  iconForType(type: string): string {
    const icons: Record<string, string> = {
      trophy:    'trophy-outline',
      skin:      'shirt-outline',
      colour:    'color-palette-outline',
      accessory: 'gift-outline',
    };
    return icons[type] ?? 'gift-outline';
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}