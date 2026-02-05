import type { Request, Response } from "express";
import type AreaService from "../services/AreaService.js";


export default class AreaController {

    private areaService: AreaService;

    constructor(areaService:  AreaService) {
        this.areaService = areaService;
    }

    public async getAllAreas(req: Request, res: Response) {

        const areas = await this.areaService.getAllAreas();
        res.status(200).json(areas);

    }

    public async getByNomeArea(req: Request, res: Response){
        const {nome} = req.params;
        const area = await this.areaService.getByNomeArea(nome as string)
        res.status(200).json(area)

    }

    public async addArea(req: Request, res: Response) {
            const body = req.body;
            const area = await this.areaService.addArea(body);
            res.status(201).json(area);
    }


    public async updateArea(req: Request, res: Response) {
            const { nome } = req.params;
            const body = req.body;
            const area = await this.areaService.updateArea(nome as string, body);
            res.status(200).json(area);
    }

    public async deleteArea(req: Request, res: Response) {
            const { nome } = req.params;
            await this.areaService.deleteArea(nome as string);
            res.status(204).json({ message: "Área deletada" })
    }
}
