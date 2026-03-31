import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "./Categoria.js";
import { Movimentacao } from "./Movimentacao.js";

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

    @ManyToOne(() => Categoria, (categoria) => categoria.insumos, { nullable: false, eager: true })
    @JoinColumn({ name: "categoria_id" })
    categoria: Categoria;

    @Column({ name: "unidade_medida", type: "varchar", nullable: false })
    unidadeMedida: string;

    @Column({ name: "estoque_atual", type: "float", default: 0 })
    estoqueAtual: number;

    @Column({ name: "estoque_minimo", type: "float", nullable: false })
    estoqueMinimo: number;

    @Column({ name: "estoque_maximo", type: "float", nullable: true })
    estoqueMaximo?: number;

    @Column({ type: "varchar", nullable: true })
    localizacao?: string;

    @Column({ type: "boolean", default: true })
    ativo: boolean;

    @OneToMany(() => Movimentacao, (movimentacao) => movimentacao.insumo)
    movimentacoes: Movimentacao[];
}
