import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="home-page">
      <section class="hero">
        <div class="page-container hero-inner">
          <div class="hero-copy">
            <p class="eyebrow">ВСЕ ПРО АВТО В ОДНОМ МЕСТЕ</p>
            <h1>Покупай, продавай и общайся об автомобилях</h1>
            <p class="hero-text">
              Объявления, удобный поиск и помощь от сообщества — в одном сервисе
            </p>
          </div>

          <div class="hero-search surface-card">
            <div class="search-grid">
              <div class="field">
                <label>Поиск по марке или модели</label>
                <input type="text" [(ngModel)]="searchQuery" placeholder="Toyota Camry, BMW X5..." />
              </div>
              <div class="field">
                <label>Город</label>
                <input type="text" [(ngModel)]="cityQuery" placeholder="Алматы, Астана..." />
              </div>
              <button class="btn-primary search-btn" (click)="onSearch()">Найти автомобиль</button>
            </div>
          </div>
        </div>
      </section>

      <section class="page-container content-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Категории</p>
            <h2>Подберите автомобиль под себя</h2>
          </div>
        </div>

        <div class="categories-grid">
          @if (brandsLoading) {
            @for (item of [1, 2, 3, 4]; track item) {
              <div class="category-card surface-card category-skeleton">
                <span class="skeleton-line skeleton-title"></span>
                <span class="skeleton-line skeleton-link"></span>
              </div>
            }
          } @else if (brands.length === 0) {
            <div class="empty-note surface-card">Нет доступных брендов</div>
          } @else {
            @for (brand of brands; track brand) {
              <button class="category-card surface-card" (click)="openBrand(brand)">
                <span class="category-title">{{ brand }}</span>
                <span class="category-link">Смотреть объявления</span>
              </button>
            }
          }
        </div>
      </section>

      <section class="page-container content-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Свежие предложения</p>
            <h2>Новые объявления на CarHub</h2>
          </div>
          <a routerLink="/cars" class="section-link">Все объявления</a>
        </div>

        @if (loading) {
          <div class="empty-note surface-card">Загрузка объявлений...</div>
        } @else if (recentCars.length === 0) {
          <div class="empty-note surface-card">Объявлений пока нет. Зарегистрируйтесь и добавьте первое объявление.</div>
        } @else {
          <div class="cars-grid">
            @for (car of recentCars; track car.id) {
              <article class="car-card surface-card" [routerLink]="['/cars', car.id]" [state]="{ car: car }">
                <div class="car-media">
                  @if (car.image_url) {
                    <img [src]="car.image_url" [alt]="car.title" loading="lazy" decoding="async" />
                  } @else {
                    <div class="media-fallback">CarHub</div>
                  }
                  <span class="condition-pill">{{ car.condition === 'new' ? 'Новый' : 'С пробегом' }}</span>
                </div>
                <div class="car-body">
                  <div class="card-meta">
                    <span>{{ car.brand }}</span>
                    <span>{{ car.city }}</span>
                  </div>
                  <h3>{{ car.title }}</h3>
                  <p class="price">{{ car.price | number }} ₸</p>
                  <div class="spec-row">
                    <span>{{ car.year }}</span>
                    <span>{{ car.mileage | number }} км</span>
                  </div>
                  <span class="card-open-link">Открыть объявление</span>
                </div>
              </article>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      display: grid;
      gap: 34px;
    }
    .hero {
      padding-top: 22px;
    }
    .hero-inner {
      display: grid;
      gap: 26px;
    }
    .hero-copy {
      max-width: 760px;
    }
    .eyebrow,
    .section-kicker {
      margin-bottom: 12px;
      color: var(--accent-gold);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .hero h1,
    .section-header h2 {
      font-size: clamp(34px, 5vw, 56px);
      line-height: 1.05;
      letter-spacing: -0.04em;
      font-weight: 800;
      color: var(--text-primary);
    }
    .section-header h2 {
      font-size: clamp(24px, 3vw, 34px);
      line-height: 1.15;
    }
    .hero-text,
    .section-header p {
      color: var(--text-secondary);
      font-size: 16px;
      line-height: 1.75;
      max-width: 720px;
    }
    .hero-search {
      padding: 22px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent), var(--bg-section);
    }
    .search-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr) auto;
      gap: 14px;
      align-items: end;
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
    .search-btn {
      min-width: 180px;
    }
    .content-section {
      display: grid;
      gap: 18px;
    }
    .section-header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 20px;
    }
    .section-link {
      color: var(--text-primary);
      font-weight: 600;
    }
    .section-link:hover {
      color: var(--accent-gold);
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
    }
    .category-card {
      padding: 22px;
      text-align: left;
      background: var(--bg-card);
      cursor: pointer;
    }
    .category-card:hover,
    .car-card:hover {
      transform: translateY(-3px);
      border-color: rgba(212, 175, 55, 0.55);
      box-shadow: var(--shadow-card);
    }
    .category-title {
      display: block;
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .category-link {
      color: var(--accent-gold);
      font-size: 13px;
      font-weight: 600;
    }
    .category-skeleton {
      cursor: default;
    }
    .category-skeleton:hover {
      transform: none;
      border-color: var(--border-color);
      box-shadow: var(--shadow-soft);
    }
    .skeleton-line {
      display: block;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14), rgba(255,255,255,0.06));
      background-size: 200% 100%;
      animation: skeleton-shift 1.4s ease infinite;
    }
    .skeleton-title {
      width: 72%;
      height: 18px;
      margin-bottom: 28px;
    }
    .skeleton-link {
      width: 48%;
      height: 12px;
    }
    .cars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px;
    }
    .car-card {
      overflow: hidden;
      cursor: pointer;
      background: var(--bg-card);
    }
    .car-media {
      position: relative;
      height: 204px;
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
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    .condition-pill {
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
      border-radius: 999px;
      padding: 7px 11px;
      font-size: 11px;
      font-weight: 700;
    }
    .car-body {
      padding: 18px;
    }
    .card-meta,
    .spec-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      color: var(--text-secondary);
      font-size: 12px;
    }
    .car-body h3 {
      margin: 10px 0 12px;
      font-size: 18px;
      line-height: 1.35;
      color: var(--text-primary);
    }
    .price {
      margin-bottom: 12px;
      color: var(--text-primary);
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .card-open-link {
      margin-top: 14px;
      color: var(--accent-gold);
      font-size: 13px;
      font-weight: 700;
      text-align: left;
    }
    .card-open-link:hover {
      color: var(--accent-hover);
    }
    .empty-note {
      padding: 26px;
      color: var(--text-secondary);
    }
    @keyframes skeleton-shift {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @media (max-width: 920px) {
      .search-grid {
        grid-template-columns: 1fr;
      }
      .search-btn {
        width: 100%;
      }
      .section-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  brands: string[] = [];
  brandsLoading = true;
  recentCars: any[] = [];
  loading = false;
  searchQuery = '';
  cityQuery = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadBrands();
    this.loadCars();
  }

  onSearch() {
    this.router.navigate(['/cars'], { queryParams: { search: this.searchQuery, city: this.cityQuery } });
  }

  openBrand(brand: string) {
    this.router.navigate(['/cars'], { queryParams: { brand } });
  }

  loadCars() {
    this.loading = true;
    this.api.getCars().subscribe({
      next: (data) => {
        this.recentCars = data.slice(0, 8);
        this.loading = false;
      },
      error: () => {
        this.recentCars = [];
        this.loading = false;
      }
    });
  }

  loadBrands() {
    this.brandsLoading = true;
    this.api.getCategories().subscribe({
      next: (categories) => {
        const names = categories.map((item) => item.name);

        if (names.length > 0) {
          this.brands = this.getUnique(names);
          this.brandsLoading = false;
        } else {
          this.loadBrandsFromCars();
        }
      },
      error: () => {
        this.loadBrandsFromCars();
      }
    });
  }

  loadBrandsFromCars() {
    this.api.getCars().subscribe({
      next: (cars) => {
        this.brands = this.getUnique(cars.map((item) => item.brand));
        this.brandsLoading = false;
      },
      error: () => {
        this.brands = [];
        this.brandsLoading = false;
      }
    });
  }

  getUnique(values: any[]) {
    const list = values
      .filter(value => value)
      .map(value => String(value).trim());

    return [...new Set(list)].sort((a, b) => a.localeCompare(b));
  }
}
