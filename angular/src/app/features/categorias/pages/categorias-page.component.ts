import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { PermissionsService } from '../../../core/auth/permissions.service';
import { Insumo, InsumosService } from '../../insumos/data/insumos.service';
import { Categoria, CategoriasService, CategoriaPayload } from '../data/categorias.service';

@Component({
  selector: 'app-categorias-page',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.css',
})
export class CategoriasPageComponent {
  private readonly categoriasService = inject(CategoriasService);
  private readonly insumosService = inject(InsumosService);
  private readonly authService = inject(AuthService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly editingId = signal<number | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly formMessage = signal('');
  protected readonly searchTerm = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly syncTime = signal(new Date());

  protected readonly categoriaForm = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descricao: ['', [Validators.maxLength(255)]],
  });

  protected readonly filteredCategorias = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.categorias();
    }

    return this.categorias().filter(
      (categoria) =>
        categoria.nome.toLowerCase().includes(query) ||
        (categoria.descricao ?? '').toLowerCase().includes(query),
    );
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredCategorias().length / this.pageSize)),
  );

  protected readonly paginatedCategorias = computed(() => {
    const currentPage = Math.min(this.page(), this.totalPages());
    const start = (currentPage - 1) * this.pageSize;
    return this.filteredCategorias().slice(start, start + this.pageSize);
  });

  protected readonly averageInsumosPerCategoria = computed(() => {
    const total = this.categorias().length;
    if (total === 0) {
      return 0;
    }

    return this.insumos().length / total;
  });

  protected readonly categoriesWithInsumos = computed(
    () => new Set(this.insumos().map((insumo) => insumo.categoria.id)).size,
  );

  protected readonly efficiencyRate = computed(() => {
    const total = this.categorias().length;
    if (total === 0) {
      return 0;
    }

    return (this.categoriesWithInsumos() / total) * 100;
  });

  constructor() {
    this.loadData();
  }

  protected get userEmail(): string {
    return this.authService.getSession()?.usuario.email ?? 'operador@blackbox.tec';
  }

  protected get isEditing(): boolean {
    return this.editingId() !== null;
  }

  protected canManageCategories(): boolean {
    return this.permissionsService.canEditCategoria();
  }

  protected updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  protected nextPage(): void {
    this.page.update((page) => Math.min(this.totalPages(), page + 1));
  }

  protected submitCategoria(): void {
    if (this.categoriaForm.invalid || this.saving()) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const raw = this.categoriaForm.getRawValue();
    const payload: CategoriaPayload = {
      nome: raw.nome.trim(),
    };

    if (raw.descricao.trim()) {
      payload.descricao = raw.descricao.trim();
    }

    this.saving.set(true);
    this.formMessage.set('');

    const editingId = this.editingId();
    const request =
      editingId === null
        ? this.categoriasService.createCategoria(payload)
        : this.categoriasService.updateCategoria(editingId, payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (categoria) => {
        this.categorias.update((categorias) => {
          const nextCategorias =
            editingId === null
              ? [...categorias, categoria]
              : categorias.map((item) => (item.id === categoria.id ? categoria : item));

          return nextCategorias.sort((a, b) => a.nome.localeCompare(b.nome));
        });
        this.clearForm();
        this.formMessage.set(
          editingId === null ? 'Categoria cadastrada.' : 'Categoria atualizada.',
        );
        this.syncTime.set(new Date());
        this.saving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.logout();
          return;
        }

        this.formMessage.set(error.error?.message ?? 'Nao foi possivel gravar a categoria.');
        this.saving.set(false);
      },
    });
  }

  protected editCategoria(categoria: Categoria): void {
    this.editingId.set(categoria.id);
    this.formMessage.set('');
    this.categoriaForm.setValue({
      nome: categoria.nome,
      descricao: categoria.descricao ?? '',
    });
  }

  protected deleteCategoria(categoria: Categoria): void {
    if (this.deletingId()) {
      return;
    }

    this.deletingId.set(categoria.id);
    this.errorMessage.set('');

    this.categoriasService
      .deleteCategoria(categoria.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.categorias.update((categorias) =>
            categorias.filter((item) => item.id !== categoria.id),
          );
          this.syncTime.set(new Date());
          this.deletingId.set(null);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(error.error?.message ?? 'Nao foi possivel remover a categoria.');
          this.deletingId.set(null);
        },
      });
  }

  protected clearForm(): void {
    this.editingId.set(null);
    this.categoriaForm.reset({
      nome: '',
      descricao: '',
    });
  }

  protected exportCsv(): void {
    const header = ['id', 'nome', 'descricao', 'insumos'];
    const rows = this.filteredCategorias().map((categoria) => [
      String(categoria.id),
      categoria.nome,
      categoria.descricao ?? '',
      String(this.getInsumosCount(categoria.id)),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'categorias.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  protected getInsumosCount(categoriaId: number): number {
    return this.insumos().filter((insumo) => insumo.categoria.id === categoriaId).length;
  }

  protected canDelete(categoriaId: number): boolean {
    return this.getInsumosCount(categoriaId) === 0;
  }

  protected goToDashboard(): void {
    void this.router.navigateByUrl('/dashboard');
  }

  protected goToInsumos(): void {
    void this.router.navigateByUrl('/insumos');
  }

  protected goToMovimentacoes(): void {
    void this.router.navigateByUrl('/movimentacoes');
  }

  // Adicione isso no seu categorias-page.component.ts
  protected isAdmin(): boolean {
    // Acesse o authService (ajuste 'this.authService' para o nome que você usou na injeção)
    return this.authService.isAdmin();
  }

  protected hasCategoriasPermission(): boolean {
    const user = this.authService.getCurrentUser();
    // Por padrão (se undefined), retorna true para não quebrar usuários antigos
    return user?.permissoes?.categorias !== false;
  }

  protected goToAdmin(): void {
    void this.router.navigateByUrl('/admin');
  }

  protected reload(): void {
    this.loadData();
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  private loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      categorias: this.categoriasService.listCategorias(),
      insumos: this.insumosService.listInsumos(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ categorias, insumos }) => {
          this.categorias.set(categorias);
          this.insumos.set(insumos);
          this.syncTime.set(new Date());
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
            return;
          }

          this.errorMessage.set(error.error?.message ?? 'Nao foi possivel carregar as categorias.');
          this.loading.set(false);
        },
      });
  }
}
