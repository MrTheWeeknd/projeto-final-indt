import { Router } from "express";
import MovimentacaoController from "../controllers/MovimentacaoController.js";
import { validarBody } from "../middleware/requestValidation.js";
import MovimentacaoService from "../services/MovimentacaoService.js";
import { createMovimentacaoSchema } from "../validats/createMovimentacaoSchema.js";

const movimentacaoRouter = Router();
const movimentacaoService = new MovimentacaoService();
const movimentacaoController = new MovimentacaoController(movimentacaoService);

movimentacaoRouter.get("/movimentacoes", (req, res) => movimentacaoController.listarMovimentacoes(req, res));
movimentacaoRouter.get("/movimentacoes/:id", (req, res) => movimentacaoController.buscarMovimentacaoPorId(req, res));
movimentacaoRouter.post("/movimentacoes", validarBody(createMovimentacaoSchema), (req, res) =>
    movimentacaoController.criarMovimentacao(req, res),
);
movimentacaoRouter.put("/movimentacoes/:id", validarBody(createMovimentacaoSchema.partial()), (req, res) =>
    movimentacaoController.atualizarMovimentacao(req, res),
);
movimentacaoRouter.delete("/movimentacoes/:id", (req, res) =>
    movimentacaoController.removerMovimentacao(req, res),
);

export default movimentacaoRouter;
