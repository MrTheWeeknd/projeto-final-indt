import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const validarBody = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: "validation-error",
                    error: error.issues.map((issue) => ({
                        field: issue.path[0] as string,
                        message: issue.message,
                    })),
                });
            }

            return next(new AppError(500, "Erro interno na validacao dos dados"));
        }
    };
};
