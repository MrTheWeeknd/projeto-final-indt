import { Router } from "express";
import MovimentacaoController from "../controllers/MovimentacaoController.js";
import { validarBody } from "../middleware/requestValidation.js";
import MovimentacaoService from "../services/MovimentacaoService.js";
import { createMovimentacaoSchema, updateMovimentacaoSchema } from "../validats/createMovimentacaoSchema.js";

const movimentacaoRouter = Router();
const movimentacaoService = new MovimentacaoService();
const movimentacaoController = new MovimentacaoController(movimentacaoService);

movimentacaoRouter.get("/", (req, res) => movimentacaoController.listarMovimentacoes(req, res));
movimentacaoRouter.get("/:id", (req, res) => movimentacaoController.buscarMovimentacaoPorId(req, res));

movimentacaoRouter.post("/", validarBody(createMovimentacaoSchema), (req, res) =>
    movimentacaoController.criarMovimentacao(req, res),
);

movimentacaoRouter.put("/:id", validarBody(updateMovimentacaoSchema), (req, res) =>
    movimentacaoController.atualizarMovimentacao(req, res),
);

movimentacaoRouter.delete("/:id", (req, res) =>
    movimentacaoController.removerMovimentacao(req, res),
);

export default movimentacaoRouter;