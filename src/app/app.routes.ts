import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'travel-journey',
    loadComponent: () =>
      import('../app/features/travel-jounery/travel-jounery.component').then(
        (m) => m.TravelJouneryComponent,
      ),
  },
  {
    path: 'travel-summary',
    loadComponent: () =>
      import('../app/features/travel-summary/travel-summary.component').then(
        (m) => m.TravelSummaryComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'travel-journey',
    pathMatch: 'full',
  },
];
