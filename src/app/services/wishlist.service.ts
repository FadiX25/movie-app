import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'movie-app-wishlist';
  readonly movies = signal<Movie[]>(this.readMovies());

  toggle(movie: Movie): void {
    this.movies.update((movies) => {
      const exists = movies.some((item) => item.id === movie.id);
      const updated = exists ? movies.filter((item) => item.id !== movie.id) : [...movies, movie];
      this.writeMovies(updated);
      return updated;
    });
  }

  contains(id: number): boolean {
    return this.movies().some((movie) => movie.id === id);
  }

  private readMovies(): Movie[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? (JSON.parse(stored) as Movie[]) : [];
    } catch {
      return [];
    }
  }

  private writeMovies(movies: Movie[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }
}
