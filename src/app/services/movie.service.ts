import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Movie, MovieResponse } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);

  getMovieList(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(environment.apiEndpoints.nowPlaying, {
      params: this.params(),
    });
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiEndpoints.movieDetails}/${id}`, {
      params: this.params(),
    });
  }

  getMovieByTitle(title: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(environment.apiEndpoints.searchMovies, {
      params: this.params({ query: title }),
    });
  }

  private params(extra: Record<string, string> = {}): HttpParams {
    return new HttpParams({ fromObject: { api_key: environment.apiKey, language: 'fr-FR', ...extra } });
  }
}
