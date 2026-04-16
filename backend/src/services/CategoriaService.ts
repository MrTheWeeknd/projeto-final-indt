import { appDataSource } from "../database/appDataSource.js";
import { Categoria } from "../entities/Categoria.js";
import { AppError } from "../errors/AppError.js";
import { serializarCategoria, serializarCategorias } from "../utils/categoriaResponse.js";

type CategoriaPayload = {
    nome: string;
    descricao?: string;
};

class CategoriaService {
    private categoriaRepository = appDataSource.getRepository(Categoria);

    public async listarCategorias(): Promise<Categoria[]> {
        const categorias = await this.categoriaRepository.find({
            order: { nome: "ASC" },
        });

        return serializarCategorias(categorias);
    }

    public async buscarCategoriaPorId(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id },
        });

        if (!categoria) {
            throw new AppError(404, "Categoria nao encontrada");
        }

        return serializarCategoria(categoria);
    }

    public async criarCategoria(payload: CategoriaPayload): Promise<Categoria> {
        const categoriaExistente = await this.categoriaRepository.findOne({
            where: { nome: payload.nome },
        });

        if (categoriaExistente) {
            throw new AppError(409, "Ja existe uma categoria com esse nome");
        }

        const categoria = this.categoriaRepository.create(payload);
        await this.categoriaRepository.save(categoria);

        return serializarCategoria(categoria);
    }

    public async atualizarCategoria(id: number, payload: Partial<CategoriaPayload>): Promise<Categoria> {
        const categoria = await this.buscarCategoriaPorId(id);

        if (payload.nome && payload.nome !== categoria.nome) {
            const categoriaComMesmoNome = await this.categoriaRepository.findOne({
                where: { nome: payload.nome },
            });

            if (categoriaComMesmoNome) {
                throw new AppError(409, "Ja existe uma categoria com esse nome");
            }
        }

        this.categoriaRepository.merge(categoria, payload);
        await this.categoriaRepository.save(categoria);

        return serializarCategoria(categoria);
    }

    public async removerCategoria(id: number): Promise<void> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id },
            relations: { insumos: true },
        });

        if (!categoria) {
            throw new AppError(404, "Categoria nao encontrada");
        }

        if (categoria.insumos.length > 0) {
            throw new AppError(409, "Nao e possivel remover uma categoria vinculada a insumos");
        }

        await this.categoriaRepository.remove(categoria);
    }
}

export default CategoriaService;
