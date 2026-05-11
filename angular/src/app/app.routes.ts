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
    path: 'cadastro',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/register-page.component').then(
        (module) => module.RegisterPageComponent,
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
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile-page.component').then(
        (module) => module.ProfilePageComponent,
      ),
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/user-management.component').then(
        (module) => module.UserManagementComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/pages/admin-dashboard.component').then(
        (module) => module.AdminDashboardComponent,
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
