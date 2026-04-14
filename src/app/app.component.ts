import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PlayerService } from './services/player.service';
import { HabitService } from './services/habit.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private playerService: PlayerService,
    private habitService: HabitService,
  ) {}

  async ngOnInit() {
    await this.playerService.initialise();
    await this.habitService.initialise();
  }
}