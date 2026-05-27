import type { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home'),
  },
  {
    path: 'components',
    children: [
      {
        path: 'button',
        loadComponent: () => import('./components/button/button.page'),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];
