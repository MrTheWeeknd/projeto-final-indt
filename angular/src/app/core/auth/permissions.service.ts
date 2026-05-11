import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(private authService: AuthService) {}

  // Categorias
  canCreateCategoria(): boolean {
    return this.authService.canEditCategorias();
  }

  canEditCategoria(): boolean {
    return this.authService.canEditCategorias();
  }

  canDeleteCategoria(): boolean {
    return this.authService.canEditCategorias();
  }

  // Insumos
  canCreateInsumo(): boolean {
    return this.authService.canEditInsumos();
  }

  canEditInsumo(): boolean {
    return this.authService.canEditInsumos();
  }

  canDeleteInsumo(): boolean {
    return this.authService.canEditInsumos();
  }

  // Movimentações
  canCreateMovimentacao(): boolean {
    return this.authService.canCreateMovimentacao();
  }

  canEditMovimentacao(): boolean {
    return this.authService.canEditMovimentacao();
  }

  canDeleteMovimentacao(): boolean {
    return this.authService.canEditMovimentacao();
  }

  canViewAllMovimentacoes(): boolean {
    return this.authService.isAdmin();
  }

  // Dashboard
  canAccessDashboard(): boolean {
    return this.authService.canAccessDashboard();
  }

  // Perfil
  canEditProfile(userId?: number): boolean {
    return this.authService.isAdmin() || this.authService.canAccessProfile(userId);
  }

  canViewAdminFeatures(): boolean {
    return this.authService.isAdmin();
  }
}
