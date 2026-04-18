import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/`);
  }

  getCars(filters?: Record<string, any>): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cars/`, {
      params: this.buildParams(filters)
    });
  }

  getCar(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cars/${id}/`);
  }

  createCar(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cars/`, data);
  }

  updateCar(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/cars/${id}/`, data);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cars/${id}/`);
  }

  getReviews(carId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reviews/`, {
      params: new HttpParams().set('car', carId)
    });
  }

  createReview(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reviews/`, data);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reviews/${id}/`);
  }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/favorites/`);
  }

  toggleFavorite(carId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/favorites/`, { car: carId });
  }

  getParts(filters?: Record<string, any>): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/parts/`, {
      params: this.buildParams(filters)
    });
  }

  getPart(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/parts/${id}/`);
  }

  createPart(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/parts/`, data);
  }

  getCommunityPosts(brand?: string): Observable<any[]> {
    const params = brand ? new HttpParams().set('brand', brand) : undefined;
    return this.http.get<any[]>(`${this.baseUrl}/community/posts/`, { params });
  }

  getCommunityPost(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/community/posts/${id}/`);
  }

  createCommunityPost(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/community/posts/`, data);
  }

  addCommunityComment(postId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/community/posts/${postId}/comments/`, data);
  }

  private buildParams(filters?: Record<string, any>): HttpParams {
    let params = new HttpParams();

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
