import { appDataSource } from "../database/appDataSource.js";
import { Insumo } from "../entities/Insumo.js";
import { Movimentacao } from "../entities/Movimentacao.js";
import { Usuario } from "../entities/Usuario.js";
import { AppError } from "../errors/AppError.js";
import type { MotivoMovimentacao, TipoMovimentacao } from "../types/Estoque.js";
import { relacoesMovimentacao } from "../utils/movimentacaoRelations.js";
import { removerSenhaDoUsuario } from "../utils/usuarioResponse.js";

type MovimentacaoPayload = {
    insumoId: number;
    usuarioId: number;
    tipo: TipoMovimentacao;
    motivo: MotivoMovimentacao;
    quantidade: number;
    linhaDestino?: string;
    observacao?: string;
};

class MovimentacaoService {
    private movimentacaoRepository = appDataSource.getRepository(Movimentacao);

    public async listarMovimentacoes(): Promise<Movimentacao[]> {
        const movimentacoes = await this.movimentacaoRepository.find({
            relations: relacoesMovimentacao,
            order: { id: "DESC" },
        });

        return movimentacoes.map((movimentacao) => this.ocultarSenhaDoUsuario(movimentacao));
    }

    public async buscarMovimentacaoPorId(id: number): Promise<Movimentacao> {
        const movimentacao = await this.movimentacaoRepository.findOne({
            where: { id },
            relations: relacoesMovimentacao,
        });

        if (!movimentacao) {
            throw new AppError(404, "Movimentacao nao encontrada");
        }

        return this.ocultarSenhaDoUsuario(movimentacao);
    }

    public async criarMovimentacao(payload: MovimentacaoPayload): Promise<Movimentacao> {
        const movimentacao = await appDataSource.transaction(async (manager) => {
            const insumoRepository = manager.getRepository(Insumo);
            const usuarioRepository = manager.getRepository(Usuario);
            const movimentacaoRepository = manager.getRepository(Movimentacao);

            const insumo = await this.buscarInsumoObrigatorio(insumoRepository, payload.insumoId);
            const usuario = await this.buscarUsuarioObrigatorio(usuarioRepository, payload.usuarioId);

            const saldoApos = this.aplicarMovimentacaoNoSaldo(insumo.estoqueAtual, payload.tipo, payload.quantidade);
            insumo.estoqueAtual = saldoApos;

            const novaMovimentacao = movimentacaoRepository.create();
            novaMovimentacao.tipo = payload.tipo;
            novaMovimentacao.motivo = payload.motivo;
            novaMovimentacao.quantidade = payload.quantidade;
            novaMovimentacao.saldoApos = saldoApos;
            novaMovimentacao.insumo = insumo;
            novaMovimentacao.usuario = usuario;

            if (payload.linhaDestino !== undefined) {
                novaMovimentacao.linhaDestino = payload.linhaDestino;
            }

            if (payload.observacao !== undefined) {
                novaMovimentacao.observacao = payload.observacao;
            }

            await insumoRepository.save(insumo);
            return movimentacaoRepository.save(novaMovimentacao);
        });

        return this.buscarMovimentacaoPorId(movimentacao.id);
    }

