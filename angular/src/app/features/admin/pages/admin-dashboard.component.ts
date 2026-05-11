import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
              placeholder="BUSCAR POR CODIGO OU NOME..."
              (input)="updateSearchTerm($any($event.target).value)"
            />
          </label>

          <!-- CABEÇALHO COM EMAIL E ROLE -->
          <div class="flex items-center justify-start gap-3 lg:justify-end">
            <span class="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {{ userEmail }}
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

            <!-- Painel Admin está ATIVO (Highlight com background primary) -->
            <button
              *ngIf="auth.isAdmin()"
              type="button"
              class="flex min-h-[52px] items-center gap-3 border-b border-[var(--outline)] bg-[var(--primary)] px-5 text-left text-[var(--primary-ink)]"
            >
              <span class="text-[15px]">◬</span>
              <span class="font-[var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em]">Painel Admin</span>
            </button>
          </nav>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="px-4 py-5 md:px-5 xl:px-7">
          <div class="mx-auto w-full max-w-[1180px]">
            
            <!-- Restrição visual se não for admin (Segurança extra) -->
            <div *ngIf="!auth.isAdmin()" class="border border-[rgb(255_157_136_/_0.55)] bg-[var(--surface-low)] px-5 py-4">
              <span class="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.14em] text-[var(--danger)]">
                ⛔ Acesso Restrito - Apenas Administradores
              </span>
            </div>

            <!-- Dashboard Admin Content -->
            <div *ngIf="auth.isAdmin()">
              <section class="mb-8 flex flex-col gap-4">
                <div>
                  <h1 class="font-[var(--font-display)] text-[30px] leading-none font-black text-[var(--text)] sm:text-[40px]">
                    PAINEL ADMINISTRATIVO
                  </h1>
                  <p class="mt-3 flex flex-wrap gap-4 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    <span><span class="text-[var(--danger)]">■</span> Acesso Restrito</span>
                    <span><span class="text-[var(--info)]">■</span> Controle Central de Permissões</span>
                  </p>
                </div>
              </section>

              <!-- Grid de Funcionalidades -->
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
                
                <!-- Card Usuários -->
                <article class="flex flex-col justify-between border border-[var(--outline)] bg-[var(--surface-low)] p-6 transition hover:border-[var(--primary)]">
                  <div>
                    <h3 class="font-[var(--font-display)] text-[18px] font-black text-[var(--text)] uppercase tracking-wide">👥 Usuários</h3>
                    <p class="mt-3 font-[var(--font-body)] text-[12px] text-[var(--text-muted)] leading-relaxed">
                      Promover ou rebaixar usuários entre privilégios de administrador e funcionário.
                    </p>
                  </div>
                  <button type="button" (click)="goToUsuarios()" class="mt-6 h-[40px] w-full bg-[var(--surface)] border border-[var(--outline-strong)] font-[var(--font-body)] text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text)] transition hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] hover:border-[var(--primary)]">
                    Gerenciamento
                  </button>
                </article>

                <!-- Card Categorias -->
                <article class="flex flex-col justify-between border border-[var(--outline)] bg-[var(--surface-low)] p-6 transition hover:border-[var(--primary)]">
                  <div>
                    <h3 class="font-[var(--font-display)] text-[18px] font-black text-[var(--text)] uppercase tracking-wide">📦 Categorias</h3>
                    <p class="mt-3 font-[var(--font-body)] text-[12px] text-[var(--text-muted)] leading-relaxed">
                      Criar, editar e deletar categorias de insumos. Modificações refletem no sistema global.
                    </p>
                  </div>
                  <button type="button" (click)="goToCategorias()" class="mt-6 h-[40px] w-full bg-[var(--surface)] border border-[var(--outline-strong)] font-[var(--font-body)] text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text)] transition hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] hover:border-[var(--primary)]">
                    Gerenciar Categorias
                  </button>
                </article>

                <!-- Card Insumos -->
                <article class="flex flex-col justify-between border border-[var(--outline)] bg-[var(--surface-low)] p-6 transition hover:border-[var(--primary)]">
                  <div>
                    <h3 class="font-[var(--font-display)] text-[18px] font-black text-[var(--text)] uppercase tracking-wide">🔧 Insumos</h3>
                    <p class="mt-3 font-[var(--font-body)] text-[12px] text-[var(--text-muted)] leading-relaxed">
                      Catálogo central de itens. Administradores podem criar ou apagar insumos.
                    </p>
                  </div>
                  <button type="button" (click)="goToInsumos()" class="mt-6 h-[40px] w-full bg-[var(--surface)] border border-[var(--outline-strong)] font-[var(--font-body)] text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text)] transition hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] hover:border-[var(--primary)]">
                    Gerenciar Insumos
                  </button>
                </article>

                <!-- Card Dashboard -->
                <article class="flex flex-col justify-between border border-[var(--outline)] bg-[var(--surface-low)] p-6 transition hover:border-[var(--primary)]">
                  <div>
                    <h3 class="font-[var(--font-display)] text-[18px] font-black text-[var(--text)] uppercase tracking-wide">📊 Dashboard</h3>
                    <p class="mt-3 font-[var(--font-body)] text-[12px] text-[var(--text-muted)] leading-relaxed">
                      Visualizar estatísticas gerais do sistema, consumo e métricas de desempenho.
                    </p>
                  </div>
                  <button type="button" (click)="goToDashboard()" class="mt-6 h-[40px] w-full bg-[var(--surface)] border border-[var(--outline-strong)] font-[var(--font-body)] text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text)] transition hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] hover:border-[var(--primary)]">
                    Ver Dashboard
                  </button>
                </article>
              </div>

              <!-- Permissões List -->
              <section class="border-l-[3px] border-[var(--info)] bg-[var(--surface-low)] px-6 py-6">
                <h2 class="font-[var(--font-display)] text-[18px] font-black uppercase text-[var(--text)]">Recursos de Administração</h2>
                
                <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div class="flex items-center gap-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3">
                    <span class="text-[var(--info)] font-bold text-[14px]">✓</span>
                    <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text)]">Criar, editar e deletar categorias</span>
                  </div>
                  <div class="flex items-center gap-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3">
                    <span class="text-[var(--info)] font-bold text-[14px]">✓</span>
                    <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text)]">Criar, editar e deletar insumos</span>
                  </div>
                  <div class="flex items-center gap-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3">
                    <span class="text-[var(--info)] font-bold text-[14px]">✓</span>
                    <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text)]">Editar e deletar movimentações</span>
                  </div>
                  <div class="flex items-center gap-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3">
                    <span class="text-[var(--info)] font-bold text-[14px]">✓</span>
                    <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text)]">Promover e rebaixar usuários</span>
                  </div>
                  <div class="flex items-center gap-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3">
                    <span class="text-[var(--info)] font-bold text-[14px]">✓</span>
                    <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text)]">Editar perfil de qualquer usuário</span>
                  </div>
                  <div class="flex items-center gap-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3">
                    <span class="text-[var(--info)] font-bold text-[14px]">✓</span>
                    <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text)]">Visualizar todas as movimentações</span>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [] // Estilos removidos pois o Tailwind agora faz todo o trabalho via classes utilitárias
})
export class AdminDashboardComponent {
  
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  get userEmail(): string {
    return this.auth.getCurrentUser()?.email ?? 'admin@blackbox.tec';
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  updateSearchTerm(term: string): void {
    // Busca global pode ser implementada aqui no futuro
    console.log('Buscando:', term);
  }

  goToDashboard(): void {
    void this.router.navigateByUrl('/dashboard');
  }

  goToInsumos(): void {
    void this.router.navigateByUrl('/insumos');
  }

  goToMovimentacoes(): void {
    void this.router.navigateByUrl('/movimentacoes');
  }

  goToCategorias(): void {
    void this.router.navigateByUrl('/categorias');
  }

  goToUsuarios(): void {
    void this.router.navigateByUrl('/usuarios');
  }

  // Não precisamos de um goToAdmin(), pois já estamos nesta página.
}