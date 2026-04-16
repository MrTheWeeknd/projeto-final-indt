import type { Request, Response } from "express";
import type InsumoService from "../services/InsumoService.js";

export default class InsumoController {
    private insumoService: InsumoService;

    constructor(insumoService: InsumoService) {
        this.insumoService = insumoService;
    }

    public async listarInsumos(_req: Request, res: Response) {
        const insumos = await this.insumoService.listarInsumos();
        res.status(200).json(insumos);
    }

    public async buscarInsumoPorId(req: Request, res: Response) {
        const insumo = await this.insumoService.buscarInsumoPorId(Number(req.params.id));
        res.status(200).json(insumo);
    }

    public async criarInsumo(req: Request, res: Response) {
        const insumo = await this.insumoService.criarInsumo(req.body);
        res.status(201).json(insumo);
    }

    public async atualizarInsumo(req: Request, res: Response) {
        const insumo = await this.insumoService.atualizarInsumo(Number(req.params.id), req.body);
        res.status(200).json(insumo);
    }

    public async removerInsumo(req: Request, res: Response) {
        await this.insumoService.removerInsumo(Number(req.params.id));
        res.status(204).send();
    }
}
