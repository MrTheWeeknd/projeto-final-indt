import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyJwt } from "../utils/security.js";

type JwtPayload = {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
};

declare module "express-serve-static-core" {
    interface Request {
        auth?: {
            userId: number;
            email: string;
            role: string;
        };
    }
}

export function autenticarToken(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError(401, "Token de acesso ausente"));
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const secret = process.env.JWT_ACCESS_SECRET ?? "dev-secret-change-me";

    try {
        const decoded = verifyJwt(token, secret) as JwtPayload;
        req.auth = {
            userId: Number(decoded.sub),
            email: decoded.email,
            role: decoded.role,
        };
        return next();
    } catch {
        return next(new AppError(401, "Token invalido ou expirado"));
    }
}