    public async atualizarMovimentacao(id: number, payload: Partial<MovimentacaoPayload>): Promise<Movimentacao> {
        await appDataSource.transaction(async (manager) => {
            const insumoRepository = manager.getRepository(Insumo);
            const usuarioRepository = manager.getRepository(Usuario);
            const movimentacaoRepository = manager.getRepository(Movimentacao);

            const movimentacao = await movimentacaoRepository.findOne({
                where: { id },
                relations: { insumo: true, usuario: true },
            });

            if (!movimentacao) {
                throw new AppError(404, "Movimentacao nao encontrada");
            }

            const insumoOriginal = await this.buscarInsumoObrigatorio(insumoRepository, movimentacao.insumo.id);
            insumoOriginal.estoqueAtual = this.reverterMovimentacaoDoSaldo(
                insumoOriginal.estoqueAtual,
                movimentacao.tipo,
                movimentacao.quantidade,
            );

            const insumoAtualizado = payload.insumoId
                ? await this.buscarInsumoObrigatorio(insumoRepository, payload.insumoId)
                : insumoOriginal;

            const usuarioAtualizado = payload.usuarioId
                ? await this.buscarUsuarioObrigatorio(usuarioRepository, payload.usuarioId)
                : movimentacao.usuario;

            const novoTipo = payload.tipo ?? movimentacao.tipo;
            const novaQuantidade = payload.quantidade ?? movimentacao.quantidade;
            const novoSaldo = this.aplicarMovimentacaoNoSaldo(
                insumoAtualizado.estoqueAtual,
                novoTipo,
                novaQuantidade,
            );

            insumoAtualizado.estoqueAtual = novoSaldo;
            movimentacao.insumo = insumoAtualizado;
            movimentacao.usuario = usuarioAtualizado;
            movimentacao.tipo = novoTipo;
            movimentacao.motivo = payload.motivo ?? movimentacao.motivo;
            movimentacao.quantidade = novaQuantidade;
            movimentacao.saldoApos = novoSaldo;
            if (payload.linhaDestino !== undefined) {
                movimentacao.linhaDestino = payload.linhaDestino;
            }

            if (payload.observacao !== undefined) {
                movimentacao.observacao = payload.observacao;
            }

            await insumoRepository.save(insumoOriginal);
            await insumoRepository.save(insumoAtualizado);
            await movimentacaoRepository.save(movimentacao);
        });

        return this.buscarMovimentacaoPorId(id);
    }

    public async removerMovimentacao(id: number): Promise<void> {
        await appDataSource.transaction(async (manager) => {
            const movimentacaoRepository = manager.getRepository(Movimentacao);
            const insumoRepository = manager.getRepository(Insumo);

            const movimentacao = await movimentacaoRepository.findOne({
                where: { id },
                relations: { insumo: true },
            });

            if (!movimentacao) {
                throw new AppError(404, "Movimentacao nao encontrada");
            }

            movimentacao.insumo.estoqueAtual = this.reverterMovimentacaoDoSaldo(
                movimentacao.insumo.estoqueAtual,
                movimentacao.tipo,
                movimentacao.quantidade,
            );

            await insumoRepository.save(movimentacao.insumo);
            await movimentacaoRepository.remove(movimentacao);
        });
    }

    private aplicarMovimentacaoNoSaldo(saldoAtual: number, tipo: TipoMovimentacao, quantidade: number): number {
        const novoSaldo = tipo === "entrada" ? saldoAtual + quantidade : saldoAtual - quantidade;

        if (novoSaldo < 0) {
            throw new AppError(400, "A movimentacao deixa o estoque negativo");
        }

        return novoSaldo;
    }

    private reverterMovimentacaoDoSaldo(saldoAtual: number, tipo: TipoMovimentacao, quantidade: number): number {
        return tipo === "entrada" ? saldoAtual - quantidade : saldoAtual + quantidade;
    }

    private async buscarInsumoObrigatorio(
        repository: ReturnType<typeof appDataSource.getRepository<Insumo>>,
        id: number,
    ): Promise<Insumo> {
        const insumo = await repository.findOne({
            where: { id },
        });

        if (!insumo) {
            throw new AppError(404, "Insumo informado nao foi encontrado");
        }

        return insumo;
    }

    private async buscarUsuarioObrigatorio(
        repository: ReturnType<typeof appDataSource.getRepository<Usuario>>,
        id: number,
    ): Promise<Usuario> {
        const usuario = await repository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Usuario informado nao foi encontrado");
        }

        return usuario;
    }

    private ocultarSenhaDoUsuario(movimentacao: Movimentacao): Movimentacao {
        movimentacao.usuario = removerSenhaDoUsuario(movimentacao.usuario) as Usuario;
        return movimentacao;
    }
}

export default MovimentacaoService;
