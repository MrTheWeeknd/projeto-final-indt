import type { Request, Response } from "express";
import type PesquisadorService from "../services/PesquisadorService.js";


export default class PesquisadorController {

    private pesquisadorService: PesquisadorService;

    constructor(pesquisadorService:  PesquisadorService) {
        this.pesquisadorService = pesquisadorService;
    }

    public async getAllPesquisadores(req: Request, res: Response) {

        const pesquisadores = await this.pesquisadorService.getAllPesquisadores();
        res.status(200).json(pesquisadores);

    }

    public async getByEmailPesquisador(req: Request, res: Response){
        const {email} = req.params;
        const pesquisador = await this.pesquisadorService.getByEmailPesquisador(email as string)
        res.status(200).json(pesquisador)

    }

    public async addPesquisador(req: Request, res: Response) {
            const body = req.body;
            const pesquisador = await this.pesquisadorService.addPesquisador(body);
            res.status(201).json(pesquisador);
    }


    public async updatePesquisador(req: Request, res: Response) {
            const { email } = req.params;
            const body = req.body;
            const pesquisador = await this.pesquisadorService.updatePesquisador(email as string, body);
            res.status(200).json(pesquisador);
    }

    public async deletePesquisador(req: Request, res: Response) {
            const { email } = req.params;
            await this.pesquisadorService.deletePesquisador(email as string);
            res.status(204).json({ status: "Pesquisador deletado" })
    }
}
