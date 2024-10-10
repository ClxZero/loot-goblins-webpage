import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(mod => mod.HomeComponent),
  },
  {
    path: 'specs',
    loadComponent: () =>
      import('./pages/specs/specs.component').then(mod => mod.SpecsComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(mod => mod.NotFoundComponent),
  }
];
