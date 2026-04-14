import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async requestPermission(): Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  async scheduleDailyReminder(hour: number, minute: number): Promise<void> {
    const granted = await this.requestPermission();
    if (!granted) return;

    await this.cancelAll();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'HabitHero',
          body: 'Your daily quests are waiting. Keep your streak alive!',
          schedule: {
            on: { hour, minute },
            repeats: true,
            allowWhileIdle: true,
          },
          sound: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  }

  async cancelAll(): Promise<void> {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  }

  async checkPermission(): Promise<boolean> {
    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
  }
}