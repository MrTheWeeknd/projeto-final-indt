import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { PermissionsService } from '../../core/auth/permissions.service';

@Component({
  selector: 'app-permissions-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="permissions-panel">
      <h2>Painel de Permissões</h2>
      
      <div class="user-info" *ngIf="currentUser">
        <p><strong>Usuário:</strong> {{ currentUser.email }}</p>
        <p><strong>Role:</strong> 
          <span [ngClass]="currentUser.role === 'admin' ? 'role-admin' : 'role-user'">
            {{ currentUser.role === 'admin' ? 'ADMIN' : 'FUNCIONÁRIO' }}
          </span>
        </p>
      </div>

      <div class="permissions-grid">
        <div class="permission-section">
          <h3>Categorias</h3>
          <p *ngIf="permissions.canEditCategoria()" class="allowed">✓ Pode criar, editar e deletar</p>
          <p *ngIf="!permissions.canEditCategoria()" class="denied">✗ Apenas visualizar</p>
        </div>

        <div class="permission-section">
          <h3>Insumos</h3>
          <p *ngIf="permissions.canEditInsumo()" class="allowed">✓ Pode criar, editar e deletar</p>
          <p *ngIf="!permissions.canEditInsumo()" class="denied">✗ Apenas visualizar</p>
        </div>

        <div class="permission-section">
          <h3>Movimentações</h3>
          <p *ngIf="permissions.canCreateMovimentacao()" class="allowed">✓ Pode criar movimentações</p>
          <p *ngIf="permissions.canEditMovimentacao()" class="allowed">✓ Pode editar e deletar</p>
          <p *ngIf="!permissions.canEditMovimentacao()" class="info">ℹ Funcionário vê apenas suas</p>
        </div>

        <div class="permission-section">
          <h3>Dashboard</h3>
          <p *ngIf="permissions.canAccessDashboard()" class="allowed">✓ Acesso liberado</p>
        </div>

        <div class="permission-section">
          <h3>Perfil</h3>
          <p *ngIf="auth.isAdmin()" class="allowed">✓ Pode editar qualquer perfil</p>
          <p *ngIf="!auth.isAdmin()" class="info">ℹ Pode editar apenas seu perfil</p>
        </div>
      </div>

      <div class="admin-features" *ngIf="auth.isAdmin()">
        <h3>Recursos de Admin</h3>
        <p class="allowed">✓ Todos os acessos administrativos habilitados</p>
      </div>
    </div>
  `,
  styles: [`
    .permissions-panel {
      padding: 20px;
      max-width: 800px;
      margin: 20px auto;
      background: #f5f5f5;
      border-radius: 8px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    h3 {
      color: #555;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .user-info {
      background: white;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-left: 4px solid #007bff;
    }

    .user-info p {
      margin: 5px 0;
    }

    .role-admin {
      color: #d32f2f;
      font-weight: bold;
      background: #ffebee;
      padding: 2px 8px;
      border-radius: 3px;
    }

    .role-user {
      color: #1976d2;
      font-weight: bold;
      background: #e3f2fd;
      padding: 2px 8px;
      border-radius: 3px;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .permission-section {
      background: white;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #f57c00;
    }

    .permission-section p {
      margin: 5px 0;
      font-size: 13px;
    }

    .allowed {
      color: #388e3c;
      background: #e8f5e9;
      padding: 4px 8px;
      border-radius: 3px;
    }

    .denied {
      color: #d32f2f;
      background: #ffebee;
      padding: 4px 8px;
      border-radius: 3px;
    }

    .info {
      color: #1976d2;
      background: #e3f2fd;
      padding: 4px 8px;
      border-radius: 3px;
    }

    .admin-features {
      background: #c8e6c9;
      border-left: 4px solid #388e3c;
      padding: 15px;
      border-radius: 4px;
    }

    .admin-features .allowed {
      background: #a5d6a7;
      margin: 0;
      padding: 8px 12px;
    }
  `]
})
export class PermissionsPanelComponent implements OnInit {
  currentUser: any;

  constructor(
    public auth: AuthService,
    public permissions: PermissionsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
  }
}
