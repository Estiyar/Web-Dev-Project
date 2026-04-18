import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container profile-page">
      @if (profile) {
        <section class="profile-header surface-card">
          <div class="avatar">{{ profile.username[0].toUpperCase() }}</div>
          <div class="profile-info">
            <p class="eyebrow">Личный кабинет</p>
            <h1>{{ profile.username }}</h1>
            <p>{{ profile.email }}</p>
          </div>
        </section>

        <section class="stats-row">
          <div class="stat-card surface-card">
            <span class="stat-value">{{ profile.my_cars.length }}</span>
            <span class="stat-label">объявлений</span>
          </div>
          <div class="stat-card surface-card">
            <span class="stat-value">{{ favorites.length }}</span>
            <span class="stat-label">в избранном</span>
          </div>
        </section>

        <section class="content-section">
          <div class="section-header">
            <div>
              <p class="eyebrow">Управление</p>
              <h2>Мои объявления</h2>
            </div>
            <a routerLink="/add-car" class="btn-primary">Добавить</a>
          </div>

          @if (profile.my_cars.length === 0) {
            <div class="empty-card surface-card">
              <p>У вас пока нет объявлений.</p>
              <a routerLink="/add-car" class="btn-primary">Разместить автомобиль</a>
            </div>
          } @else {
            <div class="cars-grid">
              @for (car of profile.my_cars; track car.id) {
                <article class="car-card surface-card" [routerLink]="['/cars', car.id]" [state]="{ car: car }">
                  <div class="car-media">
                    @if (car.image_url) {
                      <img [src]="car.image_url" [alt]="car.title" />
                    } @else {
                      <div class="media-fallback">CarHub</div>
                    }
                  </div>
                  <div class="car-body">
                    <div class="car-card-header">
                      <h3>{{ car.title }}</h3>
                      <button class="card-action danger-button" type="button" (click)="deleteCar(car.id, $event)">Удалить</button>
                    </div>
                    <p class="price">{{ car.price | number }} ₸</p>
                    <span class="meta">{{ car.city }}</span>
                  </div>
                </article>
              }
            </div>
          }
        </section>

        @if (error) {
          <div class="error-box">{{ error }}</div>
        }

        <section class="content-section">
          <div class="section-header">
            <div>
              <p class="eyebrow">Коллекция</p>
              <h2>Избранное</h2>
            </div>
          </div>

          @if (favorites.length === 0) {
            <div class="empty-card surface-card">
              <p>В избранном пока нет объявлений.</p>
            </div>
          } @else {
            <div class="cars-grid">
              @for (fav of favorites; track fav.id) {
                <article class="car-card surface-card" [routerLink]="['/cars', fav.car_detail.id]" [state]="{ car: fav.car_detail }">
                  <div class="car-media">
                    @if (fav.car_detail.image_url) {
                      <img [src]="fav.car_detail.image_url" [alt]="fav.car_detail.title" />
                    } @else {
                      <div class="media-fallback">CarHub</div>
                    }
                  </div>
                  <div class="car-body">
                    <h3>{{ fav.car_detail.title }}</h3>
                    <p class="price">{{ fav.car_detail.price | number }} ₸</p>
                  </div>
                </article>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .profile-page,
    .content-section {
      display: grid;
      gap: 18px;
    }
    .profile-page {
      gap: 22px;
    }
    .profile-header {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .avatar {
      width: 76px;
      height: 76px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.28), rgba(212, 175, 55, 0.12));
      color: var(--accent-gold);
      font-size: 28px;
      font-weight: 800;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
    .eyebrow {
      margin-bottom: 8px;
      color: var(--accent-gold);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
    }
    .profile-info h1,
    .section-header h2 {
      font-size: 30px;
      letter-spacing: -0.04em;
    }
    .profile-info p:last-child {
      color: var(--text-secondary);
    }
    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .stat-card {
      padding: 22px;
      display: grid;
      gap: 8px;
    }
    .stat-value {
      font-size: 30px;
      font-weight: 800;
    }
    .stat-label {
      color: var(--text-secondary);
      font-size: 13px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: end;
    }
    .cars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 18px;
    }
    .car-card {
      overflow: hidden;
      cursor: pointer;
    }
    .car-card:hover {
      transform: translateY(-3px);
      border-color: rgba(212, 175, 55, 0.55);
      box-shadow: var(--shadow-card);
    }
    .car-media {
      height: 180px;
      background: var(--bg-elevated);
      overflow: hidden;
    }
    .car-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .media-fallback {
      display: grid;
      place-items: center;
      height: 100%;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-weight: 700;
    }
    .car-body {
      padding: 18px;
    }
    .car-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }
    .car-body h3 {
      margin-bottom: 0;
      font-size: 18px;
      color: var(--text-primary);
      line-height: 1.35;
    }
    .card-action {
      flex-shrink: 0;
      min-height: auto;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      transition: var(--transition-base);
    }
    .danger-button {
      border: 1px solid rgba(239, 68, 68, 0.28);
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
    }
    .danger-button:hover {
      border-color: rgba(239, 68, 68, 0.55);
      background: rgba(239, 68, 68, 0.16);
      color: #fecaca;
    }
    .price {
      margin-bottom: 8px;
      font-size: 22px;
      font-weight: 800;
    }
    .meta,
    .empty-card p {
      color: var(--text-secondary);
    }
    .empty-card {
      padding: 24px;
      display: grid;
      gap: 14px;
      justify-items: start;
    }
    .error-box {
      border-radius: 12px;
      padding: 14px 16px;
      border: 1px solid rgba(239, 68, 68, 0.26);
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
      font-size: 14px;
    }
    @media (max-width: 760px) {
      .stats-row,
      .section-header {
        grid-template-columns: 1fr;
        display: grid;
      }
      .profile-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: any = null;
  favorites: any[] = [];
  error = '';
  sub?: Subscription;

  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.loadData();
      } else {
        this.profile = null;
        this.favorites = [];
      }
    });

    if (this.auth.isLoggedIn()) {
      this.loadData();
    }
  }

  loadData() {
    this.error = '';

    this.auth.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: () => {
        this.profile = null;
      }
    });

    this.api.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
      },
      error: () => {
        this.favorites = [];
      }
    });
  }

  deleteCar(id: number, event: Event) {
    event.stopPropagation();
    this.error = '';

    if (!window.confirm('Удалить это объявление?')) {
      return;
    }

    this.api.deleteCar(id).subscribe({
      next: () => {
        this.profile.my_cars = this.profile.my_cars.filter((car: any) => car.id !== id);
      },
      error: (err) => {
        this.error = err?.error?.detail || 'Не удалось удалить объявление.';
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
