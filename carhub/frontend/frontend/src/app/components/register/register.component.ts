import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card surface-card">
        <div class="brand">Car<span>Hub</span></div>
        <h1>Регистрация</h1>
        <p class="subtitle">Создайте аккаунт, чтобы размещать объявления и управлять избранным.</p>

        @if (error) {
          <div class="error-box">{{ error }}</div>
        }

        <div class="form-group">
          <label>Логин</label>
          <input type="text" [(ngModel)]="form.username" placeholder="Введите логин" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="form.email" placeholder="example@mail.com" />
        </div>

        <div class="form-group">
          <label>Пароль</label>
          <input type="password" [(ngModel)]="form.password" placeholder="Минимум 6 символов" />
        </div>

        <div class="form-group">
          <label>Повторите пароль</label>
          <input type="password" [(ngModel)]="form.password_confirm" placeholder="Повторите пароль" />
        </div>

        <button class="btn-primary auth-button" (click)="register()">Создать аккаунт</button>
        <p class="switch">Уже есть аккаунт? <a routerLink="/login">Войти</a></p>
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
      width: min(100%, 480px);
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
export class RegisterComponent {
  form = { username: '', email: '', password: '', password_confirm: '' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = '';
    if (!this.form.username || !this.form.email || !this.form.password) { this.error = 'Заполните все поля.'; return; }
    if (this.form.password !== this.form.password_confirm) { this.error = 'Пароли не совпадают.'; return; }
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.error = this.extractErrorMessage(err);
      }
    });
  }

  private extractErrorMessage(err: any) {
    const msg = err?.error;
    const firstFieldError = (value: any) => Array.isArray(value) ? value[0] : value;

    return firstFieldError(msg?.username) ||
      firstFieldError(msg?.email) ||
      firstFieldError(msg?.password) ||
      firstFieldError(msg?.password_confirm) ||
      firstFieldError(msg?.non_field_errors) ||
      msg?.detail ||
      'Ошибка регистрации.';
  }
}
