import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
};

export type Insumo = {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: Categoria;
  unidadeMedida: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo?: number;
  localizacao?: string;
  ativo: boolean;
};

export type CreateInsumoPayload = {
  codigo: string;
  nome: string;
  descricao?: string;
  categoriaId: number;
  unidadeMedida: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo?: number;
  localizacao?: string;
  ativo: boolean;
};

@Injectable({ providedIn: 'root' })
export class InsumosService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:6060/api';

  listInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiBaseUrl}/insumos`);
  }

  createInsumo(payload: CreateInsumoPayload): Observable<Insumo> {
    return this.http.post<Insumo>(`${this.apiBaseUrl}/insumos`, payload);
  }

  deleteInsumo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/insumos/${id}`);
  }

  listCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiBaseUrl}/categorias`);
  }
}
