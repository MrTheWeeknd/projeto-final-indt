import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Insumo } from '../../insumos/data/insumos.service';

export type TipoMovimentacao = 'entrada' | 'saida';
export type MotivoMovimentacao = 'compra' | 'devolucao' | 'consumo' | 'perda' | 'ajuste';

export type UsuarioResumo = {
  id: number;
  email: string;
};

export type Movimentacao = {
  id: number;
  insumo: Insumo;
  tipo: TipoMovimentacao;
  motivo: MotivoMovimentacao;
  quantidade: number;
  saldoApos: number;
  linhaDestino?: string;
  observacao?: string;
  usuario: UsuarioResumo;
  dataHora: string;
};

export type CreateMovimentacaoPayload = {
  insumoId: number;
  usuarioId: number;
  tipo: TipoMovimentacao;
  motivo: MotivoMovimentacao;
  quantidade: number;
  linhaDestino?: string;
  observacao?: string;
};

@Injectable({ providedIn: 'root' })
export class MovimentacoesService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://projeto-final-indt-production.up.railway.app/api';

  listMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.apiBaseUrl}/movimentacoes`);
  }

  createMovimentacao(payload: CreateMovimentacaoPayload): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(`${this.apiBaseUrl}/movimentacoes`, payload);
  }

  deleteMovimentacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/movimentacoes/${id}`);
  }
}
