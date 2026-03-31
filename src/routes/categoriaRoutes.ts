import { Router } from "express";
import CategoriaController from "../controllers/CategoriaController.js";
import { validarBody } from "../middleware/requestValidation.js";
import CategoriaService from "../services/CategoriaService.js";
import { createCategoriaSchema } from "../validats/createCategoriaSchema.js";

const categoriaRouter = Router();
const categoriaService = new CategoriaService();
const categoriaController = new CategoriaController(categoriaService);

categoriaRouter.get("/categorias", (req, res) => categoriaController.listarCategorias(req, res));
categoriaRouter.get("/categorias/:id", (req, res) => categoriaController.buscarCategoriaPorId(req, res));
categoriaRouter.post("/categorias", validarBody(createCategoriaSchema), (req, res) =>
    categoriaController.criarCategoria(req, res),
);
categoriaRouter.put("/categorias/:id", validarBody(createCategoriaSchema.partial()), (req, res) =>
    categoriaController.atualizarCategoria(req, res),
);
categoriaRouter.delete("/categorias/:id", (req, res) => categoriaController.removerCategoria(req, res));

export default categoriaRouter;
