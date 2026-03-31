import { Router } from "express";
import CategoriaController from "../controllers/CategoriaController.js";
import { validarBody } from "../middleware/requestValidation.js";
import CategoriaService from "../services/CategoriaService.js";
import { createCategoriaSchema, updateCategoriaSchema } from "../validats/createCategoriaSchema.js";

const categoriaRouter = Router();
const categoriaService = new CategoriaService();
const categoriaController = new CategoriaController(categoriaService);

categoriaRouter.get("/", (req, res) => categoriaController.listarCategorias(req, res));
categoriaRouter.get("/:id", (req, res) => categoriaController.buscarCategoriaPorId(req, res));

categoriaRouter.post("/", validarBody(createCategoriaSchema), (req, res) =>
    categoriaController.criarCategoria(req, res),
);

categoriaRouter.put("/:id", validarBody(updateCategoriaSchema), (req, res) =>
    categoriaController.atualizarCategoria(req, res),
);

categoriaRouter.delete("/:id", (req, res) => categoriaController.removerCategoria(req, res));

export default categoriaRouter;