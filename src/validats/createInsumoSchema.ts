import { z } from "zod";

export const createInsumoSchema = z.object({
    codigo: z.string().trim().min(1, "Codigo e obrigatorio").max(50, "Codigo muito longo"),
    nome: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(120, "Nome muito longo"),
    descricao: z.string().trim().max(255, "Descricao muito longa").optional(),
    categoriaId: z.coerce.number().int().positive("Categoria invalida"),
    unidadeMedida: z.string().trim().min(1, "Unidade de medida e obrigatoria").max(30, "Unidade invalida"),
    estoqueAtual: z.coerce.number().min(0, "Estoque atual nao pode ser negativo"),
    estoqueMinimo: z.coerce.number().min(0, "Estoque minimo nao pode ser negativo"),
    estoqueMaximo: z.coerce.number().min(0, "Estoque maximo nao pode ser negativo").optional(),
    localizacao: z.string().trim().max(120, "Localizacao muito longa").optional(),
    ativo: z.boolean().optional(),
}).refine((dados) => dados.estoqueMaximo === undefined || dados.estoqueMaximo >= dados.estoqueMinimo, {
    message: "Estoque maximo deve ser maior ou igual ao estoque minimo",
    path: ["estoqueMaximo"],
});
