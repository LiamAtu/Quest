import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton, IonToggle
} from '@ionic/angular/standalone';
import { NotificationService } from '../services/notification.service';
import { PlayerService } from '../services/player.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader,
    IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
    IonButton, IonToggle
  ],
})
export class SettingsPage implements OnInit {

  username = '';
  notificationsEnabled = false;
  reminderHour = 9;
  reminderMinute = 0;

  constructor(
    private notificationService: NotificationService,
    public playerService: PlayerService,
    private storage: Storage,
  ) {}

  async ngOnInit() {
    this.username = this.playerService.profile.username;
    this.notificationsEnabled = await this.notificationService.checkPermission();
    const saved = await this.storage.get('reminder_time');
    if (saved) {
      this.reminderHour   = saved.hour;
      this.reminderMinute = saved.minute;
    }
  }

  async saveUsername() {
    this.playerService.profile.username = this.username;
    await this.storage.set('player_profile', this.playerService.profile);
  }

  async toggleNotifications() {
    if (this.notificationsEnabled) {
      await this.notificationService.scheduleDailyReminder(
        this.reminderHour,
        this.reminderMinute
      );
      await this.storage.set('reminder_time', {
        hour:   this.reminderHour,
        minute: this.reminderMinute,
      });
    } else {
      await this.notificationService.cancelAll();
    }
  }

  async saveReminderTime() {
    if (this.notificationsEnabled) {
      await this.notificationService.scheduleDailyReminder(
        this.reminderHour,
        this.reminderMinute
      );
      await this.storage.set('reminder_time', {
        hour:   this.reminderHour,
        minute: this.reminderMinute,
      });
    }
  }

  async resetProgress() {
    await this.storage.clear();
    window.location.reload();
  }
}