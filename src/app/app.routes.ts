import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/movie-list/movie-list').then((module) => module.MovieList),
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-detail/movie-detail').then((module) => module.MovieDetail),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./components/wish-list/wish-list').then((module) => module.WishList),
  },
  { path: '**', redirectTo: '' },
];
