import type { Request, Response } from "express";
import type DashboardService from "../services/DashboardService.js";

export default class DashboardController {
    private dashboardService: DashboardService;

    constructor(dashboardService: DashboardService) {
        this.dashboardService = dashboardService;
    }

    public async obterResumo(_req: Request, res: Response) {
        const dashboard = await this.dashboardService.obterResumo();
        res.status(200).json(dashboard);
    }
}
