import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type DashboardResponse = {
  indicadores: {
    totalInsumosAtivos: number;
    itensAbaixoMinimo: number;
    itensSemEstoque: number;
    movimentacoesHoje: number;
  };
  listaCritica: Array<{
    id: number;
    codigo: string;
    nome: string;
    categoria: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    percentualCobertura: number;
    status: 'baixo' | 'zerado';
  }>;
  alertas: Array<{
    insumoId: number;
    codigo: string;
    tipo: 'estoque_baixo' | 'estoque_zerado';
    mensagem: string;
  }>;
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:6060/api';

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiBaseUrl}/dashboard`);
  }
}
