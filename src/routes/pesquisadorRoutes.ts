import { Router } from "express";
import PesquisadorController from "../controllers/PesquisadorController.js";
import PesquisadorService from "../services/PesquisadorService.js";
import { validarBody } from "../middleware/validarBody.js";
import { createPesquisadorSchema } from "../validats/createPesquisadorSchema.js";

const pesquisadorRouter =  Router();
const pesquisadorService = new PesquisadorService();
const pesquisadorController = new PesquisadorController(pesquisadorService)

// localhost:6060/api/pesquisadores

pesquisadorRouter.get('/pesquisadores', (req, res) => pesquisadorController.getAllPesquisadores(req, res));
pesquisadorRouter.get('/pesquisadores/:email', (req, res) => pesquisadorController.getByEmailPesquisador(req, res));
pesquisadorRouter.post('/pesquisadores', validarBody(createPesquisadorSchema)  ,(req, res) => pesquisadorController.addPesquisador(req, res));
pesquisadorRouter.put('/pesquisadores/:email', (req, res) => pesquisadorController.updatePesquisador(req, res));
pesquisadorRouter.delete('/pesquisadores/:email', (req, res) => pesquisadorController.deletePesquisador(req, res));

export default pesquisadorRouter;