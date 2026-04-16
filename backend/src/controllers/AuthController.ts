import type { Request, Response } from "express";
import type AuthService from "../services/AuthService.js";

export default class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async login(req: Request, res: Response) {
        const resultado = await this.authService.login(req.body);
        res.status(200).json(resultado);
    }
}
