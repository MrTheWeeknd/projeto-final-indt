import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { validarBody } from "../middleware/requestValidation.js";
import UsuarioService from "../services/UsuarioService.js";
import { createUsuarioSchema } from "../validats/createUsuarioSchema.js";

const usuarioRouter = Router();
const usuarioService = new UsuarioService();
const usuarioController = new UsuarioController(usuarioService);

usuarioRouter.get("/usuarios", (req, res) => usuarioController.listarUsuarios(req, res));
usuarioRouter.get("/usuarios/:id", (req, res) => usuarioController.buscarUsuarioPorId(req, res));
usuarioRouter.post("/usuarios", validarBody(createUsuarioSchema), (req, res) => usuarioController.criarUsuario(req, res));
usuarioRouter.put("/usuarios/:id", validarBody(createUsuarioSchema.partial()), (req, res) =>
    usuarioController.atualizarUsuario(req, res),
);
usuarioRouter.delete("/usuarios/:id", (req, res) => usuarioController.removerUsuario(req, res));

export default usuarioRouter;
