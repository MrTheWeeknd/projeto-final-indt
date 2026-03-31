import type { ErrorRequestHandler } from "express";
import winston from "winston";
import { AppError } from "../errors/AppError.js";

const logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: "./logs/log-error.log" })],
});

const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
    logger.error(`${error.message} - ${req.path} - ${req.ip}`);
    console.log(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.name,
            message: error.message,
        });
    }

    return res.status(500).json({
        error: "Erro interno",
        message: "Ocorreu um erro interno em nossa aplicacao",
    });
};

export default errorMiddleware;
