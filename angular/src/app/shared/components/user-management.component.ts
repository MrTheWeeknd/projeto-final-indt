import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { UserManagementService, type User } from '../../core/auth/user-management.service';

interface UserPermissions {
  dashboard: boolean;
  insumos: boolean;
  categorias: boolean;
  movimentacoes: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="min-h-dvh bg-[var(--surface)] text-[var(--text)]">
      <!-- HEADER -->
      <header class="border-b border-[var(--outline)] bg-[#171717]">
        <div
          class="mx-auto grid min-h-[56px] max-w-[1480px] grid-cols-1 items-center gap-3 px-4 py-3 lg:grid-cols-[120px_360px_1fr] lg:gap-5 lg:px-0 lg:py-0"
        >
          <div class="font-[var(--font-display)] text-[22px] leading-none font-black text-[var(--primary)]">
            BLACKBOX
          </div>

          <label class="flex h-[40px] items-center gap-3 border border-[var(--outline)] bg-[#101010] px-3.5">
            <span class="text-[var(--text-muted)]">⌕</span>
            <input
              class="h-full w-full border-0 bg-transparent font-[var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)]"
              type="search"
              placeholder="BUSCAR GLOBAL..."
              (input)="updateSearchTerm($any($event.target).value)"
            />
          </label>

          <!-- CABEÇALHO COM EMAIL E ROLE -->
          <div class="flex items-center justify-start gap-3 lg:justify-end">
            <span class="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {{ getUserEmail }}
            </span>
            
            <span 
              class="px-2 py-1 font-[var(--font-mono)] text-[9px] font-black uppercase tracking-[0.12em]"
              [ngClass]="auth.isAdmin() ? 'bg-[var(--danger)] text-white' : 'bg-[var(--surface-low)] text-[var(--text-muted)] border border-[var(--outline)]'">
              {{ auth.isAdmin() ? 'ADMIN' : 'FUNCIONÁRIO' }}
            </span>

            <button
              type="button"
              (click)="logout()"
              class="h-[32px] border border-[var(--outline-strong)] px-3 font-[var(--font-body)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div class="grid min-h-[calc(100dvh-56px)] grid-cols-1 xl:grid-cols-[198px_minmax(0,1fr)]">
        <!-- SIDEBAR -->
        <aside class="flex flex-col border-r border-[var(--outline)] bg-[var(--surface-low)]">
          <div class="border-b border-[var(--outline)] px-5 py-6">
            <h2 class="font-[var(--font-display)] text-[15px] leading-none font-black text-[var(--primary)]">
              ESTOQUE
            </h2>
            <span class="mt-3 block font-[var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              V 2.4.0
            </span>
          </div>

