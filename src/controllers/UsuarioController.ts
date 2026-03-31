import type { Request, Response } from "express";
import type UsuarioService from "../services/UsuarioService.js";

export default class UsuarioController {
    private usuarioService: UsuarioService;

    constructor(usuarioService: UsuarioService) {
        this.usuarioService = usuarioService;
    }

    public async listarUsuarios(_req: Request, res: Response) {
        const usuarios = await this.usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    }

    public async buscarUsuarioPorId(req: Request, res: Response) {
        const usuario = await this.usuarioService.buscarUsuarioPorId(Number(req.params.id));
        res.status(200).json(usuario);
    }

    public async criarUsuario(req: Request, res: Response) {
        const usuario = await this.usuarioService.criarUsuario(req.body);
        res.status(201).json(usuario);
    }

    public async atualizarUsuario(req: Request, res: Response) {
        const usuario = await this.usuarioService.atualizarUsuario(Number(req.params.id), req.body);
        res.status(200).json(usuario);
    }

    public async removerUsuario(req: Request, res: Response) {
        await this.usuarioService.removerUsuario(Number(req.params.id));
        res.status(204).send();
    }
}
