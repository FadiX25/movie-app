import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  imports: [RouterLink, SearchBar],
  selector: 'app-movie-list',
  template: `
    <section>
      <h1>Movie List</h1>
      <app-search-bar (searched)="searchMovies($event)"></app-search-bar>
      @if (loading()) {
        <p class="message">Loading movies...</p>
      } @else if (error()) {
        <p class="message error">{{ error() }}</p>
      } @else if (movies().length === 0) {
        <p class="message">No movies found.</p>
      } @else {
        <div class="movie-grid">
          @for (movie of movies(); track movie.id) {
            <a class="movie-card" [routerLink]="['/movie', movie.id]">
              @if (movie.poster_path) {
                <img [src]="posterUrl(movie.poster_path)" [alt]="movie.title" />
              } @else {
                <div class="poster-placeholder">No poster</div>
              }
              <div class="movie-content">
                <h2>{{ movie.title }}</h2>
                <p>{{ movie.release_date || 'Release date unavailable' }}</p>
              </div>
            </a>
          }
        </div>
      }
    </section>
  `,
  styles: `
    h1 { margin-top: 0; }
    .movie-grid { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
    .movie-card { background: #ffe000; color: #000; overflow: hidden; text-decoration: none; transition: transform .2s; }
    .movie-card:hover { transform: translateY(-4px); }
    img, .poster-placeholder { aspect-ratio: 2 / 3; display: block; object-fit: cover; width: 100%; }
    .poster-placeholder { align-items: center; background: #222; color: #ffe000; display: flex; justify-content: center; }
    .movie-content { border-top: 2px solid #000; padding: .65rem; text-align: center; }
    h2 { font-size: .95rem; margin: 0; }
    .movie-content p { margin: .35rem 0 0; }
    .message { color: #ffe000; }
    .error { color: #ff6868; }
  `,
})
export class MovieList {
  private readonly movieService = inject(MovieService);
  protected readonly movies = signal<Movie[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    this.loadMovies();
  }

  protected searchMovies(title: string): void {
    if (!title) {
      this.loadMovies();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.movieService.getMovieByTitle(title).subscribe({
      next: (response) => {
        this.movies.set(response.results);
        this.loading.set(false);
      },
      error: () => this.showError(),
    });
  }

  protected posterUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  private loadMovies(): void {
    this.loading.set(true);
    this.movieService.getMovieList().subscribe({
      next: (response) => {
        this.movies.set(response.results);
        this.loading.set(false);
      },
      error: () => this.showError(),
    });
  }

  private showError(): void {
    this.error.set('Unable to load movies. Please try again.');
    this.loading.set(false);
  }
}
