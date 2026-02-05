import type { Request, Response } from "express";
import type LeituraService from "../services/LeituraService.js";


export default class LeituraController {

    private leituraService: LeituraService;

    constructor(leituraService:  LeituraService) {
        this.leituraService = leituraService;
    }

    public async getAllLeituras(req: Request, res: Response) {

        const leituras = await this.leituraService.getAllLeituras();
        res.status(200).json(leituras);

    }

    public async getByIdLeitura(req: Request, res: Response){
        const {id} = req.params;
        const leitura = await this.leituraService.getByIdLeitura(id as string)
        res.status(200).json(leitura)

    }

    public async addLeitura(req: Request, res: Response) {
            const body = req.body;
            const leitura = await this.leituraService.addLeitura(body);
            res.status(201).json(leitura);
    }


    public async updateLeitura(req: Request, res: Response) {
            const { id } = req.params;
            const body = req.body;
            const leitura = await this.leituraService.updateLeitura(id as string, body);
            res.status(200).json(leitura);
    }

    public async deleteLeitura(req: Request, res: Response) {
            const { id } = req.params;
            await this.leituraService.deleteLeitura(id as string);
            res.status(204).json({ message: "Leitura deletado" })
    }
}
