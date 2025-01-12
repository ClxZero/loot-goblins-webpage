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
  // TODO
  // {
  //   path: 'ss',
  //   loadComponent: () =>
  //     import('./pages/screenshots/screenshots.component').then(
  //       mod => mod.ScreenshotsComponent
  //     ),
  // },
  // {
  //   path: 'hives',
  //   loadComponent: () =>
  //     import('./pages/hives/hives.component').then(mod => mod.HivesComponent),
  // },
  // {
  //   path: 'record',
  //   loadComponent: () =>
  //     import('./pages/record/record.component').then(
  //       mod => mod.RecordComponent
  //     ),
  // },
  // {
  //   path: 'hof',
  //   loadComponent: () =>
  //     import('./pages/hof/hof.component').then(mod => mod.HofComponent),
  // },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        mod => mod.NotFoundComponent
      ),
  },
];
