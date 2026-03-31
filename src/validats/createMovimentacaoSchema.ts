import { z } from "zod";
import { motivosMovimentacao, tiposMovimentacao } from "../types/Estoque.js";

export const createMovimentacaoSchema = z.object({
    insumoId: z.coerce.number().int().positive("Insumo invalido"),
    usuarioId: z.coerce.number().int().positive("Usuario invalido"),
    tipo: z.enum(tiposMovimentacao),
    motivo: z.enum(motivosMovimentacao),
    quantidade: z.coerce.number().positive("Quantidade deve ser maior que zero"),
    linhaDestino: z.string().trim().max(120, "Linha de destino muito longa").optional(),
    observacao: z.string().trim().max(255, "Observacao muito longa").optional(),
});
