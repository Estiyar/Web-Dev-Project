import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container detail-page">
      @if (loading && !car) {
        <div class="state-card surface-card">Загрузка объявления...</div>
      }

      @if (error && !loading) {
        <div class="error-banner">{{ error }}</div>
      }

      @if (car) {
        <button class="back-link" (click)="router.navigate(['/cars'])">Назад к объявлениям</button>

        <div class="hero-layout">
          <div class="gallery surface-card">
            @if (car.image_url) {
              <img [src]="car.image_url" [alt]="car.title" />
            } @else {
              <div class="media-fallback">CarHub</div>
            }
          </div>

          <div class="summary surface-card">
            <div class="summary-top">
              <span class="pill">{{ car.category_name || 'Категория' }}</span>
              <span class="pill subtle">{{ car.condition === 'new' ? 'Новый' : 'С пробегом' }}</span>
            </div>

            <h1>{{ car.title }}</h1>
            <p class="price">{{ car.price | number }} ₸</p>

            <div class="specs-grid">
              <div class="spec-card">
                <span>Год</span>
                <strong>{{ car.year }}</strong>
              </div>
              <div class="spec-card">
                <span>Пробег</span>
                <strong>{{ car.mileage | number }} км</strong>
              </div>
              <div class="spec-card">
                <span>Город</span>
                <strong>{{ car.city }}</strong>
              </div>
              <div class="spec-card">
                <span>Продавец</span>
                <strong>{{ car.owner_name || 'Пользователь CarHub' }}</strong>
              </div>
              <div class="spec-card">
                <span>Коробка</span>
                <strong>{{ car.transmission || 'Не указано' }}</strong>
              </div>
              <div class="spec-card">
                <span>Двигатель / топливо</span>
                <strong>{{ car.engineVolume || car.engine_volume || '—' }} л · {{ car.fuelType || car.fuel_type || 'Не указано' }}</strong>
              </div>
              <div class="spec-card">
                <span>Состояние</span>
                <strong>{{ car.condition === 'new' ? 'Новый' : 'С пробегом' }}</strong>
              </div>
            </div>

            <div class="summary-actions">
              <button class="btn-primary summary-button" (click)="toggleFavorite()">
                {{ isFavorite ? 'В избранном' : 'Добавить в избранное' }}
              </button>

              @if (isOwner) {
                <button class="delete-button" (click)="deleteCar()">Удалить объявление</button>
              }
            </div>
          </div>
        </div>

        <section class="content-card surface-card">
          <h2>Описание</h2>
          <p>{{ car.description || 'Описание не указано.' }}</p>
        </section>

        <section class="content-card surface-card">
          <div class="reviews-head">
            <h2>Отзывы</h2>
            <span>{{ reviews.length }}</span>
          </div>

          @if (isLoggedIn) {
            <div class="review-form">
              <div class="form-row">
                <div class="field">
                  <label>Оценка</label>
                  <select [(ngModel)]="newReview.rating">
                    @for (r of [1,2,3,4,5]; track r) {
                      <option [value]="r">{{ r }}</option>
                    }
                  </select>
                </div>
              </div>

              @if (reviewError) {
                <div class="error-banner small">{{ reviewError }}</div>
              }

              <textarea [(ngModel)]="newReview.text" placeholder="Оставьте отзыв о продавце или автомобиле" rows="4"></textarea>
              <button class="btn-primary" (click)="submitReview()">Отправить отзыв</button>
            </div>
          } @else {
            <p class="hint-text">Войдите, чтобы оставить отзыв.</p>
          }

          @if (reviews.length === 0) {
            <p class="hint-text">Отзывов пока нет.</p>
          }

          <div class="reviews-list">
            @for (review of reviews; track review.id) {
              <article class="review-card">
                <div class="review-top">
                  <strong>{{ review.username }}</strong>
                  <span>{{ review.created_at | date:'dd.MM.yyyy' }}</span>
                </div>
                <div class="review-rating">Оценка: {{ review.rating }}/5</div>
                <p>{{ review.text }}</p>
              </article>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .detail-page {
      display: grid;
      gap: 20px;
    }
    .state-card,
    .content-card,
    .gallery,
    .summary {
      padding: 24px;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.26);
      color: #fca5a5;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .error-banner.small {
      margin-bottom: 14px;
    }
    .back-link {
      width: fit-content;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 600;
      padding: 0;
    }
    .back-link:hover {
      color: var(--accent-gold);
    }
    .hero-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) 380px;
      gap: 20px;
    }
    .gallery {
      overflow: hidden;
    }
    .gallery img {
      width: 100%;
      height: 100%;
      max-height: 480px;
      object-fit: cover;
      border-radius: 12px;
    }
    .media-fallback {
      min-height: 360px;
      display: grid;
      place-items: center;
      color: var(--text-muted);
      background: var(--bg-elevated);
      border-radius: 12px;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    .summary-top,
    .reviews-head,
    .review-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      padding: 7px 11px;
      border-radius: 999px;
      background: rgba(212, 175, 55, 0.14);
      color: var(--accent-gold);
      border: 1px solid rgba(212, 175, 55, 0.18);
      font-size: 12px;
      font-weight: 700;
    }
    .pill.subtle {
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
    }
    .summary h1 {
      margin: 18px 0 12px;
      font-size: 34px;
      line-height: 1.1;
      letter-spacing: -0.04em;
    }
    .price {
      margin-bottom: 18px;
      font-size: 32px;
      font-weight: 800;
    }
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .spec-card {
      padding: 14px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      display: grid;
      gap: 6px;
    }
    .spec-card span,
    .reviews-head span,
    .hint-text,
    .review-top span,
    .review-rating {
      color: var(--text-secondary);
      font-size: 13px;
    }
    .spec-card strong {
      color: var(--text-primary);
      font-size: 15px;
    }
    .summary-actions {
      display: grid;
      gap: 10px;
    }
    .summary-button,
    .delete-button {
      width: 100%;
    }
    .delete-button {
      min-height: 46px;
      border-radius: 10px;
      border: 1px solid rgba(239, 68, 68, 0.35);
      background: rgba(239, 68, 68, 0.08);
      color: #fca5a5;
      font-weight: 700;
    }
    .delete-button:hover {
      background: rgba(239, 68, 68, 0.14);
      border-color: rgba(239, 68, 68, 0.5);
    }
    .content-card h2 {
      margin-bottom: 14px;
      font-size: 24px;
    }
    .content-card p {
      color: var(--text-secondary);
      line-height: 1.8;
    }
    .review-form {
      display: grid;
      gap: 14px;
      margin: 18px 0 22px;
      padding: 18px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
    }
    .field {
      display: grid;
      gap: 8px;
    }
    .field label {
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
    }
    .reviews-list {
      display: grid;
      gap: 14px;
    }
    .review-card {
      padding: 18px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      display: grid;
      gap: 10px;
    }
    @media (max-width: 980px) {
      .hero-layout {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 640px) {
      .specs-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CarDetailComponent implements OnInit {
  car: any = null;
  reviews: any[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;
  isOwner = false;
  isFavorite = false;
  reviewError = '';
  newReview = { rating: 5, text: '' };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    const navigationCar = history.state?.car || null;
    if (navigationCar && navigationCar.id) {
      this.car = this.prepareCar(navigationCar);
    }

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.loadCar(id);
    });
  }

  toggleFavorite() {
    if (!this.isLoggedIn || !this.car?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.api.toggleFavorite(this.car.id).subscribe({
      next: () => { this.isFavorite = !this.isFavorite; },
      error: () => {}
    });
  }

  submitReview() {
    if (!this.car?.id) {
      return;
    }
    if (!this.newReview.text.trim()) {
      this.reviewError = 'Введите текст отзыва.';
      return;
    }

    this.reviewError = '';
    this.api.createReview({ car: this.car.id, ...this.newReview }).subscribe({
      next: (data) => {
        this.reviews.unshift(data);
        this.newReview = { rating: 5, text: '' };
      },
      error: () => { this.reviewError = 'Ошибка при отправке.'; }
    });
  }

  deleteCar() {
    if (!this.car?.id || !confirm('Удалить это объявление?')) {
      return;
    }

    this.api.deleteCar(this.car.id).subscribe({
      next: () => this.router.navigate(['/cars']),
      error: () => { this.error = 'Ошибка при удалении.'; }
    });
  }

  private loadCar(id: number) {
    this.loading = !this.car || Number(this.car.id) !== id;
    this.error = '';

    if (!this.car || Number(this.car.id) !== id) {
      this.car = null;
    }

    this.reviews = [];
    this.isOwner = false;
    this.isFavorite = false;

    if (!id || Number.isNaN(id)) {
      this.error = 'Объявление не найдено.';
      this.loading = false;
      return;
    }

    this.loadReviews(id);
    this.loadFavorites(id);

    this.api.getCar(id).subscribe({
      next: (data: any) => {
        this.loading = false;

        if (!data || !data.id) {
          this.error = 'Объявление не найдено.';
          return;
        }

        this.car = this.prepareCar(data);

        const user = JSON.parse(localStorage.getItem('user') || 'null');
        this.isOwner = !!user && Number(data.owner) === Number(user.id);
      },
      error: () => {
        this.loading = false;
        this.error = 'Не удалось загрузить объявление.';
      }
    });
  }

  private loadReviews(id: number) {
    this.api.getReviews(id).subscribe({
      next: (data) => {
        this.reviews = Array.isArray(data) ? data : [];
      },
      error: () => {
        this.reviews = [];
      }
    });
  }

  private loadFavorites(id: number) {
    if (!this.isLoggedIn) {
      this.isFavorite = false;
      return;
    }

    this.api.getFavorites().subscribe({
      next: (favs) => {
        this.isFavorite = Array.isArray(favs) && favs.some((f: any) => Number(f.car) === id || Number(f.car_detail?.id) === id);
      },
      error: () => {
        this.isFavorite = false;
      }
    });
  }

  private prepareCar(data: any) {
    return {
      ...data,
      image_url: data?.image_url || data?.image || '',
      description: data?.description || '',
      price: data?.price ?? 0
    };
  }
}
