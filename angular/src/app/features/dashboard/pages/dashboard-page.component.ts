import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import {
  DashboardResponse,
  DashboardService,
} from '../data/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly dashboard = signal<DashboardResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly searchTerm = signal('');
  protected readonly syncTime = signal(this.getCurrentTime());

  constructor() {
    this.loadDashboard();
  }

  protected get userEmail(): string {
    return this.authService.getSession()?.usuario.email ?? 'operador@blackbox.tec';
  }

  protected get criticalItems() {
    const dashboard = this.dashboard();
    const query = this.searchTerm().trim().toLowerCase();

    if (!dashboard) {
      return [];
    }

    if (!query) {
      return dashboard.listaCritica;
    }

    return dashboard.listaCritica.filter(
      (item) =>
        item.nome.toLowerCase().includes(query) ||
        item.codigo.toLowerCase().includes(query) ||
        item.categoria.toLowerCase().includes(query),
    );
  }

  protected updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  protected getCriticalUsageRate(): number {
    const dashboard = this.dashboard();

    if (!dashboard || dashboard.indicadores.totalInsumosAtivos === 0) {
      return 0;
    }

    return (
      ((dashboard.indicadores.itensAbaixoMinimo + dashboard.indicadores.itensSemEstoque) /
        dashboard.indicadores.totalInsumosAtivos) *
      100
    );
  }

  protected getOutOfStockRate(): number {
    const dashboard = this.dashboard();

    if (!dashboard || dashboard.indicadores.totalInsumosAtivos === 0) {
      return 0;
    }

    return (
      (dashboard.indicadores.itensSemEstoque / dashboard.indicadores.totalInsumosAtivos) *
      100
    );
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  protected goToInsumos(): void {
    void this.router.navigateByUrl('/insumos');
  }

  protected goToMovimentacoes(): void {
    void this.router.navigateByUrl('/movimentacoes');
  }

  protected goToNovaMovimentacao(): void {
    void this.router.navigate(['/movimentacoes'], { queryParams: { novo: '1' } });
  }

  protected goToCategorias(): void {
    void this.router.navigateByUrl('/categorias');
  }

  protected reload(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.dashboardService
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboard) => {
          this.dashboard.set(dashboard);
          this.syncTime.set(this.getCurrentTime());
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(
            error.error?.message ?? 'Nao foi possivel sincronizar o painel operacional.',
          );
          this.loading.set(false);
        },
      });
  }

  private getCurrentTime(): string {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formatter.format(new Date());
  }
}
