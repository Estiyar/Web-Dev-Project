import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card surface-card">
        <div class="brand">Car<span>Hub</span></div>
        <h1>Вход в аккаунт</h1>
        <p class="subtitle">Получите доступ к объявлениям, избранному и управлению своим профилем.</p>

        @if (error) {
          <div class="error-box">{{ error }}</div>
        }

        <div class="form-group">
          <label>Логин</label>
          <input type="text" [(ngModel)]="username" placeholder="Введите логин" (keyup.enter)="login()" />
        </div>

        <div class="form-group">
          <label>Пароль</label>
          <input type="password" [(ngModel)]="password" placeholder="Введите пароль" (keyup.enter)="login()" />
        </div>

        <button class="btn-primary auth-button" (click)="login()">Войти</button>

        <p class="switch">Нет аккаунта? <a routerLink="/register">Создать</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 180px);
      display: grid;
      place-items: center;
      padding: 20px;
    }
    .auth-card {
      width: min(100%, 460px);
      padding: 32px;
    }
    .brand {
      margin-bottom: 18px;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.04em;
    }
    .brand span {
      color: var(--accent-gold);
    }
    h1 {
      margin-bottom: 10px;
      font-size: 30px;
      letter-spacing: -0.04em;
    }
    .subtitle,
    .switch {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.7;
    }
    .subtitle {
      margin-bottom: 22px;
    }
    .switch {
      margin-top: 18px;
    }
    .switch a {
      color: var(--accent-gold);
      font-weight: 700;
    }
    .form-group {
      display: grid;
      gap: 8px;
      margin-bottom: 14px;
    }
    label {
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
    }
    .auth-button {
      width: 100%;
      margin-top: 8px;
    }
    .error-box {
      margin-bottom: 16px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(239, 68, 68, 0.26);
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
      font-size: 14px;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    if (!this.username || !this.password) { this.error = 'Введите логин и пароль.'; return; }
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        const msg = err?.error;
        this.error =
          (Array.isArray(msg?.non_field_errors) ? msg.non_field_errors[0] : msg?.non_field_errors) ||
          (Array.isArray(msg?.username) ? msg.username[0] : msg?.username) ||
          msg?.detail ||
          'Неверный логин или пароль.';
      }
    });
  }
}
