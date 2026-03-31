import { z } from "zod";

export const createUsuarioSchema = z.object({
    email: z.string().trim().email("Email invalido").max(120, "Email muito longo"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(120, "Senha muito longa"),
});
