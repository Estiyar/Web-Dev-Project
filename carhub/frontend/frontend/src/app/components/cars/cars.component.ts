import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container cars-page">
      <div class="page-top">
        <div>
          <p class="eyebrow">Marketplace</p>
          <h1>Актуальные объявления</h1>
        </div>
        <span class="count">Найдено: {{ cars.length }}</span>
      </div>

      <div class="layout">
        <aside class="sidebar surface-card">
          <div class="sidebar-header">
            <h2>Фильтры</h2>
            <p>Уточните параметры поиска</p>
          </div>

          <div class="filter-group">
            <label>Поиск</label>
            <input type="text" [(ngModel)]="filters.search" placeholder="Марка, модель, тип кузова..." />
          </div>

          <div class="filter-group">
            <label>Бренд</label>
            <select [(ngModel)]="filters.brand">
              <option value="">Все бренды</option>
              @for (brand of brandOptions; track brand) {
                <option [value]="brand">{{ brand }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <label>Модель</label>
            <input type="text" [(ngModel)]="filters.model" placeholder="Camry, X5, Tucson..." />
          </div>

          <div class="filter-group">
            <label>Город</label>
            <input type="text" [(ngModel)]="filters.city" placeholder="Алматы, Астана..." />
          </div>

          <button class="advanced-toggle" (click)="showAdvanced = !showAdvanced">
            {{ showAdvanced ? 'Скрыть расширенные фильтры' : 'Расширенные фильтры' }}
          </button>

          @if (showAdvanced) {
            <div class="advanced-panel">
              <div class="filter-group">
                <label>Тип кузова</label>
                <select [(ngModel)]="filters.bodyType">
                  <option value="">Любой</option>
                  @for (item of bodyTypeOptions; track item) {
                    <option [value]="item">{{ item }}</option>
                  }
                </select>
              </div>

              <div class="filter-grid">
                <div class="filter-group">
                  <label>Объем от</label>
                  <input type="number" [(ngModel)]="filters.min_engine" placeholder="1.5" step="0.1" />
                </div>
                <div class="filter-group">
                  <label>Объем до</label>
                  <input type="number" [(ngModel)]="filters.max_engine" placeholder="4.0" step="0.1" />
                </div>
              </div>

              <div class="filter-group">
                <label>Топливо</label>
                <select [(ngModel)]="filters.fuelType">
                  <option value="">Любое</option>
                  @for (item of fuelTypeOptions; track item) {
                    <option [value]="item">{{ item }}</option>
                  }
                </select>
              </div>

              <div class="filter-group">
                <label>Коробка</label>
                <select [(ngModel)]="filters.transmission">
                  <option value="">Любая</option>
                  @for (item of transmissionOptions; track item) {
                    <option [value]="item">{{ item }}</option>
                  }
                </select>
              </div>

              <div class="filter-group">
                <label>Привод</label>
                <select [(ngModel)]="filters.drivetrain">
                  <option value="">Любой</option>
                  @for (item of drivetrainOptions; track item) {
                    <option [value]="item">{{ item }}</option>
                  }
                </select>
              </div>

              <div class="filter-group">
                <label>Цвет</label>
                <select [(ngModel)]="filters.color">
                  <option value="">Любой</option>
                  @for (item of colorOptions; track item) {
                    <option [value]="item">{{ item }}</option>
                  }
                </select>
              </div>

              <div class="filter-group">
                <label>Состояние</label>
                <select [(ngModel)]="filters.condition">
                  <option value="">Любое</option>
                  <option value="new">Новый</option>
                  <option value="used">С пробегом</option>
                </select>
              </div>

              <div class="filter-grid">
                <div class="filter-group">
                  <label>Год от</label>
                  <input type="number" [(ngModel)]="filters.year_from" placeholder="2018" />
                </div>
                <div class="filter-group">
                  <label>Год до</label>
                  <input type="number" [(ngModel)]="filters.year_to" placeholder="2025" />
                </div>
              </div>

              <div class="filter-grid">
                <div class="filter-group">
                  <label>Цена от</label>
                  <input type="number" [(ngModel)]="filters.min_price" placeholder="0" />
                </div>
                <div class="filter-group">
                  <label>Цена до</label>
                  <input type="number" [(ngModel)]="filters.max_price" placeholder="999999999" />
                </div>
              </div>

              <div class="filter-grid">
                <div class="filter-group">
                  <label>Пробег от</label>
                  <input type="number" [(ngModel)]="filters.min_mileage" placeholder="0" />
                </div>
                <div class="filter-group">
                  <label>Пробег до</label>
                  <input type="number" [(ngModel)]="filters.max_mileage" placeholder="200000" />
                </div>
              </div>
            </div>
          }

          <div class="sidebar-actions">
            <button class="btn-primary sidebar-button" (click)="applyFilters()">Применить</button>
            <button class="btn-secondary sidebar-button" (click)="resetFilters()">Сбросить</button>
          </div>
        </aside>

        <div class="main">
          @if (loading) {
            <div class="empty-card surface-card">Загрузка объявлений...</div>
          } @else if (cars.length === 0) {
            <div class="empty-card surface-card">
              <p>По выбранным фильтрам ничего не найдено.</p>
              <button class="btn-primary" (click)="resetFilters()">Сбросить фильтры</button>
            </div>
          } @else {
            <div class="cars-grid">
              @for (car of cars; track car.id) {
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
                    <div class="meta-top">
                      <span>{{ car.brand }} {{ car.model }}</span>
                      <span>{{ car.city }}</span>
                    </div>
                    <h3>{{ car.title }}</h3>
                    <p class="price">{{ car.price | number }} ₸</p>
                    <div class="meta-bottom">
                      <span>{{ car.year }}</span>
                      <span>{{ car.mileage | number }} км</span>
                    </div>
                    <div class="detail-row">
                      <span>{{ car.bodyType }}</span>
                      <span>{{ car.engineVolume }} л</span>
                      <span>{{ car.transmission }}</span>
                    </div>
                    <span class="open-link">Открыть объявление</span>
                  </div>
                </article>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cars-page { display: grid; gap: 22px; }
    .page-top, .sidebar-header, .meta-top, .meta-bottom {
      display: flex; justify-content: space-between; gap: 12px; align-items: center;
    }
    .eyebrow {
      margin-bottom: 10px; color: var(--accent-gold); font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;
    }
    .page-top h1 { font-size: 36px; line-height: 1.1; letter-spacing: -0.04em; }
    .count, .sidebar-header p, .meta-top, .meta-bottom, .detail-row {
      color: var(--text-secondary); font-size: 13px;
    }
    .layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 22px; }
    .sidebar { padding: 22px; height: fit-content; }
    .sidebar-header { align-items: flex-start; flex-direction: column; margin-bottom: 18px; }
    .sidebar-header h2 { font-size: 20px; }
    .filter-group { display: grid; gap: 8px; margin-bottom: 14px; }
    .filter-group label { color: var(--text-secondary); font-size: 12px; font-weight: 600; }
    .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .advanced-toggle {
      width: 100%; min-height: 42px; margin-bottom: 14px; border-radius: 10px;
      border: 1px solid var(--border-color); background: rgba(255,255,255,0.02);
      color: var(--text-primary); font-weight: 600;
    }
    .advanced-toggle:hover { border-color: var(--accent-gold); color: var(--accent-gold); }
    .advanced-panel {
      margin-bottom: 10px; padding: 16px; border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
    }
    .sidebar-actions { display: grid; gap: 10px; margin-top: 8px; }
    .sidebar-button { width: 100%; }
    .cars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
    .car-card { overflow: hidden; cursor: pointer; }
    .car-card:hover { transform: translateY(-3px); border-color: rgba(212, 175, 55, 0.52); box-shadow: var(--shadow-card); }
    .car-media { position: relative; height: 194px; background: var(--bg-elevated); overflow: hidden; }
    .car-media img { width: 100%; height: 100%; object-fit: cover; }
    .media-fallback {
      display: grid; place-items: center; height: 100%; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700;
    }
    .condition-pill {
      position: absolute; left: 14px; top: 14px; background: rgba(15, 23, 42, 0.84);
      border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 999px; padding: 7px 11px;
      color: var(--text-primary); font-size: 11px; font-weight: 700;
    }
    .car-body { padding: 18px; }
    .car-body h3 { margin: 10px 0 12px; font-size: 18px; line-height: 1.35; color: var(--text-primary); }
    .price { margin-bottom: 12px; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
    .detail-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
    .open-link {
      margin-top: 14px;
      color: var(--accent-gold);
      font-size: 13px;
      font-weight: 700;
      text-align: left;
    }
    .open-link:hover { color: var(--accent-hover); }
    .empty-card { padding: 28px; display: grid; gap: 16px; justify-items: start; color: var(--text-secondary); }
    @media (max-width: 980px) { .layout { grid-template-columns: 1fr; } }
    @media (max-width: 640px) {
      .page-top, .filter-grid { grid-template-columns: 1fr; display: grid; }
    }
  `]
})
export class CarsComponent implements OnInit {
  cars: any[] = [];
  loading = false;
  showAdvanced = false;

  filters = {
    search: '',
    category: '',
    brand: '',
    model: '',
    city: '',
    bodyType: '',
    min_engine: '',
    max_engine: '',
    fuelType: '',
    transmission: '',
    drivetrain: '',
    color: '',
    year_from: '',
    year_to: '',
    min_price: '',
    max_price: '',
    min_mileage: '',
    max_mileage: '',
    condition: ''
  };

  brandOptions: string[] = [];
  bodyTypeOptions: string[] = [];
  fuelTypeOptions: string[] = [];
  transmissionOptions: string[] = [];
  drivetrainOptions: string[] = [];
  colorOptions: string[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadFilterOptions();

    this.route.queryParams.subscribe(params => {
      this.filters = this.getEmptyFilters();
      this.filters.category = params['category'] || '';
      this.filters.brand = params['brand'] || '';
      this.filters.search = params['search'] || '';
      this.filters.city = params['city'] || '';
      this.loadCars();
    });
  }

  loadCars() {
    this.loading = true;
    this.api.getCars(this.getRequestFilters()).subscribe({
      next: (data) => {
        this.cars = data;
        this.loading = false;
      },
      error: () => {
        this.cars = [];
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.router.navigate(['/cars'], { queryParams: this.getRequestFilters() });
  }

  resetFilters() {
    this.filters = this.getEmptyFilters();
    this.showAdvanced = false;
    this.router.navigate(['/cars'], { queryParams: {} });
  }

  loadFilterOptions() {
    this.api.getCars().subscribe({
      next: (cars) => {
        this.brandOptions = this.getUnique(cars.map(car => car.brand));
        this.bodyTypeOptions = this.getUnique(cars.map(car => car.bodyType));
        this.fuelTypeOptions = this.getUnique(cars.map(car => car.fuelType));
        this.transmissionOptions = this.getUnique(cars.map(car => car.transmission));
        this.drivetrainOptions = this.getUnique(cars.map(car => car.drivetrain));
        this.colorOptions = this.getUnique(cars.map(car => car.color));
      },
      error: () => {}
    });
  }

  getRequestFilters() {
    const result: any = {};

    Object.entries(this.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim() !== '') {
        result[key] = value;
      }
    });

    return result;
  }

  getUnique(values: any[]) {
    const list = values
      .filter(value => value)
      .map(value => String(value).trim());

    return [...new Set(list)].sort((a, b) => a.localeCompare(b));
  }

  getEmptyFilters() {
    return {
      search: '',
      category: '',
      brand: '',
      model: '',
      city: '',
      bodyType: '',
      min_engine: '',
      max_engine: '',
      fuelType: '',
      transmission: '',
      drivetrain: '',
      color: '',
      year_from: '',
      year_to: '',
      min_price: '',
      max_price: '',
      min_mileage: '',
      max_mileage: '',
      condition: ''
    };
  }
}
