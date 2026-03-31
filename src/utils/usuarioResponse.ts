import { Usuario } from "../entities/Usuario.js";

export type UsuarioSemSenha = Omit<Usuario, "senha">;

export function removerSenhaDoUsuario(usuario: Usuario): UsuarioSemSenha {
    const { senha: _senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
}

export function removerSenhaDeColecaoDeUsuarios(usuarios: Usuario[]): UsuarioSemSenha[] {
    return usuarios.map((usuario) => removerSenhaDoUsuario(usuario));
}
