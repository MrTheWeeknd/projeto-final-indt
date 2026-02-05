import { z } from 'zod';

export const  createAreaSchema = z.object({

    nome: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Nome é obrigatório")
            .min(3, "Minimo de 3 caracteres")
            .max(100, "Máximo de 100 caracteres")
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome só dever letras e espaços")
    ),

    descricao: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
    ),

    bioma: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.enum(["Floresta", "Deserto", "Savana", "Tundra", "Aquático"], "Este bioma é inválido. Escolha entre Floresta, Deserto, Savana, Tundra ou Aquático")
    ), 
    
    latitude: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.coerce.number({message: "A latitude é obrigatória"})
            .min(-90, "O valor mínino  da latitude é -90")
            .max(90, "O valor máximo da latitude é 90")    
    ), 

    longitude: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.coerce.number({message: "A longitude é obrigatória"})
            .min(-180, "O valor mínino  da longitude é -180")
            .max(180, "O valor máximo da longitude é 180")              
    ),

    largura: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.float32()
            .min(1, "Largura é obrigatória!")
    ),

    comprimento: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.float32()
            .min(1, "Comprimento é obrigatório!")
    ),

    relevo: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
    ) 
 
})
