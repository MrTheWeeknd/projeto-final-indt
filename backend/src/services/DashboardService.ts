import { Between } from "typeorm";
import { appDataSource } from "../database/appDataSource.js";
import { Insumo } from "../entities/Insumo.js";
import { Movimentacao } from "../entities/Movimentacao.js";

type DashboardIndicadores = {
    totalInsumosAtivos: number;
    itensAbaixoMinimo: number;
    itensSemEstoque: number;
    movimentacoesHoje: number;
};

type DashboardListaCriticaItem = {
    id: number;
    codigo: string;
    nome: string;
    categoria: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    percentualCobertura: number;
    status: "baixo" | "zerado";
};

type DashboardAlerta = {
    insumoId: number;
    codigo: string;
    tipo: "estoque_baixo" | "estoque_zerado";
    mensagem: string;
};

export type DashboardResponse = {
    indicadores: DashboardIndicadores;
    listaCritica: DashboardListaCriticaItem[];
    alertas: DashboardAlerta[];
};

class DashboardService {
    private insumoRepository = appDataSource.getRepository(Insumo);
    private movimentacaoRepository = appDataSource.getRepository(Movimentacao);

    public async obterResumo(): Promise<DashboardResponse> {
        const insumosAtivos = await this.insumoRepository.find({
            where: { ativo: true },
            relations: { categoria: true },
            order: { nome: "ASC" },
        });

        const inicioDoDia = new Date();
        inicioDoDia.setHours(0, 0, 0, 0);

        const fimDoDia = new Date();
        fimDoDia.setHours(23, 59, 59, 999);

        const movimentacoesHoje = await this.movimentacaoRepository.count({
            where: {
                dataHora: Between(inicioDoDia, fimDoDia),
            },
        });

        const listaCritica = insumosAtivos
            .filter((insumo) => insumo.estoqueAtual <= insumo.estoqueMinimo)
            .map((insumo) => {
                const percentualCobertura = insumo.estoqueMinimo > 0
                    ? Number(((insumo.estoqueAtual / insumo.estoqueMinimo) * 100).toFixed(2))
                    : 0;

                return {
                    id: insumo.id,
                    codigo: insumo.codigo,
                    nome: insumo.nome,
                    categoria: insumo.categoria.nome,
                    estoqueAtual: insumo.estoqueAtual,
                    estoqueMinimo: insumo.estoqueMinimo,
                    percentualCobertura,
                    status: insumo.estoqueAtual <= 0 ? "zerado" : "baixo",
                } satisfies DashboardListaCriticaItem;
            })
            .sort((itemA, itemB) => {
                if (itemA.status !== itemB.status) {
                    return itemA.status === "zerado" ? -1 : 1;
                }

                if (itemA.percentualCobertura !== itemB.percentualCobertura) {
                    return itemA.percentualCobertura - itemB.percentualCobertura;
                }

                return itemA.nome.localeCompare(itemB.nome);
            });

        const alertas: DashboardAlerta[] = listaCritica.slice(0, 5).map((item) => ({
            insumoId: item.id,
            codigo: item.codigo,
            tipo: item.status === "zerado" ? "estoque_zerado" : "estoque_baixo",
            mensagem: item.status === "zerado"
                ? `Insumo ${item.codigo} sem saldo disponivel`
                : `Insumo ${item.codigo} abaixo do estoque minimo`,
        }));

        const indicadores: DashboardIndicadores = {
            totalInsumosAtivos: insumosAtivos.length,
            itensAbaixoMinimo: insumosAtivos.filter(
                (insumo) => insumo.estoqueAtual > 0 && insumo.estoqueAtual <= insumo.estoqueMinimo,
            ).length,
            itensSemEstoque: insumosAtivos.filter((insumo) => insumo.estoqueAtual <= 0).length,
            movimentacoesHoje,
        };

        return {
            indicadores,
            listaCritica,
            alertas,
        };
    }
}

export default DashboardService;
