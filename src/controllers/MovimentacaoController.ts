import type { Request, Response } from "express";
import type MovimentacaoService from "../services/MovimentacaoService.js";

export default class MovimentacaoController {
    private movimentacaoService: MovimentacaoService;

    constructor(movimentacaoService: MovimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    public async listarMovimentacoes(_req: Request, res: Response) {
        const movimentacoes = await this.movimentacaoService.listarMovimentacoes();
        res.status(200).json(movimentacoes);
    }

    public async buscarMovimentacaoPorId(req: Request, res: Response) {
        const movimentacao = await this.movimentacaoService.buscarMovimentacaoPorId(Number(req.params.id));
        res.status(200).json(movimentacao);
    }

    public async criarMovimentacao(req: Request, res: Response) {
        const movimentacao = await this.movimentacaoService.criarMovimentacao(req.body);
        res.status(201).json(movimentacao);
    }

    public async atualizarMovimentacao(req: Request, res: Response) {
        const movimentacao = await this.movimentacaoService.atualizarMovimentacao(Number(req.params.id), req.body);
        res.status(200).json(movimentacao);
    }

    public async removerMovimentacao(req: Request, res: Response) {
        await this.movimentacaoService.removerMovimentacao(Number(req.params.id));
        res.status(204).send();
    }
}
