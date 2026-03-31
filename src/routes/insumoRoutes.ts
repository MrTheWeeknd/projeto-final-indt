import { Router } from "express";
import InsumoController from "../controllers/InsumoController.js";
import { validarBody } from "../middleware/requestValidation.js";
import InsumoService from "../services/InsumoService.js";
import { createInsumoSchema } from "../validats/createInsumoSchema.js";

const insumoRouter = Router();
const insumoService = new InsumoService();
const insumoController = new InsumoController(insumoService);

insumoRouter.get("/insumos", (req, res) => insumoController.listarInsumos(req, res));
insumoRouter.get("/insumos/:id", (req, res) => insumoController.buscarInsumoPorId(req, res));
insumoRouter.post("/insumos", validarBody(createInsumoSchema), (req, res) => insumoController.criarInsumo(req, res));
insumoRouter.put("/insumos/:id", validarBody(createInsumoSchema.partial()), (req, res) =>
    insumoController.atualizarInsumo(req, res),
);
insumoRouter.delete("/insumos/:id", (req, res) => insumoController.removerInsumo(req, res));

export default insumoRouter;
