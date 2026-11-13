import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  imports: [RouterLink],
  selector: 'app-wish-list',
  template: `
    <a class="back-link" routerLink="/">← Back to movies</a>
    <h1>Wishlist</h1>
    @if (movies().length === 0) {
      <p>Your wishlist is empty.</p>
    } @else {
      <div class="movie-grid">
        @for (movie of movies(); track movie.id) {
          <a class="movie-card" [routerLink]="['/movie', movie.id]">
            @if (movie.poster_path) {
              <img [src]="posterUrl(movie.poster_path)" [alt]="movie.title" />
            }
            <div class="movie-content">
              <h2>{{ movie.title }}</h2>
              <p>{{ movie.release_date }}</p>
            </div>
          </a>
        }
      </div>
    }
  `,
  styles: `
    .back-link { color: #ffe000; display: inline-block; margin-bottom: 2rem; text-decoration: none; }
    .movie-grid { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
    .movie-card { background: #ffe000; color: #000; overflow: hidden; text-decoration: none; }
    img { aspect-ratio: 2 / 3; display: block; object-fit: cover; width: 100%; }
    .movie-content { border-top: 2px solid #000; padding: .65rem; text-align: center; }
    h2 { font-size: .95rem; margin: 0 0 .35rem; }
    .movie-content p { margin: 0; }
  `,
})
export class WishList {
  private readonly wishlistService = inject(WishlistService);
  protected readonly movies = this.wishlistService.movies;

  protected posterUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
