import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, catchError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api/auth';
  currentUser$ = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  login(username: string, password: string): Observable<any> {
    const data = {
      username: username.trim(),
      password: password
    };

    return this.http.post<any>(`${this.baseUrl}/login/`, data).pipe(
      tap((response) => this.saveUser(response))
    );
  }

  register(data: any): Observable<any> {
    const user = {
      username: String(data.username || '').trim(),
      email: String(data.email || '').trim().toLowerCase(),
      password: String(data.password || ''),
      password_confirm: String(data.password_confirm || '')
    };

    return this.http.post<any>(`${this.baseUrl}/register/`, user).pipe(
      tap((response) => this.saveUser(response))
    );
  }

  logout() {
    const refresh = localStorage.getItem('refresh_token');

    if (refresh) {
      this.http.post(`${this.baseUrl}/logout/`, { refresh }).pipe(
        catchError(() => EMPTY)
      ).subscribe();
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUser$.next(null);
    this.router.navigate(['/home']);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile/`).pipe(
      tap((profile) => {
        const user = {
          id: profile.id,
          username: profile.username,
          email: profile.email
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser$.next(user);
      })
    );
  }

  private saveUser(response: any) {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser$.next(response.user);
  }
}
