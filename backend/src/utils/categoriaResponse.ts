import { Categoria } from "../entities/Categoria.js";

export function serializarCategoria(categoria: Categoria): Categoria {
    return categoria;
}

export function serializarCategorias(categorias: Categoria[]): Categoria[] {
    return categorias.map((categoria) => serializarCategoria(categoria));
}
