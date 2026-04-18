import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container add-page">
      <div class="page-header">
        <p class="eyebrow">Новое объявление</p>
        <h1>Разместите автомобиль на CarHub</h1>
        <p>Заполните информацию о машине и опубликуйте предложение в едином профессиональном формате.</p>
      </div>

      @if (error) { <div class="error-box">{{ error }}</div> }
      @if (success) { <div class="success-box">Объявление опубликовано. Выполняется переход...</div> }

      <div class="form-card surface-card">
        <div class="form-section">
          <h2>Основная информация</h2>
          <div class="form-grid">
            <div class="form-group full">
              <label>Заголовок объявления *</label>
              <input type="text" [(ngModel)]="form.title" placeholder="Например: Toyota Camry 2020 в отличном состоянии" />
            </div>
            <div class="form-group">
              <label>Марка *</label>
              <input type="text" [(ngModel)]="form.brand" placeholder="Toyota, BMW..." />
            </div>
            <div class="form-group">
              <label>Модель *</label>
              <input type="text" [(ngModel)]="form.model" placeholder="Camry, X5..." />
            </div>
            <div class="form-group">
              <label>Год выпуска *</label>
              <input type="number" [(ngModel)]="form.year" placeholder="2020" />
            </div>
            <div class="form-group">
              <label>Цена (₸) *</label>
              <input type="number" [(ngModel)]="form.price" placeholder="8500000" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Технические параметры</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Пробег (км)</label>
              <input type="number" [(ngModel)]="form.mileage" placeholder="45000" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <select [(ngModel)]="form.category">
                <option value="">Выберите...</option>
                @for (cat of categories; track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Состояние</label>
              <select [(ngModel)]="form.condition">
                <option value="used">С пробегом</option>
                <option value="new">Новый</option>
              </select>
            </div>
            <div class="form-group">
              <label>Город *</label>
              <input type="text" [(ngModel)]="form.city" placeholder="Алматы" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Расширенные параметры</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Тип кузова</label>
              <select [(ngModel)]="form.bodyType">
                @for (item of bodyTypeOptions; track item) {
                  <option [value]="item">{{ item }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Объем двигателя (л)</label>
              <input type="number" [(ngModel)]="form.engineVolume" placeholder="2.5" step="0.1" />
            </div>
            <div class="form-group">
              <label>Топливо</label>
              <select [(ngModel)]="form.fuelType">
                @for (item of fuelTypeOptions; track item) {
                  <option [value]="item">{{ item }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Коробка</label>
              <select [(ngModel)]="form.transmission">
                @for (item of transmissionOptions; track item) {
                  <option [value]="item">{{ item }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Привод</label>
              <select [(ngModel)]="form.drivetrain">
                @for (item of drivetrainOptions; track item) {
                  <option [value]="item">{{ item }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Цвет</label>
              <input type="text" [(ngModel)]="form.color" placeholder="Черный, белый, серый..." />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Медиа и описание</h2>
          <div class="form-group">
            <label>URL изображения</label>
            <input type="url" [(ngModel)]="form.image_url" placeholder="https://example.com/car.jpg" />
          </div>
          <div class="form-group">
            <label>Или загрузите фото</label>
            <input type="file" accept="image/*" (change)="onImageSelected($event)" />
          </div>
          <div class="form-group">
            <label>Описание *</label>
            <textarea [(ngModel)]="form.description" placeholder="Подробно опишите состояние, комплектацию и историю автомобиля" rows="6"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-primary" (click)="submit()">Опубликовать</button>
          <button class="btn-secondary" (click)="router.navigate(['/cars'])">Отмена</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-page {
      max-width: 920px;
      display: grid;
      gap: 18px;
    }
    .eyebrow {
      margin-bottom: 10px;
      color: var(--accent-gold);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 12px;
      font-weight: 700;
    }
    .page-header h1 {
      margin-bottom: 10px;
      font-size: 38px;
      line-height: 1.1;
      letter-spacing: -0.04em;
    }
    .page-header p:last-child,
    .form-group label {
      color: var(--text-secondary);
    }
    .form-card {
      padding: 28px;
    }
    .form-section {
      margin-bottom: 28px;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .form-section:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .form-section h2 {
      margin-bottom: 18px;
      font-size: 22px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-group {
      display: grid;
      gap: 8px;
    }
    .form-group label {
      font-size: 12px;
      font-weight: 600;
    }
    .full {
      grid-column: 1 / -1;
    }
    textarea {
      resize: vertical;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }
    .error-box,
    .success-box {
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 14px;
    }
    .error-box {
      border: 1px solid rgba(239, 68, 68, 0.26);
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
    }
    .success-box {
      border: 1px solid rgba(16, 185, 129, 0.22);
      background: rgba(16, 185, 129, 0.12);
      color: #6ee7b7;
    }
    @media (max-width: 720px) {
      .form-grid,
      .form-actions {
        grid-template-columns: 1fr;
        display: grid;
      }
    }
  `]
})
export class AddCarComponent implements OnInit {
  categories: any[] = [];
  error = '';
  success = false;
  selectedImageFile: File | null = null;
  bodyTypeOptions = ['Sedan', 'SUV', 'Crossover', 'Coupe', 'Hatchback', 'Wagon', 'Pickup', 'Minivan'];
  fuelTypeOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Gas'];
  transmissionOptions = ['Automatic', 'Manual', 'CVT', 'Robot'];
  drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];
  form = {
    title: '', brand: '', model: '',
    year: new Date().getFullYear(),
    price: '', mileage: 0,
    bodyType: 'Sedan', engineVolume: 2.0,
    fuelType: 'Petrol', transmission: 'Automatic',
    drivetrain: 'FWD', color: 'Черный',
    category: '', condition: 'used',
    city: 'Алматы', image_url: '', description: ''
  };

  constructor(public router: Router, private api: ApiService) {}

  ngOnInit() {
    this.api.getCategories().subscribe({ next: d => this.categories = d, error: () => {} });
  }

  submit() {
    this.error = '';
    if (!this.form.title || !this.form.brand || !this.form.model || !this.form.price || !this.form.description || !this.form.city) {
      this.error = 'Заполните все обязательные поля (*).';
      return;
    }

    const payload = new FormData();
    payload.append('title', this.form.title);
    payload.append('brand', this.form.brand);
    payload.append('model', this.form.model);
    payload.append('year', String(Number(this.form.year)));
    payload.append('price', String(Number(this.form.price)));
    payload.append('mileage', String(Number(this.form.mileage || 0)));
    payload.append('bodyType', this.form.bodyType);
    payload.append('engineVolume', String(Number(this.form.engineVolume || 0)));
    payload.append('fuelType', this.form.fuelType);
    payload.append('transmission', this.form.transmission);
    payload.append('drivetrain', this.form.drivetrain);
    payload.append('color', this.form.color);
    payload.append('condition', this.form.condition);
    payload.append('city', this.form.city);
    payload.append('description', this.form.description);
    payload.append('is_active', 'true');

    if (this.form.category) {
      payload.append('category', String(this.form.category));
    }

    if (this.selectedImageFile) {
      payload.append('image_file', this.selectedImageFile);
    } else {
      payload.append('image_url', this.normalizeUrl(this.form.image_url));
    }

    this.api.createCar(payload).subscribe({
      next: (car) => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/cars', car.id]), 600);
      },
      error: (err) => {
        this.error = err?.error?.detail || 'Ошибка при создании. Проверьте все поля.';
      }
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImageFile = input.files?.[0] || null;
  }

  private normalizeUrl(value: string) {
    const trimmed = value?.trim() || '';
    if (!trimmed) {
      return '';
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }
}
