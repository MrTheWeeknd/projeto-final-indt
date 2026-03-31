import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { validarBody } from "../middleware/requestValidation.js";
import UsuarioService from "../services/UsuarioService.js";
import { createUsuarioSchema, updateUsuarioSchema } from "../validats/createUsuarioSchema.js";

const usuarioRouter = Router();
const usuarioService = new UsuarioService();
const usuarioController = new UsuarioController(usuarioService);

usuarioRouter.get("/", (req, res) => usuarioController.listarUsuarios(req, res));
usuarioRouter.get("/:id", (req, res) => usuarioController.buscarUsuarioPorId(req, res));

usuarioRouter.post("/", validarBody(createUsuarioSchema), (req, res) => 
    usuarioController.criarUsuario(req, res)
);

usuarioRouter.put("/:id", validarBody(updateUsuarioSchema), (req, res) =>
    usuarioController.atualizarUsuario(req, res),
);

usuarioRouter.delete("/:id", (req, res) => usuarioController.removerUsuario(req, res));

export default usuarioRouter;