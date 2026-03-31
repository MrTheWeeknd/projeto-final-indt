import { appDataSource } from "../database/appDataSource.js";
import { Categoria } from "../entities/Categoria.js";
import { Insumo } from "../entities/Insumo.js";
import { AppError } from "../errors/AppError.js";
import { relacoesInsumo } from "../utils/insumoRelations.js";

type InsumoPayload = {
    codigo: string;
    nome: string;
    descricao?: string;
    categoriaId: number;
    unidadeMedida: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    estoqueMaximo?: number;
    localizacao?: string;
    ativo?: boolean;
};

class InsumoService {
    private insumoRepository = appDataSource.getRepository(Insumo);
    private categoriaRepository = appDataSource.getRepository(Categoria);

    public async listarInsumos(): Promise<Insumo[]> {
        return this.insumoRepository.find({
            relations: relacoesInsumo,
            order: { nome: "ASC" },
        });
    }

    public async buscarInsumoPorId(id: number): Promise<Insumo> {
        const insumo = await this.insumoRepository.findOne({
            where: { id },
            relations: relacoesInsumo,
        });

        if (!insumo) {
            throw new AppError(404, "Insumo nao encontrado");
        }

        return insumo;
    }

    public async criarInsumo(payload: InsumoPayload): Promise<Insumo> {
        const insumoExistente = await this.insumoRepository.findOne({
            where: { codigo: payload.codigo },
        });

        if (insumoExistente) {
            throw new AppError(409, "Ja existe um insumo com esse codigo");
        }

        const categoria = await this.buscarCategoriaObrigatoria(payload.categoriaId);
        const insumo = this.insumoRepository.create();
        insumo.codigo = payload.codigo;
        insumo.nome = payload.nome;
        insumo.categoria = categoria;
        insumo.unidadeMedida = payload.unidadeMedida;
        insumo.estoqueAtual = payload.estoqueAtual;
        insumo.estoqueMinimo = payload.estoqueMinimo;
        insumo.ativo = payload.ativo ?? true;

        if (payload.descricao !== undefined) {
            insumo.descricao = payload.descricao;
        }

        if (payload.estoqueMaximo !== undefined) {
            insumo.estoqueMaximo = payload.estoqueMaximo;
        }

        if (payload.localizacao !== undefined) {
            insumo.localizacao = payload.localizacao;
        }

        await this.insumoRepository.save(insumo);
        return this.buscarInsumoPorId(insumo.id);
    }

    public async atualizarInsumo(id: number, payload: Partial<InsumoPayload>): Promise<Insumo> {
        const insumo = await this.buscarInsumoPorId(id);

        if (payload.codigo && payload.codigo !== insumo.codigo) {
            const insumoComMesmoCodigo = await this.insumoRepository.findOne({
                where: { codigo: payload.codigo },
            });

            if (insumoComMesmoCodigo) {
                throw new AppError(409, "Ja existe um insumo com esse codigo");
            }
        }

        if (payload.categoriaId) {
            insumo.categoria = await this.buscarCategoriaObrigatoria(payload.categoriaId);
        }

        if (payload.codigo !== undefined) {
            insumo.codigo = payload.codigo;
        }

        if (payload.nome !== undefined) {
            insumo.nome = payload.nome;
        }

        if (payload.descricao !== undefined) {
            insumo.descricao = payload.descricao;
        }

        if (payload.unidadeMedida !== undefined) {
            insumo.unidadeMedida = payload.unidadeMedida;
        }

        if (payload.estoqueAtual !== undefined) {
            insumo.estoqueAtual = payload.estoqueAtual;
        }

        if (payload.estoqueMinimo !== undefined) {
            insumo.estoqueMinimo = payload.estoqueMinimo;
        }

        if (payload.estoqueMaximo !== undefined) {
            insumo.estoqueMaximo = payload.estoqueMaximo;
        }

        if (payload.localizacao !== undefined) {
            insumo.localizacao = payload.localizacao;
        }

        if (payload.ativo !== undefined) {
            insumo.ativo = payload.ativo;
        }

        await this.insumoRepository.save(insumo);
        return this.buscarInsumoPorId(insumo.id);
    }

    public async removerInsumo(id: number): Promise<void> {
        const insumo = await this.insumoRepository.findOne({
            where: { id },
            relations: { movimentacoes: true },
        });

        if (!insumo) {
            throw new AppError(404, "Insumo nao encontrado");
        }

        if (insumo.movimentacoes.length > 0) {
            throw new AppError(409, "Nao e possivel remover um insumo com movimentacoes");
        }

        await this.insumoRepository.remove(insumo);
    }

    private async buscarCategoriaObrigatoria(categoriaId: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id: categoriaId },
        });

        if (!categoria) {
            throw new AppError(404, "Categoria informada nao foi encontrada");
        }

        return categoria;
    }
}

export default InsumoService;
