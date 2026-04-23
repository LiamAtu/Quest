import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, listOutline, trendingUpOutline, 
  trophyOutline, settingsOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    addIcons({ 
      homeOutline, 
      listOutline, 
      trendingUpOutline, 
      trophyOutline, 
      settingsOutline 
    });
  }
}