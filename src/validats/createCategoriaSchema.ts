import { z } from "zod";

export const createCategoriaSchema = z.object({
    nome: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
    descricao: z.string().trim().max(255, "Descricao muito longa").optional(),
});
