import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <main class="page-wrapper">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 220px),
        var(--bg-main);
    }
    .page-wrapper {
      padding: 28px 0 56px;
    }
  `]
})
export class AppComponent {
  constructor() {
    localStorage.removeItem('carhub_cached_cars');
  }
}
