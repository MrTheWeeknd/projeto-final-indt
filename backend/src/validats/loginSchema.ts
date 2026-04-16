import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().email("Email invalido"),
    senha: z.string().min(1, "Senha e obrigatoria"),
});

export type LoginPayload = z.infer<typeof loginSchema>;
