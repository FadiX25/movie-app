import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-search-bar',
  template: `
    <form class="search-form" (ngSubmit)="submit()">
      <label for="movie-search">Search for a movie</label>
      <div class="search-controls">
        <input id="movie-search" name="title" [(ngModel)]="title" placeholder="Movie title" />
        <button type="submit">Search</button>
      </div>
    </form>
  `,
  styles: `
    .search-form { display: block; margin-bottom: 2rem; }
    label { display: block; font-weight: 600; margin-bottom: .5rem; }
    .search-controls { display: flex; gap: .75rem; }
    input { background: #000; border: 2px solid #ffe000; border-radius: 0; color: #fff; flex: 1; font: inherit; padding: .65rem 1rem; }
    button { background: #ffe000; border: 0; border-radius: 0; color: #000; cursor: pointer; font: inherit; font-weight: 600; padding: .65rem 1.25rem; }
    button:hover { background: #fff000; }
  `,
})
export class SearchBar {
  readonly searched = output<string>();
  protected title = '';

  protected submit(): void {
    this.searched.emit(this.title.trim());
  }
}
