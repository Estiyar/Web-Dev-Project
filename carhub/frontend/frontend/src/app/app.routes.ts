import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'cars', loadComponent: () => import('./components/cars/cars.component').then(m => m.CarsComponent) },
  { path: 'cars/:id', loadComponent: () => import('./components/car-detail/car-detail.component').then(m => m.CarDetailComponent) },
  { path: 'parts', loadComponent: () => import('./components/parts/parts.component').then(m => m.PartsComponent) },
  { path: 'parts/:id', loadComponent: () => import('./components/part-detail/part-detail.component').then(m => m.PartDetailComponent) },
  { path: 'community', loadComponent: () => import('./components/community/community.component').then(m => m.CommunityComponent) },
  { path: 'add-car', loadComponent: () => import('./components/add-car/add-car.component').then(m => m.AddCarComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: '**', redirectTo: '' }
];
