import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { validarBody } from "../middleware/requestValidation.js";
import AuthService from "../services/AuthService.js";
import { loginSchema } from "../validats/loginSchema.js";

const authRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post("/login", validarBody(loginSchema), (req, res) => authController.login(req, res));

export default authRouter;
