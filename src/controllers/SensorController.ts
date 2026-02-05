import type { Request, Response } from "express";
import type SensorService from "../services/SensorService.js";


export default class SensorController {

    private sensorService: SensorService;

    constructor(sensorService:  SensorService) {
        this.sensorService = sensorService;
    }

    public async getAllSensors(req: Request, res: Response) {
        try {
            const sensors = await this.sensorService.getAllSensors();
            res.status(200).json(sensors);
        } catch (error) {
            console.log(error)
        }
    }

    public async getByIdSensor(req: Request, res: Response){
        const {id} = req.params;
        const leitura = await this.sensorService.getByIdSensor(id as string)
        res.status(200).json(leitura)

    }

    public async addSensor(req: Request, res: Response) {
        try{
            const body = req.body;
            const sensor = await this.sensorService.addSensor(body);
            res.status(201).json(sensor);
        } catch (error){
            console.log(error)
        }    
    }


    public async updateSensor(req: Request, res: Response) {
            const { id } = req.params;
            const body = req.body;
            const sensor = await this.sensorService.updateSensor(id as string, body);
            res.status(200).json(sensor);
    }

    public async deleteSensor(req: Request, res: Response) {
            const { id } = req.params;
            await this.sensorService.deleteSensor(id as string);
            res.status(204).json({ message: "Sensor deletado" })
    }
}
