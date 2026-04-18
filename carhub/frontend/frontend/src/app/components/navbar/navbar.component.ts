import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="page-container nav-inner">
        <a routerLink="/home" class="logo" aria-label="CarHub">
          <span class="logo-text">CarHub</span>
        </a>

        <div class="nav-links">
          <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Главная</a>
          <a routerLink="/cars" routerLinkActive="active">Объявления</a>
          <a routerLink="/parts" routerLinkActive="active">Запчасти</a>
          <a routerLink="/community" routerLinkActive="active">Сообщество</a>

          @if (isLoggedIn) {
            <a routerLink="/add-car" class="btn-primary nav-cta" routerLinkActive="active-action">Добавить</a>
            <a routerLink="/profile" routerLinkActive="active">{{ username }}</a>
            <button class="btn-secondary nav-button" (click)="logout()">Выйти</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Войти</a>
            <a routerLink="/register" class="btn-secondary nav-register">Регистрация</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 18, 32, 0.9);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(212, 175, 55, 0.12);
    }
    .nav-inner {
      min-height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: var(--text-primary);
    }
    .nav-links {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      flex-wrap: wrap;
    }
    .nav-links a,
    .nav-button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 14px;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 600;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
    }
    .nav-links a::after {
      content: '';
      position: absolute;
      left: 14px;
      right: 14px;
      bottom: 6px;
      height: 2px;
      background: var(--accent-gold);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform var(--transition-base);
    }
    .nav-links a:hover,
    .nav-button:hover,
    .nav-links a.active {
      color: var(--text-primary);
    }
    .nav-links a:hover::after,
    .nav-links a.active::after {
      transform: scaleX(1);
    }
    .nav-register,
    .nav-button {
      border-color: var(--border-color);
    }
    .nav-register:hover,
    .nav-button:hover {
      border-color: var(--accent-gold);
      color: var(--accent-gold);
    }
    .nav-cta {
      min-height: 42px;
      padding: 0 16px;
    }
    .nav-cta::after {
      display: none;
    }
    @media (max-width: 920px) {
      .nav-inner {
        padding-top: 14px;
        padding-bottom: 14px;
        align-items: flex-start;
        flex-direction: column;
      }
      .nav-links {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }

  logout() { this.auth.logout(); }
}
