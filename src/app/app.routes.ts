import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'quests',
    loadComponent: () => import('./quests/quests.page').then( m => m.QuestsPage)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress/progress.page').then( m => m.ProgressPage)
  },
  {
    path: 'trophies',
    loadComponent: () => import('./trophies/trophies.page').then( m => m.TrophiesPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
];
