import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-movie-detail',
  template: `
    <a class="back-link" routerLink="/">← Back to movies</a>
    @if (loading()) {
      <p class="message">Loading movie...</p>
    } @else if (error()) {
      <p class="message error">{{ error() }}</p>
    } @else if (movie(); as selectedMovie) {
      <article class="detail">
        @if (selectedMovie.poster_path) {
          <img [src]="posterUrl(selectedMovie.poster_path)" [alt]="selectedMovie.title" />
        }
        <div>
          <h1>{{ selectedMovie.title }}</h1>
          <p class="metadata">{{ selectedMovie.release_date }} · Rating {{ selectedMovie.vote_average | number:'1.1-1' }}/10</p>
          <p>{{ selectedMovie.overview || 'No overview available.' }}</p>
          <button type="button" (click)="toggleWishlist(selectedMovie)">
            {{ isInWishlist(selectedMovie.id) ? 'Remove from wishlist' : 'Add to wishlist' }}
          </button>
        </div>
      </article>
    }
  `,
  styles: `
    .back-link { color: #ffe000; display: inline-block; margin-bottom: 2rem; text-decoration: none; }
    .detail { align-items: start; display: grid; gap: 2rem; grid-template-columns: minmax(220px, 320px) 1fr; }
    img { border-radius: .75rem; max-width: 100%; }
    h1 { margin-top: 0; }
    .metadata { color: #ffe000; }
    button { background: #ffe000; border: 0; border-radius: 0; color: #000; cursor: pointer; font-weight: 600; padding: .75rem 1rem; }
    .message { color: #ffe000; }
    .error { color: #ff6868; }
    @media (max-width: 650px) { .detail { grid-template-columns: 1fr; } }
  `,
})
export class MovieDetail {
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly wishlistService = inject(WishlistService);
  protected readonly movie = signal<Movie | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Movie not found.');
      this.loading.set(false);
      return;
    }
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load movie details.');
        this.loading.set(false);
      },
    });
  }

  protected posterUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  protected isInWishlist(id: number): boolean {
    return this.wishlistService.contains(id);
  }

  protected toggleWishlist(movie: Movie): void {
    this.wishlistService.toggle(movie);
  }
}
