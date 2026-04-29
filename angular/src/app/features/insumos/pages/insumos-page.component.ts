import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { Categoria, CreateInsumoPayload, Insumo, InsumosService } from '../data/insumos.service';

type StatusFiltro = 'todos' | 'normal' | 'baixo' | 'zerado' | 'acima';
type StatusInsumo = Exclude<StatusFiltro, 'todos'>;

@Component({
  selector: 'app-insumos-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ReactiveFormsModule],
  templateUrl: './insumos-page.component.html',
  styleUrl: './insumos-page.component.css',
})
export class InsumosPageComponent {
  private readonly insumosService = inject(InsumosService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly formMessage = signal('');
  protected readonly searchTerm = signal('');
  protected readonly categoriaFiltro = signal('todas');
  protected readonly statusFiltro = signal<StatusFiltro>('todos');
  protected readonly showCreateForm = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly syncTime = signal(this.getCurrentTime());

  protected readonly insumoForm = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    descricao: ['', [Validators.maxLength(255)]],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
    unidadeMedida: ['un', [Validators.required, Validators.maxLength(30)]],
    estoqueAtual: [0, [Validators.required, Validators.min(0)]],
    estoqueMinimo: [0, [Validators.required, Validators.min(0)]],
    estoqueMaximo: [0, [Validators.min(0)]],
    localizacao: ['', [Validators.maxLength(120)]],
    ativo: [true],
  });

  protected readonly filteredInsumos = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const categoria = this.categoriaFiltro();
    const status = this.statusFiltro();

    return this.insumos().filter((insumo) => {
      const matchesSearch =
        !query ||
        insumo.codigo.toLowerCase().includes(query) ||
        insumo.nome.toLowerCase().includes(query) ||
        (insumo.descricao ?? '').toLowerCase().includes(query);

      const matchesCategoria = categoria === 'todas' || String(insumo.categoria.id) === categoria;
      const matchesStatus = status === 'todos' || this.getStatus(insumo) === status;

      return matchesSearch && matchesCategoria && matchesStatus;
    });
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredInsumos().length / this.pageSize)),
  );

  protected readonly paginatedInsumos = computed(() => {
    const currentPage = Math.min(this.page(), this.totalPages());
    const start = (currentPage - 1) * this.pageSize;
    return this.filteredInsumos().slice(start, start + this.pageSize);
  });

  protected readonly activeCategoriesCount = computed(
    () => new Set(this.insumos().filter((insumo) => insumo.ativo).map((insumo) => insumo.categoria.id)).size,
  );

  protected readonly criticalCount = computed(
    () => this.insumos().filter((insumo) => insumo.ativo && insumo.estoqueAtual <= insumo.estoqueMinimo).length,
  );

  protected readonly stockTurnoverRate = computed(() => {
    const items = this.insumos().filter((insumo) => insumo.ativo);
    if (items.length === 0) {
      return 0;
    }

    const healthyItems = items.filter(
      (insumo) => insumo.estoqueAtual > insumo.estoqueMinimo && this.getStatus(insumo) !== 'acima',
    );

    return (healthyItems.length / items.length) * 100;
  });

  constructor() {
    this.loadData();
  }

  protected get userEmail(): string {
    return this.authService.getSession()?.usuario.email ?? 'operador@blackbox.tec';
  }

  protected updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
  }

  protected updateCategoriaFiltro(categoriaId: string): void {
    this.categoriaFiltro.set(categoriaId);
    this.page.set(1);
  }

  protected updateStatusFiltro(status: StatusFiltro): void {
    this.statusFiltro.set(status);
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

  protected goToMovimentacoes(): void {
    void this.router.navigateByUrl('/movimentacoes');
  }

  protected goToCategorias(): void {
    void this.router.navigateByUrl('/categorias');
  }

  protected toggleCreateForm(): void {
    this.showCreateForm.update((value) => !value);
    this.formMessage.set('');
  }

  protected submitInsumo(): void {
    if (this.insumoForm.invalid || this.saving()) {
      this.insumoForm.markAllAsTouched();
      return;
    }

    const raw = this.insumoForm.getRawValue();
    const payload: CreateInsumoPayload = {
      codigo: raw.codigo.trim(),
      nome: raw.nome.trim(),
      categoriaId: raw.categoriaId,
      unidadeMedida: raw.unidadeMedida.trim(),
      estoqueAtual: raw.estoqueAtual,
      estoqueMinimo: raw.estoqueMinimo,
      ativo: raw.ativo,
    };

    if (raw.descricao.trim()) {
      payload.descricao = raw.descricao.trim();
    }

    if (raw.estoqueMaximo > 0) {
      payload.estoqueMaximo = raw.estoqueMaximo;
    }

    if (raw.localizacao.trim()) {
      payload.localizacao = raw.localizacao.trim();
    }

    this.saving.set(true);
    this.formMessage.set('');

    this.insumosService
      .createInsumo(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (insumo) => {
          this.insumos.update((items) => [...items, insumo].sort((a, b) => a.nome.localeCompare(b.nome)));
          this.insumoForm.reset({
            codigo: '',
            nome: '',
            descricao: '',
            categoriaId: 0,
            unidadeMedida: 'un',
            estoqueAtual: 0,
            estoqueMinimo: 0,
            estoqueMaximo: 0,
            localizacao: '',
            ativo: true,
          });
          this.formMessage.set('Insumo cadastrado com sucesso.');
          this.showCreateForm.set(false);
          this.syncTime.set(this.getCurrentTime());
          this.saving.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.formMessage.set(error.error?.message ?? 'Nao foi possivel cadastrar o insumo.');
          this.saving.set(false);
        },
      });
  }

  protected deleteInsumo(insumo: Insumo): void {
    if (this.deletingId()) {
      return;
    }

    this.deletingId.set(insumo.id);
    this.errorMessage.set('');

    this.insumosService
      .deleteInsumo(insumo.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.insumos.update((items) => items.filter((item) => item.id !== insumo.id));
          this.deletingId.set(null);
          this.syncTime.set(this.getCurrentTime());
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(error.error?.message ?? 'Nao foi possivel remover o insumo.');
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

  protected getStatus(insumo: Insumo): StatusInsumo {
    if (!insumo.ativo) {
      return 'baixo';
    }

    if (insumo.estoqueAtual <= 0) {
      return 'zerado';
    }

    if (insumo.estoqueAtual <= insumo.estoqueMinimo) {
      return 'baixo';
    }

    if (insumo.estoqueMaximo !== undefined && insumo.estoqueAtual > insumo.estoqueMaximo) {
      return 'acima';
    }

    return 'normal';
  }

  protected getStatusLabel(insumo: Insumo): string {
    const status = this.getStatus(insumo);

    if (status === 'zerado') {
      return 'Zerado';
    }

    if (status === 'baixo') {
      return 'Abaixo do minimo';
    }

    if (status === 'acima') {
      return 'Acima do maximo';
    }

    return 'Normal';
  }

  protected getStatusClass(insumo: Insumo): string {
    const status = this.getStatus(insumo);

    if (status === 'zerado' || status === 'baixo') {
      return 'bg-[#332523] text-[var(--danger)]';
    }

    if (status === 'acima') {
      return 'bg-[#0d2b35] text-[var(--info)]';
    }

    return 'bg-[#202a31] text-[var(--info)]';
  }

  private loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      insumos: this.insumosService.listInsumos(),
      categorias: this.insumosService.listCategorias(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ insumos, categorias }) => {
          this.insumos.set(insumos);
          this.categorias.set(categorias);
          this.syncTime.set(this.getCurrentTime());
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(error.error?.message ?? 'Nao foi possivel carregar os insumos.');
          this.loading.set(false);
        },
      });
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
  }
}
