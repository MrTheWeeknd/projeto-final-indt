import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";
import { AppError } from "../errors/AppError.js";
import { hashPassword, isPasswordHash, signJwt, verifyPassword } from "../utils/security.js";
import { removerSenhaDoUsuario } from "../utils/usuarioResponse.js";
import type { LoginPayload } from "../validats/loginSchema.js";

type LoginResult = {
    token: string;
    expiresIn: string;
    usuario: ReturnType<typeof removerSenhaDoUsuario>;
};

class AuthService {
    private usuarioRepository = appDataSource.getRepository(Usuario);
    private tokenSecret = process.env.JWT_ACCESS_SECRET ?? "dev-secret-change-me";
    private tokenExpiration = process.env.JWT_ACCESS_EXPIRATION ?? "15m";

    public async login(payload: LoginPayload): Promise<LoginResult> {
        const usuario = await this.usuarioRepository.findOne({
            where: { email: payload.email },
        });

        if (!usuario) {
            throw new AppError(401, "Credenciais invalidas");
        }

        const senhaEmHash = isPasswordHash(usuario.senha);
        const senhaConfere = senhaEmHash
            ? await verifyPassword(payload.senha, usuario.senha)
            : payload.senha === usuario.senha;

        if (!senhaConfere) {
            throw new AppError(401, "Credenciais invalidas");
        }

        if (!senhaEmHash) {
            usuario.senha = await hashPassword(payload.senha);
            await this.usuarioRepository.save(usuario);
        }

        const token = signJwt(
            {
                sub: String(usuario.id),
                email: usuario.email,
            },
            this.tokenSecret,
            this.tokenExpiration,
        );

        return {
            token,
            expiresIn: this.tokenExpiration,
            usuario: removerSenhaDoUsuario(usuario),
        };
    }
}

export default AuthService;
