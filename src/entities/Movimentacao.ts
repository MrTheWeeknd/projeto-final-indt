import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Insumo } from "./Insumo.js";

@Entity("movimentacao")
export class Movimentacao {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Insumo)
    @JoinColumn({ name: "insumo_id" })
    insumo: Insumo;

    @Column({ type: "enum", enum: ['entrada', 'saida'], nullable: false })
    tipo: string;

    @Column({ type: "enum", enum: ['compra', 'devolucao', 'consumo', 'perda', 'ajuste'], nullable: false })
    motivo: string;

    @Column({ type: "numeric", nullable: false })
    quantidade: number;

    @Column({ type: "numeric", nullable: false })
    saldo_apos: number;

    @Column({ type: "varchar", nullable: true })
    linha_destino?: string;

    @Column({ type: "text", nullable: true })
    observacao?: string;

    @Column({ type: "int", nullable: false }) 
    registrado_por: number;

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;
}