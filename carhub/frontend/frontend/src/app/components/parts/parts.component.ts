import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container parts-page">
      <div class="page-top">
        <div>
          <p class="eyebrow">Spare Parts</p>
          <h1>Запчасти</h1>
        </div>
        <div class="page-actions">
          <span class="count">Найдено: {{ filteredParts.length }}</span>
          <button class="btn-primary" (click)="openCreateModal()">Добавить запчасть</button>
        </div>
      </div>

      <div class="layout">
        <aside class="sidebar surface-card">
          <div class="sidebar-header">
            <h2>Фильтры</h2>
            <p>Подберите нужную запчасть</p>
          </div>

          <div class="filter-group">
            <label>Бренд</label>
            <select [(ngModel)]="filters.brand">
              <option value="">Все бренды</option>
              @for (item of brandOptions; track item) {
                <option [value]="item">{{ item }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <label>Модель</label>
            <input type="text" [(ngModel)]="filters.model" placeholder="Camry, X5, Tucson..." />
          </div>

          <div class="filter-group">
            <label>Категория</label>
            <select [(ngModel)]="filters.category">
              <option value="">Все категории</option>
              @for (item of categoryOptions; track item) {
                <option [value]="item">{{ item }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <label>Состояние</label>
            <select [(ngModel)]="filters.condition">
              <option value="">Любое</option>
              <option value="new">Новая</option>
              <option value="used">Б/у</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Город</label>
            <input type="text" [(ngModel)]="filters.city" placeholder="Алматы, Астана..." />
          </div>

          <div class="filter-grid">
            <div class="filter-group">
              <label>Цена от</label>
              <input type="number" [(ngModel)]="filters.minPrice" placeholder="0" />
            </div>
            <div class="filter-group">
              <label>Цена до</label>
              <input type="number" [(ngModel)]="filters.maxPrice" placeholder="9999999" />
            </div>
          </div>

          <div class="sidebar-actions">
            <button class="btn-primary sidebar-button" (click)="applyFilters()">Применить</button>
            <button class="btn-secondary sidebar-button" (click)="resetFilters()">Сбросить</button>
          </div>
        </aside>

        <div class="main">
          @if (loading) {
            <div class="empty-card surface-card">
              <p>Загрузка запчастей...</p>
            </div>
          } @else if (filteredParts.length === 0 && filtersApplied) {
            <div class="empty-card surface-card">
              <p>По выбранным параметрам запчастей не найдено.</p>
              <button class="btn-primary" (click)="resetFilters()">Сбросить фильтры</button>
            </div>
          } @else if (filteredParts.length === 0) {
            <div class="empty-card surface-card">
              <p>Запчасти пока не добавлены.</p>
            </div>
          } @else {
            <div class="parts-grid">
              @for (part of filteredParts; track part.id) {
                <article class="part-card surface-card" (click)="openPart(part.id)">
                  <div class="part-media">
                    <img [src]="part.image || part.image_url" [alt]="part.title" loading="lazy" decoding="async" />
                  </div>
                  <div class="part-body">
                    <div class="meta-top">
                      <span>{{ part.brand }} {{ part.model }}</span>
                      <span>{{ part.city }}</span>
                    </div>
                    <h3>{{ part.title }}</h3>
                    <div class="tags">
                      <span>{{ part.partCategory }}</span>
                      <span>{{ part.condition === 'new' ? 'Новая' : 'Б/у' }}</span>
                    </div>
                    <p class="price">{{ part.price | number }} ₸</p>
                    <div class="card-footer">
                      <span>{{ part.sellerName }}</span>
                      <button class="btn-secondary open-button" (click)="openPart(part.id, $event)">Открыть</button>
                    </div>
                  </div>
                </article>
              }
            </div>
          }
        </div>
      </div>

      @if (showCreateModal) {
        <div class="modal-overlay" (click)="closeCreateModal()">
          <div class="modal-card surface-card" (click)="$event.stopPropagation()">
            <div class="detail-top">
              <h2>Новая запчасть</h2>
              <button class="btn-secondary open-button" (click)="closeCreateModal()">Закрыть</button>
            </div>

            <div class="filter-grid">
              <div class="filter-group">
                <label>Название *</label>
                <input type="text" [(ngModel)]="createForm.title" />
              </div>
              <div class="filter-group">
                <label>Марка *</label>
                <input type="text" [(ngModel)]="createForm.brand" />
              </div>
              <div class="filter-group">
                <label>Модель *</label>
                <input type="text" [(ngModel)]="createForm.model" />
              </div>
              <div class="filter-group">
                <label>Категория *</label>
                <input type="text" [(ngModel)]="createForm.partCategory" />
              </div>
              <div class="filter-group">
                <label>Состояние</label>
                <select [(ngModel)]="createForm.condition">
                  <option value="new">Новая</option>
                  <option value="used">Б/у</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Цена *</label>
                <input type="number" [(ngModel)]="createForm.price" />
              </div>
              <div class="filter-group">
                <label>Город *</label>
                <input type="text" [(ngModel)]="createForm.city" />
              </div>
              <div class="filter-group">
                <label>URL изображения</label>
                <input type="url" [(ngModel)]="createForm.image" placeholder="https://example.com/part.jpg" />
              </div>
              <div class="filter-group">
                <label>Или загрузите фото</label>
                <input type="file" accept="image/*" (change)="onPartImageSelected($event)" />
              </div>
            </div>

            <div class="filter-group">
              <label>Описание *</label>
              <textarea rows="4" [(ngModel)]="createForm.description"></textarea>
            </div>

            @if (createError) {
              <div class="empty-card surface-card">{{ createError }}</div>
            }

            <div class="sidebar-actions">
              <button class="btn-primary sidebar-button" (click)="createPart()">Сохранить</button>
              <button class="btn-secondary sidebar-button" (click)="closeCreateModal()">Отмена</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .parts-page { display: grid; gap: 22px; }
    .page-top, .sidebar-header, .meta-top, .card-footer, .detail-top {
      display: flex; justify-content: space-between; gap: 12px; align-items: center;
    }
    .eyebrow {
      margin-bottom: 10px; color: var(--accent-gold); font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;
    }
    .page-top h1, .detail-top h2 { font-size: 36px; line-height: 1.1; letter-spacing: -0.04em; }
    .detail-top h2 { font-size: 28px; }
    .page-actions { display: flex; gap: 12px; align-items: center; }
    .count, .sidebar-header p, .meta-top, .detail-top p, .detail-meta { color: var(--text-secondary); font-size: 13px; }
    .layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 22px; }
    .sidebar { padding: 22px; height: fit-content; }
    .sidebar-header { align-items: flex-start; flex-direction: column; margin-bottom: 18px; }
    .sidebar-header h2 { font-size: 20px; }
    .filter-group { display: grid; gap: 8px; margin-bottom: 14px; }
    .filter-group label { color: var(--text-secondary); font-size: 12px; font-weight: 600; }
    .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .sidebar-actions { display: grid; gap: 10px; margin-top: 8px; }
    .sidebar-button { width: 100%; }
    .parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
    .part-card { overflow: hidden; cursor: pointer; }
    .part-card:hover { transform: translateY(-3px); border-color: rgba(212, 175, 55, 0.52); box-shadow: var(--shadow-card); }
    .part-media { height: 190px; background: var(--bg-elevated); overflow: hidden; }
    .part-media img { width: 100%; height: 100%; object-fit: cover; }
    .part-body { padding: 18px; }
    .part-body h3 { margin: 10px 0 12px; font-size: 18px; line-height: 1.35; color: var(--text-primary); }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .tags span {
      border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 700;
      background: rgba(212, 175, 55, 0.12); color: var(--accent-gold); border: 1px solid rgba(212, 175, 55, 0.18);
    }
    .price { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; color: var(--text-primary); }
    .card-footer { margin-top: 14px; color: var(--text-secondary); font-size: 13px; align-items: center; }
    .open-button { min-height: 38px; padding: 0 14px; }
    .empty-card { padding: 28px; display: grid; gap: 16px; justify-items: start; color: var(--text-secondary); }
    .modal-overlay {
      position: fixed; inset: 0; display: grid; place-items: center; padding: 20px;
      background: rgba(4, 9, 16, 0.7); z-index: 220;
    }
    .modal-card { width: min(100%, 760px); padding: 24px; display: grid; gap: 16px; }
    textarea { resize: vertical; }
    @media (max-width: 980px) { .layout { grid-template-columns: 1fr; } }
    @media (max-width: 640px) {
      .page-top, .filter-grid, .card-footer, .detail-top, .page-actions { grid-template-columns: 1fr; display: grid; }
    }
  `]
})
export class PartsComponent implements OnInit {
  allParts: any[] = [];
  filteredParts: any[] = [];
  loading = false;
  filtersApplied = false;
  showCreateModal = false;
  createError = '';
  selectedImageFile: File | null = null;

  filters = {
    brand: '',
    model: '',
    category: '',
    condition: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  };

  createForm = {
    title: '',
    brand: '',
    model: '',
    partCategory: '',
    condition: 'used',
    price: '',
    city: 'Almaty',
    description: '',
    image: ''
  };

  brandOptions: string[] = [];
  categoryOptions: string[] = [];

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadParts();
  }

  loadParts() {
    this.loading = true;
    this.filtersApplied = false;

    this.api.getParts().subscribe({
      next: (parts) => {
        this.allParts = parts;
        this.filteredParts = [...parts];
        this.brandOptions = this.getUnique(parts.map(part => part.brand));
        this.categoryOptions = this.getUnique(parts.map(part => part.partCategory));
        this.loading = false;
      },
      error: () => {
        this.allParts = [];
        this.filteredParts = [];
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filtersApplied = true;

    if (!this.hasFilters()) {
      this.filteredParts = [...this.allParts];
      return;
    }

    const params = {
      brand: this.filters.brand,
      model: this.filters.model,
      category: this.filters.category,
      condition: this.filters.condition,
      city: this.filters.city,
      min_price: this.filters.minPrice,
      max_price: this.filters.maxPrice
    };

    this.loading = true;
    this.api.getParts(params).subscribe({
      next: (parts) => {
        this.filteredParts = parts;
        this.loading = false;
      },
      error: () => {
        this.filteredParts = [];
        this.loading = false;
      }
    });
  }

  resetFilters() {
    this.filters = {
      brand: '',
      model: '',
      category: '',
      condition: '',
      city: '',
      minPrice: '',
      maxPrice: ''
    };
    this.filtersApplied = false;
    this.filteredParts = [...this.allParts];
  }

  openCreateModal() {
    this.createError = '';
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createError = '';
    this.selectedImageFile = null;
    this.createForm = {
      title: '',
      brand: '',
      model: '',
      partCategory: '',
      condition: 'used',
      price: '',
      city: 'Almaty',
      description: '',
      image: ''
    };
  }

  createPart() {
    if (!this.auth.isLoggedIn()) {
      this.createError = 'Нужно войти в аккаунт, чтобы добавить запчасть.';
      return;
    }

    if (
      !this.createForm.title ||
      !this.createForm.brand ||
      !this.createForm.model ||
      !this.createForm.partCategory ||
      !this.createForm.price ||
      !this.createForm.city ||
      !this.createForm.description
    ) {
      this.createError = 'Заполните обязательные поля.';
      return;
    }

    const data = new FormData();
    data.append('title', this.createForm.title);
    data.append('brand', this.createForm.brand);
    data.append('model', this.createForm.model);
    data.append('partCategory', this.createForm.partCategory);
    data.append('condition', this.createForm.condition);
    data.append('price', String(this.createForm.price));
    data.append('city', this.createForm.city);
    data.append('description', this.createForm.description);

    if (this.selectedImageFile) {
      data.append('image_file', this.selectedImageFile);
    } else {
      data.append('image', this.prepareUrl(this.createForm.image));
    }

    this.api.createPart(data).subscribe({
      next: (part) => {
        this.allParts.unshift(part);
        this.filteredParts.unshift(part);
        this.brandOptions = this.getUnique(this.allParts.map(item => item.brand));
        this.categoryOptions = this.getUnique(this.allParts.map(item => item.partCategory));
        this.closeCreateModal();
      },
      error: () => {
        this.createError = 'Не удалось сохранить запчасть.';
      }
    });
  }

  openPart(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/parts', id]);
  }

  onPartImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImageFile = input.files?.[0] || null;
  }

  hasFilters() {
    return Object.values(this.filters).some(value => value !== '' && value !== null && value !== undefined);
  }

  getUnique(values: any[]) {
    const list = values
      .filter(value => value)
      .map(value => String(value).trim());

    return [...new Set(list)].sort((a, b) => a.localeCompare(b));
  }

  prepareUrl(value: string) {
    const text = value.trim();

    if (!text) {
      return '';
    }

    if (text.startsWith('http://') || text.startsWith('https://')) {
      return text;
    }

    return 'https://' + text;
  }
}
