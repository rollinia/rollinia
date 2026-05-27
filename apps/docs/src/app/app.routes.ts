import type { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home') },
];
