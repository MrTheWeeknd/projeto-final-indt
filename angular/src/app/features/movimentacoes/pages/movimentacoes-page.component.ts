import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { PermissionsService } from '../../../core/auth/permissions.service';
import { Insumo, InsumosService } from '../../insumos/data/insumos.service';
import {
  CreateMovimentacaoPayload,
  MotivoMovimentacao,
  Movimentacao,
  MovimentacoesService,
  TipoMovimentacao,
} from '../data/movimentacoes.service';

type PeriodoFiltro = 'todos' | 'hoje' | '7' | '30';
type TipoFiltro = 'todos' | TipoMovimentacao;
type MotivoFiltro = 'todos' | MotivoMovimentacao;

const motivos: MotivoMovimentacao[] = ['compra', 'devolucao', 'consumo', 'perda', 'ajuste'];

@Component({
  selector: 'app-movimentacoes-page',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './movimentacoes-page.component.html',
  styleUrl: './movimentacoes-page.component.css',
})
export class MovimentacoesPageComponent {
  private readonly movimentacoesService = inject(MovimentacoesService);
  private readonly insumosService = inject(InsumosService);
  private readonly authService = inject(AuthService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly movimentacoes = signal<Movimentacao[]>([]);
  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly formMessage = signal('');
  protected readonly searchTerm = signal('');
  protected readonly periodoFiltro = signal<PeriodoFiltro>('30');
  protected readonly tipoFiltro = signal<TipoFiltro>('todos');
  protected readonly motivoFiltro = signal<MotivoFiltro>('todos');
  protected readonly showCreateForm = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly motivos = motivos;
  protected readonly syncTime = signal(this.getCurrentTime());

  protected readonly movimentacaoForm = this.formBuilder.nonNullable.group({
    insumoId: [0, [Validators.required, Validators.min(1)]],
    tipo: ['entrada' as TipoMovimentacao, [Validators.required]],
    motivo: ['compra' as MotivoMovimentacao, [Validators.required]],
    quantidade: [1, [Validators.required, Validators.min(0.01)]],
    linhaDestino: ['', [Validators.maxLength(120)]],
    observacao: ['', [Validators.maxLength(255)]],
  });

  protected readonly filteredMovimentacoes = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const periodo = this.periodoFiltro();
    const tipo = this.tipoFiltro();
    const motivo = this.motivoFiltro();
    const minDate = this.getMinDate(periodo);

    return this.movimentacoes().filter((movimentacao) => {
      const data = new Date(movimentacao.dataHora);
      const matchesPeriod = !minDate || data >= minDate;
      const matchesTipo = tipo === 'todos' || movimentacao.tipo === tipo;
      const matchesMotivo = motivo === 'todos' || movimentacao.motivo === motivo;
      const matchesSearch =
        !query ||
        movimentacao.insumo.nome.toLowerCase().includes(query) ||
        movimentacao.insumo.codigo.toLowerCase().includes(query) ||
        movimentacao.motivo.toLowerCase().includes(query) ||
        (movimentacao.linhaDestino ?? '').toLowerCase().includes(query) ||
        (movimentacao.observacao ?? '').toLowerCase().includes(query);

      return matchesPeriod && matchesTipo && matchesMotivo && matchesSearch;
    });
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredMovimentacoes().length / this.pageSize)),
  );

  protected readonly paginatedMovimentacoes = computed(() => {
    const currentPage = Math.min(this.page(), this.totalPages());
    const start = (currentPage - 1) * this.pageSize;
    return this.filteredMovimentacoes().slice(start, start + this.pageSize);
  });

  protected readonly entradasTotal = computed(() =>
    this.filteredMovimentacoes()
      .filter((movimentacao) => movimentacao.tipo === 'entrada')
      .reduce((total, movimentacao) => total + movimentacao.quantidade, 0),
  );

  protected readonly saidasTotal = computed(() =>
    this.filteredMovimentacoes()
      .filter((movimentacao) => movimentacao.tipo === 'saida')
      .reduce((total, movimentacao) => total + movimentacao.quantidade, 0),
  );

  constructor() {
    this.showCreateForm.set(this.route.snapshot.queryParamMap.get('novo') === '1');
    this.loadData();
  }

  protected get userEmail(): string {
    return this.authService.getSession()?.usuario.email ?? 'operador@blackbox.tec';
  }

  protected canManageMovimentacoes(): boolean {
    return this.permissionsService.canEditMovimentacao();
  }

  protected updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
  }

  protected updatePeriodoFiltro(periodo: PeriodoFiltro): void {
    this.periodoFiltro.set(periodo);
    this.page.set(1);
  }

  protected updateTipoFiltro(tipo: TipoFiltro): void {
    this.tipoFiltro.set(tipo);
    this.page.set(1);
  }

  protected updateMotivoFiltro(motivo: MotivoFiltro): void {
    this.motivoFiltro.set(motivo);
    this.page.set(1);
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  protected nextPage(): void {
    this.page.update((page) => Math.min(this.totalPages(), page + 1));
  }

  protected goToDashboard(): void {
    void this.router.navigateByUrl('/dashboard');
  }

  protected goToInsumos(): void {
    void this.router.navigateByUrl('/insumos');
  }

  protected goToCategorias(): void {
    void this.router.navigateByUrl('/categorias');
  }

  // Adicione isso no seu movimentacoes-page.component.ts
  protected isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  protected hasMovimentacoesPermission(): boolean {
    const user = this.authService.getCurrentUser();
    // Por padrão (se não tiver a coluna setada), senao retorna o valor salvo.
    return user?.permissoes?.movimentacoes !== false;
  }

  protected goToAdmin(): void {
    void this.router.navigateByUrl('/admin');
  }


  protected toggleCreateForm(): void {
    this.showCreateForm.update((value) => !value);
    this.formMessage.set('');
  }

  protected submitMovimentacao(): void {
    const session = this.authService.getSession();

    if (!session) {
      this.logout();
      return;
    }

    if (this.movimentacaoForm.invalid || this.saving()) {
      this.movimentacaoForm.markAllAsTouched();
      return;
    }

    const raw = this.movimentacaoForm.getRawValue();
    const payload: CreateMovimentacaoPayload = {
      insumoId: raw.insumoId,
      usuarioId: session.usuario.id,
      tipo: raw.tipo,
      motivo: raw.motivo,
      quantidade: raw.quantidade,
    };

    if (raw.linhaDestino.trim()) {
      payload.linhaDestino = raw.linhaDestino.trim();
    }

    if (raw.observacao.trim()) {
      payload.observacao = raw.observacao.trim();
    }

    this.saving.set(true);
    this.formMessage.set('');

    this.movimentacoesService
      .createMovimentacao(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movimentacao) => {
          this.movimentacoes.update((items) =>
            [movimentacao, ...items].sort(
              (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime(),
            ),
          );
          this.reloadInsumos();
          this.movimentacaoForm.reset({
            insumoId: 0,
            tipo: 'entrada',
            motivo: 'compra',
            quantidade: 1,
            linhaDestino: '',
            observacao: '',
          });
          this.formMessage.set('Movimentacao registrada com sucesso.');
          this.showCreateForm.set(false);
          this.syncTime.set(this.getCurrentTime());
          this.saving.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.formMessage.set(
            error.error?.message ?? 'Nao foi possivel registrar a movimentacao.',
          );
          this.saving.set(false);
        },
      });
  }

  protected deleteMovimentacao(movimentacao: Movimentacao): void {
    if (this.deletingId()) {
      return;
    }

    this.deletingId.set(movimentacao.id);
    this.errorMessage.set('');

    this.movimentacoesService
      .deleteMovimentacao(movimentacao.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.movimentacoes.update((items) => items.filter((item) => item.id !== movimentacao.id));
          this.reloadInsumos();
          this.syncTime.set(this.getCurrentTime());
          this.deletingId.set(null);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(error.error?.message ?? 'Nao foi possivel remover a movimentacao.');
          this.deletingId.set(null);
        },
      });
  }

  protected reload(): void {
    this.loadData();
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  protected formatMotivo(motivo: string): string {
    return motivo.replace('_', ' ');
  }

  private loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      movimentacoes: this.movimentacoesService.listMovimentacoes(),
      insumos: this.insumosService.listInsumos(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ movimentacoes, insumos }) => {
          this.movimentacoes.set(
            movimentacoes.sort(
              (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime(),
            ),
          );
          this.insumos.set(insumos.filter((insumo) => insumo.ativo));
          this.syncTime.set(this.getCurrentTime());
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(
            error.error?.message ?? 'Nao foi possivel carregar as movimentacoes.',
          );
          this.loading.set(false);
        },
      });
  }

  private reloadInsumos(): void {
    this.insumosService
      .listInsumos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((insumos) => this.insumos.set(insumos.filter((insumo) => insumo.ativo)));
  }

  private getMinDate(periodo: PeriodoFiltro): Date | null {
    const now = new Date();

    if (periodo === 'hoje') {
      now.setHours(0, 0, 0, 0);
      return now;
    }

    if (periodo === '7' || periodo === '30') {
      now.setDate(now.getDate() - Number(periodo));
      return now;
    }

    return null;
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
  }
}
