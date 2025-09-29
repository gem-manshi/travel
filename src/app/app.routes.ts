import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'travel-journey',
    loadComponent: () =>
      import('../app/travel-journey/travel-journey.component').then(
        (m) => m.TravelJourneyComponent,
      ),
  },
  {
    path: 'travel-summary',
    loadComponent: () =>
      import('../app/travel-summary/travel-summary.component').then(
        (m) => m.TravelSummaryComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'travel-journey',
    pathMatch: 'full',
  },
];
