import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Insumo } from "./Insumo.js";

@Entity("categoria")
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    nome: string;

    @Column({ type: "text", nullable: true })
    descricao?: string;

    @OneToMany(() => Insumo, (insumo) => insumo.categoria)
    insumos: Insumo[];
}
