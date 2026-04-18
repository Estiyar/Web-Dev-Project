import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container detail-page">
      @if (loading) {
        <div class="state-card surface-card">Загрузка запчасти...</div>
      }

      @if (error) {
        <div class="error-banner">{{ error }}</div>
      }

      @if (part && !loading) {
        <button class="back-link" (click)="router.navigate(['/parts'])">Назад к запчастям</button>

        <div class="hero-layout">
          <div class="gallery surface-card">
            @if (part.image || part.image_url) {
              <img [src]="part.image || part.image_url" [alt]="part.title" />
            } @else {
              <div class="media-fallback">CarHub</div>
            }
          </div>

          <div class="summary surface-card">
            <div class="summary-top">
              <span class="pill">{{ part.partCategory }}</span>
              <span class="pill subtle">{{ part.condition === 'new' ? 'Новая' : 'Б/у' }}</span>
            </div>

            <h1>{{ part.title }}</h1>
            <p class="price">{{ part.price | number }} ₸</p>

            <div class="specs-grid">
              <div class="spec-card">
                <span>Марка</span>
                <strong>{{ part.brand }}</strong>
              </div>
              <div class="spec-card">
                <span>Модель</span>
                <strong>{{ part.model }}</strong>
              </div>
              <div class="spec-card">
                <span>Город</span>
                <strong>{{ part.city }}</strong>
              </div>
              <div class="spec-card">
                <span>Продавец</span>
                <strong>{{ part.sellerName }}</strong>
              </div>
            </div>
          </div>
        </div>

        <section class="content-card surface-card">
          <h2>Описание</h2>
          <p>{{ part.description }}</p>
        </section>
      }
    </div>
  `,
  styles: [`
    .detail-page { display: grid; gap: 20px; }
    .state-card, .content-card, .gallery, .summary { padding: 24px; }
    .error-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.26);
      color: #fca5a5;
      border-radius: 12px;
      padding: 14px 16px;
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
    .back-link:hover { color: var(--accent-gold); }
    .hero-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) 380px; gap: 20px; }
    .gallery { overflow: hidden; }
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
    .summary-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
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
    .price { margin-bottom: 18px; font-size: 32px; font-weight: 800; }
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .spec-card {
      padding: 14px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      display: grid;
      gap: 6px;
    }
    .spec-card span { color: var(--text-secondary); font-size: 13px; }
    .spec-card strong { color: var(--text-primary); font-size: 15px; }
    .content-card h2 { margin-bottom: 14px; font-size: 24px; }
    .content-card p { color: var(--text-secondary); line-height: 1.8; }
    @media (max-width: 980px) { .hero-layout { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .specs-grid { grid-template-columns: 1fr; } }
  `]
})
export class PartDetailComponent implements OnInit {
  part: any = null;
  loading = false;
  error = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        this.loading = true;
        this.error = '';
        this.part = null;

        if (!id || Number.isNaN(id)) {
          this.error = 'Некорректный идентификатор запчасти.';
          this.loading = false;
          return EMPTY;
        }

        return this.api.getPart(id);
      })
    ).subscribe({
      next: (data: any) => {
        if (!data || !data.id) {
          this.error = 'Запчасть не найдена.';
          this.part = null;
          this.loading = false;
          return;
        }

        this.part = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить запчасть.';
        this.part = null;
        this.loading = false;
      }
    });
  }
}
