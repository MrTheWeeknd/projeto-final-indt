import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function verificarAdmin(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    if (!req.auth) {
        return next(new AppError(401, "Usuario nao autenticado"));
    }

    if (req.auth.role !== "admin") {
        return next(
            new AppError(403, "Acesso negado - requer permissao de admin")
        );
    }

    return next();
}

export function verificarPropriedadeOuAdmin(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    if (!req.auth) {
        return next(new AppError(401, "Usuario nao autenticado"));
    }

    const idDoRecurso = Number(req.params.id);
    const usuarioId = req.auth.userId;

    if (req.auth.role !== "admin" && idDoRecurso !== usuarioId) {
        return next(
            new AppError(
                403,
                "Acesso negado - voce so pode acessar seus proprios dados"
            )
        );
    }

    return next();
}
