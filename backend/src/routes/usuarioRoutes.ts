import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { autenticarToken } from "../middleware/authMiddleware.js";
import { validarBody } from "../middleware/requestValidation.js";
import { verificarAdmin } from "../middleware/permissionMiddleware.js";
import UsuarioService from "../services/UsuarioService.js";
import { createUsuarioSchema, updateUsuarioSchema } from "../validats/createUsuarioSchema.js";

const usuarioRouter = Router();
const usuarioService = new UsuarioService();
const usuarioController = new UsuarioController(usuarioService);

usuarioRouter.post("/", validarBody(createUsuarioSchema), (req, res) => 
    usuarioController.criarUsuario(req, res)
);

usuarioRouter.use(autenticarToken);

usuarioRouter.get("/", (req, res) => usuarioController.listarUsuarios(req, res));
usuarioRouter.get("/:id", (req, res) => usuarioController.buscarUsuarioPorId(req, res));

usuarioRouter.put("/:id", validarBody(updateUsuarioSchema), (req, res) =>
    usuarioController.atualizarUsuario(req, res),
);

usuarioRouter.delete("/:id", (req, res) => usuarioController.removerUsuario(req, res));

usuarioRouter.patch("/:id/promover-admin", verificarAdmin, (req, res) =>
    usuarioController.promoverParaAdmin(req, res),
);

usuarioRouter.patch("/:id/rebaixar-usuario", verificarAdmin, (req, res) =>
    usuarioController.rebaixarParaUsuario(req, res),
);

usuarioRouter.patch("/:id/permissoes", verificarAdmin, (req, res) =>
    usuarioController.atualizarPermissoes(req, res),
);



export default usuarioRouter;
