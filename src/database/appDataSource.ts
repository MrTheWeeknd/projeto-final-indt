import { DataSource } from "typeorm";
import { Categoria } from "../entities/Categoria.js";
import { Insumo } from "../entities/Insumo.js";
import { Movimentacao } from "../entities/Movimentacao.js";
import { Usuario } from "../entities/Usuario.js";

export const appDataSource = new DataSource({

    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "123",
    database: process.env.DB_NAME ?? "reservaIot2",
    entities: [Categoria, Insumo, Movimentacao, Usuario],
    logging: false,
    synchronize: true,

})
