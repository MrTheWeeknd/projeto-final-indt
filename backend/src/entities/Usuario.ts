import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movimentacao } from "./Movimentacao.js";

@Entity("usuario")
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", nullable: false })
    senha: string;

    @Column({ type: "varchar", nullable: false, default: "user" })
    role: "admin" | "user";

    @Column({ 
        type: "jsonb", 
        nullable: false, 
        default: { dashboard: true, insumos: true, categorias: true, movimentacoes: true } 
    })
    permissoes: {
        dashboard: boolean;
        insumos: boolean;
        categorias: boolean;
        movimentacoes: boolean;
    };

    @OneToMany(() => Movimentacao, (movimentacao) => movimentacao.usuario)
    movimentacoes: Movimentacao[];
}