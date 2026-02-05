import { Router } from "express";
import AreaController from "../controllers/AreaController.js";
import AreaService from "../services/AreaService.js";
import { validarBody } from "../middleware/validarBody.js";
import { createAreaSchema } from "../validats/createAreaSchema.js";

const areaRouter =  Router();
const areaService = new AreaService();
const areaController = new AreaController(areaService)

// localhost:6060/api/areas

areaRouter.get('/areas', (req, res) => areaController.getAllAreas(req, res));
areaRouter.get('/areas/:nome', (req, res) => areaController.getByNomeArea(req, res));
areaRouter.post('/areas', validarBody(createAreaSchema)  ,(req, res) => areaController.addArea(req, res));
areaRouter.put('/areas/:nome', (req, res) => areaController.updateArea(req, res));
areaRouter.delete('/areas/:nome', (req, res) => areaController.deleteArea(req, res));

export default areaRouter;