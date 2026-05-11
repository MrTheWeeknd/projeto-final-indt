import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";
import { AppError } from "../errors/AppError.js";
import { hashPassword } from "../utils/security.js";
import {
    removerSenhaDeColecaoDeUsuarios,
    removerSenhaDoUsuario,
    type UsuarioSemSenha,
} from "../utils/usuarioResponse.js";

type UsuarioPayload = {
    email: string;
    senha: string;
};

// I-define ti type para kadagiti pammalubos
type PermissoesPayload = {
    dashboard: boolean;
    insumos: boolean;
    categorias: boolean;
    movimentacoes: boolean;
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
            throw new AppError(404, "Saan a nasarakan ti user");
        }

        return removerSenhaDoUsuario(usuario);
    }

    public async criarUsuario(payload: UsuarioPayload): Promise<UsuarioSemSenha> {
        const usuarioExistente = await this.usuarioRepository.findOne({
            where: { email: payload.email },
        });

        if (usuarioExistente) {
            throw new AppError(409, "Adda metten ti user nga addaan iti daytoy nga email");
        }

        const usuario = this.usuarioRepository.create({
            ...payload,
            senha: await hashPassword(payload.senha),
            role: "user",
        });
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    public async promoverParaAdmin(id: number): Promise<UsuarioSemSenha> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Saan a nasarakan ti user");
        }

        if (usuario.role === "admin") {
            throw new AppError(400, "Ti user ket maysa idin nga admin");
        }

        usuario.role = "admin";
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    public async rebaixarParaUsuario(id: number): Promise<UsuarioSemSenha> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Saan a nasarakan ti user");
        }

        if (usuario.role === "user") {
            throw new AppError(400, "Ti user ket maysa idin a trabahador");
        }

        usuario.role = "user";
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    // ✨ BARO A METODO: I-update na dagiti granular a pammalubos ti user
    public async atualizarPermissoes(id: number, permissoes: PermissoesPayload): Promise<UsuarioSemSenha> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Saan a nasarakan ti user");
        }

        // I-save dagiti baro a pammalubos idiay database
        usuario.permissoes = permissoes;
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    public async atualizarUsuario(id: number, payload: Partial<UsuarioPayload>): Promise<UsuarioSemSenha> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new AppError(404, "Saan a nasarakan ti user");
        }

        if (payload.email && payload.email !== usuario.email) {
            const usuarioComMesmoEmail = await this.usuarioRepository.findOne({
                where: { email: payload.email },
            });

            if (usuarioComMesmoEmail) {
                throw new AppError(409, "Adda metten ti user nga addaan iti daytoy nga email");
            }
        }

        const payloadAtualizado = { ...payload };

        if (payloadAtualizado.senha !== undefined) {
            payloadAtualizado.senha = await hashPassword(payloadAtualizado.senha);
        }

        this.usuarioRepository.merge(usuario, payloadAtualizado);
        await this.usuarioRepository.save(usuario);

        return removerSenhaDoUsuario(usuario);
    }

    public async removerUsuario(id: number): Promise<void> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: { movimentacoes: true },
        });

        if (!usuario) {
            throw new AppError(404, "Saan a nasarakan ti user");
        }

        if (usuario.movimentacoes.length > 0) {
            throw new AppError(409, "Saan a mabalin a burakken ti user nga addaan kadagiti panaggaraw");
        }

        await this.usuarioRepository.remove(usuario);
    }
}

export default UsuarioService;