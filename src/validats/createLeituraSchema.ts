import { z } from 'zod';

export const  createLeituraSchema = z.object({

    umidade: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.coerce.number({message: "A umidade é obrigatória"})
            .min(0, "O valor mínino  da umidade é 0")
            .max(100, "O valor máximo da umidade é 100")    
    ), 

    temperatura: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.coerce.number({message: "A temperatura é obrigatória"})
            .min(-50, "O valor mínino  da temperatura é -50")
            .max(100, "O valor máximo da temperatura é 100")              
    ),

    dataHora: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.iso.date()
    )
    
})
