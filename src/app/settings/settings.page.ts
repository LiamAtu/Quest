import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonToggle, IonList, IonListHeader, AlertController
} from '@ionic/angular/standalone';
import { PlayerService } from '../services/player.service';
import { NotificationService } from '../services/notification.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonToggle, IonList, IonListHeader,
  ],
})
export class SettingsPage implements OnInit {

  username = '';
  notificationsEnabled = false;
  reminderHour = 9;
  reminderMinute = 0;

  constructor(
    public playerService: PlayerService,
    private notificationService: NotificationService,
    private storage: Storage,
    private alertCtrl: AlertController,
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

  async ionViewWillEnter() {
    this.username = this.playerService.profile.username;
  }

  async saveUsername() {
    this.playerService.profile.username = this.username;
    await this.storage.set('player_profile', this.playerService.profile);
  }

  async toggleNotifications() {
    if (this.notificationsEnabled) {
      await this.notificationService.scheduleDailyReminder(
        this.reminderHour,
        this.reminderMinute,
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
        this.reminderMinute,
      );
      await this.storage.set('reminder_time', {
        hour:   this.reminderHour,
        minute: this.reminderMinute,
      });
    }
  }

  async confirmReset() {
    const alert = await this.alertCtrl.create({
      header: 'Reset all progress?',
      message: 'This will delete all your habits, XP, levels and trophies. This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reset',
          role: 'destructive',
          handler: () => this.resetProgress(),
        },
      ],
    });
    await alert.present();
  }

  private async resetProgress() {
    await this.storage.clear();
    window.location.reload();
  }
}