import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";
import { AppError } from "../errors/AppError.js";
import {
    removerSenhaDeColecaoDeUsuarios,
    removerSenhaDoUsuario,
    type UsuarioSemSenha,
} from "../utils/usuarioResponse.js";

type UsuarioPayload = {
    email: string;
    senha: string;
};

class UsuarioService {
    private usuarioRepository = appDataSource.getRepository(Usuario);

    public async listarUsuarios(): Promise<UsuarioSemSenha[]> {
        const usuarios = await this.usuarioRepository.find({
            order: { email: "ASC" },
        });

        return removerSenhaDeColecaoDeUsuarios(usuarios);
    }

    public async buscarUsuarioPorId(id: number): Promise<UsuarioSemSenha> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Usuario nao encontrado");
        }

        return removerSenhaDoUsuario(usuario);
    }

    public async criarUsuario(payload: UsuarioPayload): Promise<UsuarioSemSenha> {
        const usuarioExistente = await this.usuarioRepository.findOne({
            where: { email: payload.email },
        });

        if (usuarioExistente) {
            throw new AppError(409, "Ja existe um usuario com esse email");
        }

        const usuario = this.usuarioRepository.create(payload);
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    public async atualizarUsuario(id: number, payload: Partial<UsuarioPayload>): Promise<UsuarioSemSenha> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Usuario nao encontrado");
        }

        if (payload.email && payload.email !== usuario.email) {
            const usuarioComMesmoEmail = await this.usuarioRepository.findOne({
                where: { email: payload.email },
            });

            if (usuarioComMesmoEmail) {
                throw new AppError(409, "Ja existe um usuario com esse email");
            }
        }

        this.usuarioRepository.merge(usuario, payload);
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    public async removerUsuario(id: number): Promise<void> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: { movimentacoes: true },
        });

        if (!usuario) {
            throw new AppError(404, "Usuario nao encontrado");
        }

        if (usuario.movimentacoes.length > 0) {
            throw new AppError(409, "Nao e possivel remover um usuario com movimentacoes");
        }

        await this.usuarioRepository.remove(usuario);
    }
}

export default UsuarioService;
