import { read, write } from '../utils/areaFile.js';
import { AppError } from '../errors/AppError.js';
import { appDataSource } from '../database/appDataSource.js';
import  { Area } from '../entities/Area.js';


class AreaService {
    private fileName = 'area.json';
    private areasMemoria: Area[] = []
    private areaRepository = appDataSource.getRepository(Area)


    public async getAllAreas(): Promise<Area[]> {
        return await this.areaRepository.find();
    }

    public async getByNomeArea(nome: string): Promise<Area> {
        const area = await this.areaRepository.findOne({where: {nome} })

        if(!area){
            throw new Error("Esta área não existe")
        }
        return area;
    }

    public async addArea(body: unknown): Promise<Area> {
        const { nome, descricao, bioma, latitude, longitude, largura, comprimento, relevo } = body as any;

        const areaExiste = await this.areaRepository.findOne({ where: { nome } })
        if(areaExiste) {
            throw new AppError(400, "Área já cadastrada!");
        }

        const novaArea = await this.areaRepository.create({
            nome,
            descricao,
            bioma,
            latitude,
            longitude,
            largura,
            comprimento,
            relevo
        })
        await this.areaRepository.save(novaArea);
        return novaArea;
    }
 
    public async updateArea(nome: string, body: Area) {

        // Recupera
        const areaExiste = await this.areaRepository.findOneBy({ nome })  
        
        if(!areaExiste) {
            throw new AppError(400, "Area não foi encontrado!");
        }

        const update = await this.areaRepository.create(body);
        const areaUpdate = await this.areaRepository.merge(areaExiste, update);

        await this.areaRepository.save(areaUpdate);
        return areaUpdate;

    }

    public async deleteArea(nome: string) {

        const area = await this.areaRepository.findOneBy({ nome});

        if (!area) {
            throw new AppError(400, "Área não encontrada");
        }

        await this.areaRepository.remove(area);
    }

}

export default AreaService;