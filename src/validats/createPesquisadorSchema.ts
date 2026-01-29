import { z } from 'zod';

export const  createPesquisadorSchema = z.object({

    nome: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Nome é obrigatório")
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome só deve conter letras e espaços")
    ),

    senha: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Senha é obrigatório!")
            .min(8, "Senha deve conter pelo menos 8 caracteres")
            .regex(/^[a-zA-Z0-9]+$/, "Senha deve conter letras e números")
    ),

    especialidade: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Especialidade só deve conter letras")
    ),

    email: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Email é obrigatório!")
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email deve conter apenas letras, números e caracteres especiais")
    ),

    titulacao: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Titulação é obrigatório")
            .min(3, "Minimo de 3 caracteres")
            .max(50, "Máximo de 50 caracteres")
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Titulação só dever letras")
    ),

    matricula: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .min(1, "Matrícula é obrigatório!")
            .regex(/^[0-9]+$/, "Matrícula deve conter apenas números")
    ), 

    linhaPesquisar: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.string()
            .max(50, "Máximo de 50 caracteres")
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Linha de pesquisa deve conter apenas letras e espaços")
    ),

    dataNascimento: z.preprocess(
        (val) => (val === undefined ? "": val),
        z.iso.date()
    )
    
})
