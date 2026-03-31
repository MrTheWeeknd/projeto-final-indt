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

    @OneToMany(() => Movimentacao, (movimentacao) => movimentacao.usuario)
    movimentacoes: Movimentacao[];
}
