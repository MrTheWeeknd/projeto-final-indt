import { Router } from "express";
import MovimentacaoController from "../controllers/MovimentacaoController.js";
import { validarBody } from "../middleware/requestValidation.js";
import MovimentacaoService from "../services/MovimentacaoService.js";
import { createMovimentacaoSchema, updateMovimentacaoSchema } from "../validats/createMovimentacaoSchema.js";
import { verificarAdmin } from "../middleware/permissionMiddleware.js";

const movimentacaoRouter = Router();
const movimentacaoService = new MovimentacaoService();
const movimentacaoController = new MovimentacaoController(movimentacaoService);

// GET - Admin vê todas, funcionário vê apenas suas
movimentacaoRouter.get("/", (req, res) => movimentacaoController.listarMovimentacoes(req, res));
movimentacaoRouter.get("/:id", (req, res) => movimentacaoController.buscarMovimentacaoPorId(req, res));

// POST - Todos podem criar (autenticados)
movimentacaoRouter.post("/", validarBody(createMovimentacaoSchema), (req, res) =>
    movimentacaoController.criarMovimentacao(req, res),
);

// PUT - Apenas admin
movimentacaoRouter.put("/:id", verificarAdmin, validarBody(updateMovimentacaoSchema), (req, res) =>
    movimentacaoController.atualizarMovimentacao(req, res),
);

// DELETE - Apenas admin
movimentacaoRouter.delete("/:id", verificarAdmin, (req, res) =>
    movimentacaoController.removerMovimentacao(req, res),
);

export default movimentacaoRouter;