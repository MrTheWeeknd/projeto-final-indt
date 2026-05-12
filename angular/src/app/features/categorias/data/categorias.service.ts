import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
};

export type CategoriaPayload = {
  nome: string;
  descricao?: string;
};

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://projeto-final-indt-production.up.railway.app/api';

  listCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiBaseUrl}/categorias`);
  }

  createCategoria(payload: CategoriaPayload): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiBaseUrl}/categorias`, payload);
  }

  updateCategoria(id: number, payload: Partial<CategoriaPayload>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiBaseUrl}/categorias/${id}`, payload);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/categorias/${id}`);
  }
}
