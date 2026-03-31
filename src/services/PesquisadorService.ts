import { read, write } from '../utils/pesquisadorFile.js';
import { AppError } from '../errors/AppError.js';
import { appDataSource } from '../database/appDataSource.js';
import  { Pesquisador } from '../entities/Movimentacao.js';


class PesquisadorService {
    private fileName = 'pesquisador.json';
    private pesquisadoresMemoria: Pesquisador[] = []
    private pesquisadorRepository = appDataSource.getRepository(Pesquisador)


    public async getAllPesquisadores(): Promise<Pesquisador[]> {
        return await this.pesquisadorRepository.find();
    }

    public async getByEmailPesquisador(email: string): Promise<Pesquisador> {
        const pesquisador = await this.pesquisadorRepository.findOne({where: {email} })

        if(!pesquisador){
            throw new Error("Este pesquisador não existe")
        }
        
        return pesquisador;
    }
    

    // Criar uma função que recupera um pesquisador pelo seu ID

    public async addPesquisador(body: unknown): Promise<Pesquisador> {

        const { nome, senha, especialidade, email, titulacao, matricula, linhaPesquisar, dataNascimento } = body as any;

        const pesquisadorExiste = await this.pesquisadorRepository.findOne({ where: { email } })
        if(pesquisadorExiste) {
            throw new AppError(400, "Pesquisador já cadastrado!");
        }

        const novoPesquisador = await this.pesquisadorRepository.create({
            nome,
            senha,
            especialidade,
            email,
            titulacao,
            matricula,
            linhaPesquisar,
            dataNascimento
        })
        await this.pesquisadorRepository.save(novoPesquisador);
        return novoPesquisador;
    }
 
    public async updatePesquisador(email: string, body: Pesquisador) {

        // Recupera
        const pesquisadorExiste = await this.pesquisadorRepository.findOneBy({ email })  
        
        if(!pesquisadorExiste) {
            throw new AppError(400, "Pesquisador não foi encontrado!");
        }

        const update = await this.pesquisadorRepository.create(body);
        const pesquisadorUpdate = await this.pesquisadorRepository.merge(pesquisadorExiste, update);

        await this.pesquisadorRepository.save(pesquisadorUpdate);
        return pesquisadorUpdate;

    }

    public async deletePesquisador(email: string) {

        const pesquisador = await this.pesquisadorRepository.findOneBy({ email});

        if (!pesquisador) {
            throw new AppError(400, "Pesquisador não encontrado");
        }

        await this.pesquisadorRepository.remove(pesquisador);


    }

}

export default PesquisadorService;