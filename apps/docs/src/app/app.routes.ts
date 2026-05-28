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
        loadComponent: () => import('./docs/button/button.doc'),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];
