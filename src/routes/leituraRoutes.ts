import { Router } from "express";
import LeituraController from "../controllers/LeituraController.js";
import LeituraService from "../services/LeituraService.js";
import { validarBody } from "../middleware/validarBody.js";
import { createLeituraSchema } from "../validats/createLeituraSchema.js";

const leituraRouter =  Router();
const leituraService = new LeituraService();
const leituraController = new LeituraController(leituraService)

// localhost:6060/api/leituras

leituraRouter.get('/leituras', (req, res) => leituraController.getAllLeituras(req, res));
leituraRouter.get('/leituras/:id', (req, res) => leituraController.getByIdLeitura(req, res));
leituraRouter.post('/leituras', validarBody(createLeituraSchema)  ,(req, res) => leituraController.addLeitura(req, res));
leituraRouter.put('/leituras/:id', (req, res) => leituraController.updateLeitura(req, res));
leituraRouter.delete('/leituras/:id', (req, res) => leituraController.deleteLeitura(req, res));

export default leituraRouter;