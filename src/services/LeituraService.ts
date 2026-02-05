import { read, write } from '../utils/leituraFile.js';
import { AppError } from '../errors/AppError.js';
import { appDataSource } from '../database/appDataSource.js';
import  { Leitura } from '../entities/Leitura.js';


class LeituraService {
    private fileName = 'leitura.json';
    private leiturasMemoria: Leitura[] = []
    private leituraRepository = appDataSource.getRepository(Leitura)


    public async getAllLeituras(): Promise<Leitura[]> {
        return await this.leituraRepository.find();
    }

    public async getByIdLeitura(id: string): Promise<Leitura> {
        const leitura = await this.leituraRepository.findOne({where: { id } })

        if(!leitura){
            throw new Error("Este leitura não existe")
        }
        
        return leitura;
    }
    

    // Criar uma função que recupera um leitura pelo seu ID

    public async addLeitura(body: unknown): Promise<Leitura> {

        const { umidade, temperatura, dataHora } = body as any;

        const novoLeitura = await this.leituraRepository.create({
            umidade,
            temperatura, 
            dataHora
        })
        await this.leituraRepository.save(novoLeitura);
        return novoLeitura;
    }
 
    public async updateLeitura(id: string, body: Leitura) {

        // Recupera
        const leituraExiste = await this.leituraRepository.findOneBy({ id })  
        
        if(!leituraExiste) {
            throw new AppError(400, "Leitura não foi encontrado!");
        }

        const update = await this.leituraRepository.create(body);
        const leituraUpdate = await this.leituraRepository.merge(leituraExiste, update);

        await this.leituraRepository.save(leituraUpdate);
        return leituraUpdate;

    }

    public async deleteLeitura(id: string) {

        const leitura = await this.leituraRepository.findOneBy({ id });

        if (!leitura) {
            throw new AppError(400, "Leitura não encontrado");
        }
        await this.leituraRepository.remove(leitura);
    }

}

export default LeituraService;