          <nav class="grid">
            <button
              type="button"
              (click)="goToDashboard()"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] px-5 text-left text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              <span class="text-[15px]">▦</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Dashboard</span>
            </button>

            <button
              type="button"
              (click)="goToInsumos()"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] px-5 text-left text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              <span class="text-[15px]">▰</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Insumos</span>
            </button>

            <button
              type="button"
              (click)="goToMovimentacoes()"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] px-5 text-left text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <span class="text-[15px]">↔</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Movimentações</span>
            </button>

            <button
              type="button"
              (click)="goToCategorias()"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] px-5 text-left text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <span class="text-[15px]">▲</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Categorias</span>
            </button>

            <!-- Usuários está ATIVO -->
            <button
              *ngIf="auth.isAdmin()"
              type="button"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] bg-[var(--primary)] px-5 text-left text-[var(--primary-ink)] transition"
            >
              <span class="text-[15px]">◈</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Usuários</span>
            </button>

            <button
              *ngIf="auth.isAdmin()"
              type="button"
              (click)="goToAdmin()"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] px-5 text-left text-[#ff7675] hover:brightness-125"
            >
              <span class="text-[15px]">◬</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Painel Admin</span>
            </button>
          </nav>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="px-4 py-5 md:px-5 xl:px-7 relative">
          <div class="mx-auto w-full max-w-[1180px]">
            
            <div *ngIf="!auth.isAdmin()" class="border border-[rgb(255_157_136_/_0.55)] bg-[var(--surface-low)] px-5 py-4">
              <span class="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.14em] text-[var(--danger)]">
                ⛔ Acesso Restrito - Apenas Administradores
              </span>
            </div>

            <div *ngIf="auth.isAdmin()">
              <section class="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h1 class="font-[var(--font-display)] text-[30px] leading-none font-black text-[var(--text)] sm:text-[40px]">
                    GERENCIAMENTO DE USUÁRIOS
                  </h1>
                  <p class="mt-3 flex flex-wrap gap-4 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    <span><span class="text-[var(--info)]">■</span> Controle de acessos e privilégios</span>
                    <span><span class="text-[var(--danger)]">■</span> Ações restritas ao sistema</span>
                  </p>
                </div>
              </section>

              <!-- Barra de Pesquisa Local -->
              <div class="mb-6">
                <label class="flex h-[44px] w-full max-w-[400px] items-center gap-3 border border-[var(--outline-strong)] bg-[#101010] px-4 focus-within:border-[var(--primary)] transition">
                  <span class="text-[var(--text-muted)]">⌕</span>
                  <input
                    class="h-full w-full border-0 bg-transparent font-[var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)]"
                    type="search"
                    placeholder="BUSCAR POR EMAIL DO USUÁRIO..."
                    [(ngModel)]="searchTerm"
                    (ngModelChange)="filterUsers()"
                  />
                </label>
              </div>

              <!-- Tabela / Grid de Usuários -->
              <section class="overflow-hidden border border-[var(--outline)] bg-[var(--surface-low)]">
                <div class="hidden grid-cols-[1fr_120px_350px] gap-4 bg-[rgba(255,255,255,0.06)] px-5 py-4 xl:grid">
                  <span class="font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Email da Conta</span>
                  <span class="font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Privilégio</span>
                  <span class="font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] text-right">Ações de Controle</span>
                </div>

                <div>
                  <div *ngIf="loading" class="px-5 py-8 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] text-center">
                    CARREGANDO DADOS...
                  </div>
                  <div *ngIf="error" class="px-5 py-8 border-l-[3px] border-[var(--danger)] font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--danger)]">
                    {{ error }}
                  </div>
                  <div *ngIf="!loading && !error && filteredUsers.length === 0" class="px-5 py-8 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] text-center">
                    Nenhum usuário encontrado na busca.
                  </div>

                  <!-- Lista de Usuários -->
                  <ng-container *ngIf="!loading && !error">
                    <div 
                      *ngFor="let user of filteredUsers" 
                      class="grid gap-3 border-t border-[rgba(255,255,255,0.04)] px-5 py-4 xl:grid-cols-[1fr_120px_350px] xl:items-center xl:gap-4 transition hover:bg-[rgba(255,255,255,0.02)]"
                    >
                      <span class="font-[var(--font-body)] text-[14px] font-bold text-[var(--text)] truncate">
                        {{ user.email }}
                      </span>

                      <span>
                        <span 
                          class="inline-flex min-h-[28px] items-center px-3 font-[var(--font-body)] text-[10px] font-black uppercase tracking-[0.08em]"
                          [ngClass]="user.role === 'admin' ? 'bg-[#332523] text-[var(--danger)]' : 'bg-[#202a31] text-[var(--info)]'">
                          {{ user.role === 'admin' ? 'ADMIN' : 'FUNCIONÁRIO' }}
                        </span>
                      </span>

                      <div class="flex flex-wrap justify-start xl:justify-end gap-2">
                        <!-- Botão de Ajustar Acessos -->
                        <button 
                          (click)="openEditPermissions(user)"
                          [disabled]="loading"
                          class="h-[32px] border border-[var(--outline-strong)] bg-transparent px-3 font-[var(--font-body)] text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50"
                        >
                          ⚙️ Acessos
                        </button>

                        <button 
                          *ngIf="user.role === 'user'" 
                          (click)="promoverParaAdmin(user)"
                          [disabled]="loading"
                          class="h-[32px] border border-[var(--outline-strong)] bg-transparent px-3 font-[var(--font-body)] text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] transition hover:border-[var(--info)] hover:text-[var(--info)] disabled:opacity-50"
                        >
                          Promover p/ Admin
                        </button>

                        <button 
                          *ngIf="user.role === 'admin' && user.id !== currentUserId" 
                          (click)="rebaixarParaUsuario(user)"
                          [disabled]="loading"
                          class="h-[32px] border border-[var(--outline-strong)] bg-transparent px-3 font-[var(--font-body)] text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] transition hover:border-[var(--danger)] hover:text-[var(--danger)] disabled:opacity-50"
                        >
                          Rebaixar p/ Func.
                        </button>

                        <span 
                          *ngIf="user.role === 'admin' && user.id === currentUserId" 
                          class="flex h-[32px] items-center px-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]"
                        >
                          VOCÊ
                        </span>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <!-- MODAL DE PERMISSÕES GRANULARES -->
      <div *ngIf="editingUser" class="fixed inset-0 z-[100] grid place-items-center bg-black/80 px-4 backdrop-blur-sm">
        <div class="w-full max-w-[500px] border border-[var(--outline)] bg-[var(--surface-low)] shadow-2xl">
          <!-- Modal Header -->
          <header class="flex items-start justify-between border-b border-[var(--outline)] px-6 py-5">
            <div>
              <h2 class="font-[var(--font-display)] text-[18px] font-black leading-none text-[var(--text)] uppercase">
                Controle Granular
              </h2>
              <span class="mt-2 block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {{ editingUser.email }}
              </span>
            </div>
            <button
              type="button"
              (click)="closeEditPermissions()"
              class="h-8 w-8 text-[var(--text-muted)] transition hover:text-[var(--danger)]"
            >
              ✕
            </button>
          </header>

          <!-- Modal Body -->
          <div class="p-6">
            <!-- Aviso para Admins -->
            <div *ngIf="editingUser.role === 'admin'" class="mb-5 border-l-[3px] border-[var(--danger)] bg-[#332523] px-4 py-3">
              <span class="block font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--danger)]">
                ACESSO IRRESTRITO
              </span>
              <span class="mt-1 block font-[var(--font-body)] text-[11px] text-[var(--text-muted)]">
                Este usuário é Administrador. Ele possui acesso total a todos os módulos, ignorando regras granulares.
              </span>
            </div>

            <!-- Lista de Toggles -->
            <div class="grid gap-4" [class.opacity-50]="editingUser.role === 'admin'" [class.pointer-events-none]="editingUser.role === 'admin'">
              
              <label class="flex cursor-pointer items-center justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-4 transition hover:bg-[rgba(255,255,255,0.04)]">
                <div>
                  <span class="block font-[var(--font-body)] text-[13px] font-bold text-[var(--text)] uppercase tracking-wide">Dashboard</span>
                  <span class="block font-[var(--font-body)] text-[11px] text-[var(--text-muted)] mt-1">Ver gráficos e estatísticas gerais</span>
                </div>
                <input type="checkbox" [(ngModel)]="userPermissions.dashboard" class="h-5 w-5 accent-[var(--primary)]" />
              </label>

              <label class="flex cursor-pointer items-center justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-4 transition hover:bg-[rgba(255,255,255,0.04)]">
                <div>
                  <span class="block font-[var(--font-body)] text-[13px] font-bold text-[var(--text)] uppercase tracking-wide">Insumos</span>
                  <span class="block font-[var(--font-body)] text-[11px] text-[var(--text-muted)] mt-1">Visualizar lista e detalhes do estoque</span>
                </div>
                <input type="checkbox" [(ngModel)]="userPermissions.insumos" class="h-5 w-5 accent-[var(--primary)]" />
              </label>

              <label class="flex cursor-pointer items-center justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-4 transition hover:bg-[rgba(255,255,255,0.04)]">
                <div>
                  <span class="block font-[var(--font-body)] text-[13px] font-bold text-[var(--text)] uppercase tracking-wide">Categorias</span>
                  <span class="block font-[var(--font-body)] text-[11px] text-[var(--text-muted)] mt-1">Visualizar estrutura de categorias</span>
                </div>
                <input type="checkbox" [(ngModel)]="userPermissions.categorias" class="h-5 w-5 accent-[var(--primary)]" />
              </label>

              <label class="flex cursor-pointer items-center justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-4 transition hover:bg-[rgba(255,255,255,0.04)]">
                <div>
                  <span class="block font-[var(--font-body)] text-[13px] font-bold text-[var(--text)] uppercase tracking-wide">Movimentações</span>
                  <span class="block font-[var(--font-body)] text-[11px] text-[var(--text-muted)] mt-1">Acessar histórico de entrada/saída</span>
                </div>
                <input type="checkbox" [(ngModel)]="userPermissions.movimentacoes" class="h-5 w-5 accent-[var(--primary)]" />
              </label>

            </div>
          </div>

          <!-- Modal Footer -->
          <footer class="flex items-center justify-end gap-3 border-t border-[var(--outline)] px-6 py-4 bg-[rgba(0,0,0,0.2)]">
            <button
              type="button"
              (click)="closeEditPermissions()"
              class="h-[38px] px-5 font-[var(--font-body)] text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="savePermissions()"
              [disabled]="savingPermissions || editingUser.role === 'admin'"
              class="h-[38px] bg-[var(--primary)] px-6 font-[var(--font-body)] text-[11px] font-black uppercase tracking-[0.12em] text-[var(--primary-ink)] disabled:opacity-50"
            >
              {{ savingPermissions ? 'SALVANDO...' : 'SALVAR REGRAS' }}
            </button>
          </footer>
        </div>
      </div>

    </section>
  `,
  styles: [] 
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  loading = false;
  error = '';
  currentUserId = 0;

  // Estado do modal de permissões
  editingUser: User | null = null;
  savingPermissions = false;
  userPermissions: UserPermissions = {
    dashboard: false,
    insumos: false,
    categorias: false,
    movimentacoes: false
  };

  constructor(
    public auth: AuthService,
    private userManagementService: UserManagementService,
    private router: Router,
    private http: HttpClient,          // <-- NOVO: Injetado para requisição direta
    private cdr: ChangeDetectorRef     // <-- NOVO: Injetado para forçar atualização da UI
  ) {
    const user = this.auth.getCurrentUser();
    this.currentUserId = user?.id || 0;
  }

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.loadUsers();
    }
  }

  get getUserEmail(): string {
    return this.auth.getCurrentUser()?.email ?? 'admin@blackbox.tec';
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  updateSearchTerm(term: string): void {
    console.log('Buscando global:', term);
  }

  goToDashboard(): void { void this.router.navigateByUrl('/dashboard'); }
  goToInsumos(): void { void this.router.navigateByUrl('/insumos'); }
  goToMovimentacoes(): void { void this.router.navigateByUrl('/movimentacoes'); }
  goToCategorias(): void { void this.router.navigateByUrl('/categorias'); }
  goToAdmin(): void { void this.router.navigateByUrl('/admin'); }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.userManagementService.listarUsuarios().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.loading = false;
        this.cdr.detectChanges(); // Força atualização visual
      },
      error: (err) => {
        this.error = 'ERRO AO CARREGAR: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // ---- LÓGICA DE PERMISSÕES GRANULARES ----

  openEditPermissions(user: User): void {
    this.editingUser = user;
    
    // Lê as permissões existentes ou assume "true" para usuários que ainda não possuem JSON salvo
    const permissoesExistentes = (user as any).permissoes || {
      dashboard: true,
      insumos: true,
      categorias: true,
      movimentacoes: true
    };

    this.userPermissions = { ...permissoesExistentes };
    this.cdr.detectChanges();
  }

  closeEditPermissions(): void {
    this.editingUser = null;
    this.savingPermissions = false;
    this.cdr.detectChanges(); // Força o Angular a remover o modal da tela imediatamente
  }

  savePermissions(): void {
    if (!this.editingUser) return;
    
    this.savingPermissions = true;
    this.cdr.detectChanges(); // Garante que o botão muda visualmente para "SALVANDO..."

    const apiUrl = `http://localhost:6060/api/usuarios/${this.editingUser.id}/permissoes`;

    // Dispara a requisição de forma independente contornando o UserManagementService para evitar quebras silenciosas
    this.http.patch(apiUrl, { permissoes: this.userPermissions }).subscribe({
      next: (updatedUser: any) => {
        // Sucesso garantido (Recebeu o 200 OK da API)
        this.savingPermissions = false;
        
        // Atualiza a tabela na interface imediatamente com os dados locais
        if (this.editingUser) {
          (this.editingUser as any).permissoes = { ...this.userPermissions };
          const index = this.users.findIndex(u => u.id === this.editingUser!.id);
          
          if (index > -1) {
            // Se o backend retornou o user completo, usamos ele. Se não, mantemos o local.
            this.users[index] = (updatedUser && updatedUser.id) 
              ? updatedUser 
              : { ...this.users[index], permissoes: this.userPermissions };
          }
        }
        
        this.filterUsers();
        this.closeEditPermissions(); // Este método fecha o modal e executa detectChanges()
      },
      error: (err: any) => {
        this.savingPermissions = false;
        this.cdr.detectChanges();
        alert('Erro ao guardar permissões: ' + (err?.error?.message || err?.message || 'Falha de conexão'));
      }
    });
  }

  // ---- ADMIN AÇÕES DE PRIVILÉGIO ----

  promoverParaAdmin(user: User): void {
    if (confirm(`Atenção: Tem certeza que deseja conceder acesso total de Administrador para [${user.email}]?`)) {
      this.loading = true;
      this.userManagementService.promoverParaAdmin(user.id).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index > -1) {
            this.users[index] = updatedUser;
          }
          this.filterUsers();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'FALHA NA PROMOÇÃO: ' + (err.error?.message || err.message);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  rebaixarParaUsuario(user: User): void {
    if (confirm(`Atenção: Tem certeza que deseja rebaixar [${user.email}] para Funcionário comum?`)) {
      this.loading = true;
      this.userManagementService.rebaixarParaUsuario(user.id).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index > -1) {
            this.users[index] = updatedUser;
          }
          this.filterUsers();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'FALHA NO REBAIXAMENTO: ' + (err.error?.message || err.message);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}