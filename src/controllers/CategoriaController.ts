import type { Request, Response } from "express";
import type CategoriaService from "../services/CategoriaService.js";

export default class CategoriaController {
    private categoriaService: CategoriaService;

    constructor(categoriaService: CategoriaService) {
        this.categoriaService = categoriaService;
    }

    public async listarCategorias(_req: Request, res: Response) {
        const categorias = await this.categoriaService.listarCategorias();
        res.status(200).json(categorias);
    }

    public async buscarCategoriaPorId(req: Request, res: Response) {
        const categoria = await this.categoriaService.buscarCategoriaPorId(Number(req.params.id));
        res.status(200).json(categoria);
    }

    public async criarCategoria(req: Request, res: Response) {
        const categoria = await this.categoriaService.criarCategoria(req.body);
        res.status(201).json(categoria);
    }

    public async atualizarCategoria(req: Request, res: Response) {
        const categoria = await this.categoriaService.atualizarCategoria(Number(req.params.id), req.body);
        res.status(200).json(categoria);
    }

    public async removerCategoria(req: Request, res: Response) {
        await this.categoriaService.removerCategoria(Number(req.params.id));
        res.status(204).send();
    }
}
