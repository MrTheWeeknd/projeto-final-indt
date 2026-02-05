
import { z } from 'zod';

export const  createSensorSchema = z.object({

    serialNumber: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Número Serial é obrigatório!")
            .length(10, "Número de caracteres deve ser exatamente 10")
            .regex(/^[A-Z0-9]+$/, "Número Serial deve conter apenas letras maísculas e  números")
    ),

    fabricante: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Fabricante é obrigatório")
            .regex(/^[a-zA-Z\s]+$/, "Fabricante só dever letras e espaços")
    ),

    modelo: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Modelo é obrigatório")
            .regex(/^[a-zA-Z0-9\s]+$/, "Modelo só dever letras e espaços")
    ),

    tipo: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Tipo é obrigatório")
            .regex(/^[a-zA-Z\s]+$/, "Tipo só dever letras e espaços")
    ),

    status: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.enum(["Ativo", "ATIVO", "ativo", "Inativo", "inativo", "INATIVO", "Manutenção", "MANUTENÇÃO", "manutenção"], "Este status é inválido. Escolha entre Ativo, Inativo ou Manutenção")
    ),

    ipFixo: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
    ),

    dataInstalacao: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.iso.date()
            .min(1, "A data de instalação é obrigatória")
    ),

    dataManutencao: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.iso.date()
    ),

    cicloLeitura: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.number()
            .min(0, "Ciclo de leitura é obrigatório")
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

    finalidade: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
    )
})
