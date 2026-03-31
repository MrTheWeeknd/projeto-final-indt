import { Router } from "express";
import InsumoController from "../controllers/InsumoController.js";
import { validarBody } from "../middleware/requestValidation.js";
import InsumoService from "../services/InsumoService.js";
import { createInsumoSchema, updateInsumoSchema } from "../validats/createInsumoSchema.js";

const insumoRouter = Router();
const insumoService = new InsumoService();
const insumoController = new InsumoController(insumoService);

insumoRouter.get("/", (req, res) => insumoController.listarInsumos(req, res));
insumoRouter.get("/:id", (req, res) => insumoController.buscarInsumoPorId(req, res));

insumoRouter.post("/", validarBody(createInsumoSchema), (req, res) => insumoController.criarInsumo(req, res));

insumoRouter.put("/:id", validarBody(updateInsumoSchema), (req, res) =>
    insumoController.atualizarInsumo(req, res),
);

insumoRouter.delete("/:id", (req, res) => insumoController.removerInsumo(req, res));

export default insumoRouter;