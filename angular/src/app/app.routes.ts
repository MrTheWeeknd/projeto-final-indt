import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page.component').then(
        (module) => module.LoginPageComponent,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page.component').then(
        (module) => module.DashboardPageComponent,
      ),
  },
  {
    path: 'insumos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/insumos/pages/insumos-page.component').then(
        (module) => module.InsumosPageComponent,
      ),
  },
  {
    path: 'movimentacoes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/movimentacoes/pages/movimentacoes-page.component').then(
        (module) => module.MovimentacoesPageComponent,
      ),
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categorias/pages/categorias-page.component').then(
        (module) => module.CategoriasPageComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
