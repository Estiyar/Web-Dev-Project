import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container community-page">
      <section class="community-hero surface-card">
        <div>
          <p class="eyebrow">Community</p>
          <h1>Автомобильное сообщество CarHub</h1>
          <p>Реалистичный demo-форум с обсуждениями брендов, опытом эксплуатации и живыми комментариями владельцев.</p>
        </div>
        <button class="btn-primary" (click)="openCreateModal()">Создать обсуждение</button>
      </section>

      <div class="community-layout">
        <aside class="brand-sidebar surface-card">
          <div class="sidebar-head">
            <h2>Бренды</h2>
            <p>{{ filteredPosts.length }} тем</p>
          </div>

          <button class="brand-link" [class.active]="selectedBrand === 'Все'" (click)="changeBrand('Все')">Все бренды</button>
          @for (brand of brands; track brand) {
            <button class="brand-link" [class.active]="selectedBrand === brand" (click)="changeBrand(brand)">
              {{ brand }}
            </button>
          }
        </aside>

        <main class="community-main">
          <div class="section-head">
            <div>
              <p class="eyebrow">Forum Feed</p>
              <h2>{{ selectedBrand === 'Все' ? 'Все обсуждения' : 'Обсуждения: ' + selectedBrand }}</h2>
            </div>
          </div>

          @if (filteredPosts.length === 0) {
            <div class="empty-card surface-card community-empty-state">
              <p>Для выбранного бренда пока нет обсуждений.</p>
              <div class="empty-action">
                <button class="btn-primary" (click)="openCreateModal()">Создать первое обсуждение</button>
              </div>
            </div>
          } @else {
            <div class="posts-grid">
              @for (post of filteredPosts; track post.id) {
                <article class="post-card surface-card" [class.active]="selectedPost?.id === post.id" (click)="selectPost(post)">
                  <div class="post-meta">
                    <span class="brand-pill">{{ post.brand }}</span>
                    <span class="date">{{ formatDate(post.createdAt) }}</span>
                  </div>
                  <h3>{{ post.title }}</h3>
                  <p>{{ post.description | slice:0:160 }}{{ post.description.length > 160 ? '...' : '' }}</p>
                  <div class="post-footer">
                    <span>Автор: {{ post.author }}</span>
                    <span class="open-link">Открыть</span>
                  </div>
                </article>
              }
            </div>
          }

          @if (selectedPost) {
            <section class="detail-card surface-card">
              <div class="post-meta">
                <span class="brand-pill">{{ selectedPost.brand }}</span>
                <span class="date">{{ formatDate(selectedPost.createdAt) }}</span>
              </div>
              <h2>{{ selectedPost.title }}</h2>
              <div class="detail-author">Автор: {{ selectedPost.author }}</div>
              <p class="full-text">{{ selectedPost.description }}</p>

              <div class="comments-block">
                <div class="comments-head">
                  <h3>Комментарии</h3>
                  <span>{{ selectedComments.length }}</span>
                </div>

                @if (selectedComments.length === 0) {
                  <p class="empty-comments">Пока нет комментариев к этой теме.</p>
                } @else {
                  <div class="comments-list">
                    @for (comment of selectedComments; track comment.id) {
                      <article class="comment-card">
                        <div class="comment-top">
                          <strong>{{ comment.author }}</strong>
                          <span>{{ formatDate(comment.createdAt) }}</span>
                        </div>
                        <p>{{ comment.text }}</p>
                      </article>
                    }
                  </div>
                }

                @if (isLoggedIn) {
                  <div class="comment-form">
                    <textarea rows="3" [(ngModel)]="newCommentText" placeholder="Добавьте комментарий"></textarea>
                    @if (commentError) {
                      <div class="error-box">{{ commentError }}</div>
                    }
                    <button class="btn-primary" (click)="addComment()">Отправить комментарий</button>
                  </div>
                }
              </div>
            </section>
          }
        </main>
      </div>

      @if (showCreateModal) {
        <div class="modal-overlay" (click)="closeCreateModal()">
          <div class="modal-card surface-card" (click)="$event.stopPropagation()">
            <div class="modal-head">
              <div>
                <p class="eyebrow">New Topic</p>
                <h3>Создать обсуждение</h3>
              </div>
              <button class="close-button" (click)="closeCreateModal()">Закрыть</button>
            </div>

            <div class="form-group">
              <label>Заголовок *</label>
              <input type="text" [(ngModel)]="newPost.title" placeholder="Например: Стоит ли брать BMW X5 с пробегом?" />
            </div>

            <div class="form-group">
              <label>Описание *</label>
              <textarea rows="6" [(ngModel)]="newPost.description" placeholder="Опишите вопрос или свой опыт подробнее"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Марка</label>
                <select [(ngModel)]="newPost.brand">
                  @for (brand of brands; track brand) {
                    <option [value]="brand">{{ brand }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Автор</label>
                <input type="text" [(ngModel)]="newPost.author" placeholder="Ваше имя" />
              </div>
            </div>

            @if (formError) {
              <div class="error-box">{{ formError }}</div>
            }

            <div class="modal-actions">
              <button class="btn-primary" (click)="createPost()">Опубликовать</button>
              <button class="btn-secondary" (click)="closeCreateModal()">Отмена</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .community-page {
      display: grid;
      gap: 22px;
    }
    .eyebrow {
      margin-bottom: 10px;
      color: var(--accent-gold);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
    }
    .community-hero,
    .brand-sidebar,
    .detail-card,
    .empty-card,
    .modal-card {
      padding: 24px;
    }
    .community-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      background:
        radial-gradient(circle at top right, rgba(212, 175, 55, 0.14), transparent 30%),
        var(--bg-section);
    }
    .community-hero h1,
    .section-head h2,
    .detail-card h2 {
      font-size: 36px;
      letter-spacing: -0.04em;
      line-height: 1.1;
    }
    .section-head h2,
    .detail-card h2 {
      font-size: 28px;
    }
    .community-hero p:last-child,
    .sidebar-head p,
    .date,
    .post-footer,
    .detail-author,
    .empty-comments,
    .comment-top span {
      color: var(--text-secondary);
      line-height: 1.7;
    }
    .community-layout {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 22px;
    }
    .brand-sidebar {
      height: fit-content;
      display: grid;
      gap: 10px;
    }
    .sidebar-head,
    .post-meta,
    .post-footer,
    .modal-head,
    .modal-actions,
    .comments-head,
    .comment-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .sidebar-head {
      align-items: baseline;
      margin-bottom: 8px;
    }
    .brand-link {
      width: 100%;
      min-height: 44px;
      padding: 0 14px;
      text-align: left;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .brand-link:hover,
    .brand-link.active {
      color: var(--text-primary);
      background: rgba(212, 175, 55, 0.1);
      border-color: rgba(212, 175, 55, 0.2);
    }
    .community-main {
      display: grid;
      gap: 18px;
    }
    .posts-grid,
    .comments-list {
      display: grid;
      gap: 14px;
    }
    .post-card {
      cursor: pointer;
      padding: 22px;
    }
    .post-card:hover,
    .post-card.active {
      transform: translateY(-2px);
      border-color: rgba(212, 175, 55, 0.45);
      box-shadow: var(--shadow-card);
    }
    .brand-pill {
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
    .post-card h3 {
      margin: 14px 0 10px;
      font-size: 22px;
      color: var(--text-primary);
      line-height: 1.25;
    }
    .post-card p,
    .full-text,
    .comment-card p {
      color: var(--text-secondary);
      line-height: 1.75;
    }
    .open-link {
      color: var(--accent-gold);
      font-weight: 700;
    }
    .detail-card {
      display: grid;
      gap: 12px;
    }
    .full-text {
      white-space: pre-wrap;
    }
    .comments-block {
      margin-top: 10px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: grid;
      gap: 14px;
    }
    .comments-head h3 {
      font-size: 20px;
      color: var(--text-primary);
    }
    .comment-card {
      padding: 16px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
    }
    .comment-form {
      display: grid;
      gap: 12px;
      margin-top: 8px;
      padding: 16px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
    }
    .empty-card {
      display: grid;
      gap: 16px;
      justify-items: start;
    }
    .community-empty-state {
      min-height: 220px;
      align-content: center;
    }
    .empty-action {
      margin-top: 4px;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(4, 9, 16, 0.7);
      display: grid;
      place-items: center;
      padding: 20px;
      z-index: 220;
    }
    .modal-card {
      width: min(100%, 720px);
      display: grid;
      gap: 16px;
    }
    .close-button {
      min-height: 42px;
      padding: 0 14px;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .close-button:hover {
      color: var(--accent-gold);
      border-color: var(--accent-gold);
    }
    .form-group {
      display: grid;
      gap: 8px;
    }
    .form-group label {
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .error-box {
      border-radius: 12px;
      padding: 12px 14px;
      border: 1px solid rgba(239, 68, 68, 0.26);
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
    }
    @media (max-width: 980px) {
      .community-layout {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 720px) {
      .community-hero,
      .modal-head,
      .modal-actions,
      .form-row,
      .post-meta,
      .post-footer,
      .comments-head,
      .comment-top {
        grid-template-columns: 1fr;
        display: grid;
        align-items: start;
      }
      .community-hero h1 {
        font-size: 30px;
      }
      .btn-primary,
      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class CommunityComponent implements OnInit {
  brands = ['Toyota', 'BMW', 'Mercedes', 'Hyundai', 'Kia', 'Lexus', 'Chevrolet', 'Nissan'];
  selectedBrand = 'Все';
  showCreateModal = false;
  formError = '';
  commentError = '';
  posts: any[] = [];
  filteredPosts: any[] = [];
  selectedPost: any = null;
  selectedComments: any[] = [];
  newCommentText = '';
  isLoggedIn = false;
  loading = false;

  newPost = {
    title: '',
    description: '',
    brand: 'Toyota',
    author: ''
  };

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.newPost.author = JSON.parse(localStorage.getItem('user') || 'null')?.username || '';
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.selectedBrand = 'Все';

    this.api.getCommunityPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.updatePosts();
        this.loading = false;
      },
      error: () => {
        this.posts = [];
        this.filteredPosts = [];
        this.selectedPost = null;
        this.selectedComments = [];
        this.loading = false;
      }
    });
  }

  changeBrand(brand: string) {
    this.selectedBrand = brand;
    this.updatePosts();
  }

  selectPost(post: any) {
    this.selectedPost = post;
    this.selectedComments = post.comments || [];
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.formError = '';
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.formError = '';
    this.newPost = {
      title: '',
      description: '',
      brand: 'Toyota',
      author: JSON.parse(localStorage.getItem('user') || 'null')?.username || ''
    };
  }

  createPost() {
    if (!this.isLoggedIn) {
      this.formError = 'Нужно войти в аккаунт, чтобы создать обсуждение.';
      return;
    }

    if (!this.newPost.title.trim() || !this.newPost.description.trim()) {
      this.formError = 'Заполните заголовок и описание.';
      return;
    }

    const data = {
      title: this.newPost.title.trim(),
      description: this.newPost.description.trim(),
      brand: this.newPost.brand
    };

    this.api.createCommunityPost(data).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.selectedBrand = post.brand;
        this.closeCreateModal();
        this.updatePosts();
      },
      error: () => {
        this.formError = 'Нужно войти в аккаунт, чтобы создать обсуждение.';
      }
    });
  }

  addComment() {
    if (!this.selectedPost || !this.newCommentText.trim()) {
      this.commentError = 'Введите текст комментария.';
      return;
    }

    this.commentError = '';

    this.api.addCommunityComment(this.selectedPost.id, { text: this.newCommentText.trim() }).subscribe({
      next: (comment) => {
        const comments = [comment, ...(this.selectedPost.comments || [])];
        this.selectedPost = { ...this.selectedPost, comments };
        this.selectedComments = comments;
        this.posts = this.posts.map(post => post.id === this.selectedPost.id ? this.selectedPost : post);
        this.newCommentText = '';
      },
      error: () => {
        this.commentError = 'Нужно войти в аккаунт, чтобы добавить комментарий.';
      }
    });
  }

  updatePosts() {
    if (this.selectedBrand === 'Все') {
      this.filteredPosts = [...this.posts];
    } else {
      this.filteredPosts = this.posts.filter(post => post.brand === this.selectedBrand);
    }

    this.selectedPost = this.filteredPosts[0] || null;
    this.selectedComments = this.selectedPost?.comments || [];
  }

  formatDate(value: string) {
    return new Date(value).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
