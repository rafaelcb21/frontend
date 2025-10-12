import { Routes } from '@angular/router';
import { authGuard } from './infra/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./presenter/page/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./presenter/component/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./presenter/page/home/home').then(m => m.Home)
      },
      {
        path: 'user',
        loadComponent: () => import('./presenter/page/user/user').then(m => m.User)
      },
      {
        path: 'truck',
        loadComponent: () => import('./presenter/page/truck/truck').then(m => m.Truck)
      },
      {
        path: 'predict',
        loadComponent: () => import('./presenter/page/predict/predict').then(m => m.Predict)
      },
      {
        path: 'report',
        loadComponent: () => import('./presenter/page/report/report').then(m => m.Report)
      }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
