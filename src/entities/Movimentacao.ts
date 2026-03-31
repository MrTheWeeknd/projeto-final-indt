import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Insumo } from "./Insumo.js";
import { Usuario } from "./Usuario.js";
import { motivosMovimentacao, tiposMovimentacao } from "../types/Estoque.js";

@Entity("movimentacao")
export class Movimentacao {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Insumo, (insumo) => insumo.movimentacoes, { nullable: false, eager: true })
    @JoinColumn({ name: "insumo_id" })
    insumo: Relation<Insumo>;

    @Column({ type: "enum", enum: tiposMovimentacao, nullable: false })
    tipo: (typeof tiposMovimentacao)[number];

    @Column({ type: "enum", enum: motivosMovimentacao, nullable: false })
    motivo: (typeof motivosMovimentacao)[number];

    @Column({ type: "float", nullable: false })
    quantidade: number;

    @Column({ name: "saldo_apos", type: "float", nullable: false })
    saldoApos: number;

    @Column({ name: "linha_destino", type: "varchar", nullable: true })
    linhaDestino?: string;

    @Column({ type: "text", nullable: true })
    observacao?: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.movimentacoes, { nullable: false, eager: true })
    @JoinColumn({ name: "usuario_id" })
    usuario: Relation<Usuario>;

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    dataHora: Date;
}