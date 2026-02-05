import { read, write } from '../utils/sensorFile.js';
import { AppError } from '../errors/AppError.js';
import { appDataSource } from '../database/appDataSource.js';
import  { Sensor } from '../entities/Sensor.js';


class SensorService {
    private fileName = 'sensor.json';
    private sensorsMemoria: Sensor[] = []
    private sensorRepository = appDataSource.getRepository(Sensor)


    public async getAllSensors(): Promise<Sensor[]> {
        return await this.sensorRepository.find();
    }


    public async getByIdSensor(id: string): Promise<Sensor> {
        const sensor = await this.sensorRepository.findOne({where: { id } })

        if(!sensor){
            throw new Error("Este sensor não existe")
        }
        
        return sensor;
    }


    public async addSensor(body: unknown): Promise<Sensor> {

        const { serialNumber, fabricante, modelo, tipo, status, ipFixo, dataInstalacao, dataManutencao, cicloLeitura, latitude, longitude, finalidade } = body as any;

        const sensorExiste = await this.sensorRepository.findOne({ where: { serialNumber } })

        if(sensorExiste) {
            throw new AppError(400, "Sensor já cadastrado!");
        }

        const novoSensor = await this.sensorRepository.create({ serialNumber, fabricante, modelo, tipo, status, ipFixo, dataInstalacao, dataManutencao, cicloLeitura, latitude, longitude, finalidade})
        
        await this.sensorRepository.save(novoSensor);
        return novoSensor;
    }
 
    public async updateSensor(id: string, body: Sensor) {

        // Recupera
        const sensorExiste = await this.sensorRepository.findOneBy({ id })  
        
        if(!sensorExiste) {
            throw new AppError(400, "Sensor não foi encontrado!");
        }

        const update = await this.sensorRepository.create(body);
        const sensorUpdate = await this.sensorRepository.merge(sensorExiste, update);

        await this.sensorRepository.save(sensorUpdate);
        return sensorUpdate;

    }

    public async deleteSensor(id: string) {

        const sensor = await this.sensorRepository.findOneBy({ id});

        if (!sensor) {
            throw new AppError(400, "Sensor não encontrado");
        }

        await this.sensorRepository.remove(sensor);


    }

}

export default SensorService;