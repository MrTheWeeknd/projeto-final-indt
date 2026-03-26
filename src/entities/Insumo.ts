import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./Categoria.js"; 

@Entity("insumo")
export class Insumo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    codigo: string;

    @Column({ type: "varchar", nullable: false })
    nome: string;

    @Column({ type: "text", nullable: true })
    descricao?: string;

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: "categoria_id" })
    categoria: Categoria;

    @Column({ type: "varchar", nullable: false })
    unidade_medida: string;

    @Column({ type: "numeric", default: 0 })
    estoque_atual: number;

    @Column({ type: "numeric", nullable: false })
    estoque_minimo: number;

    @Column({ type: "numeric", nullable: true })
    estoque_maximo?: number;

    @Column({ type: "varchar", nullable: true })
    localizacao?: string;

    @Column({ type: "boolean", default: true })
    ativo: boolean;
}