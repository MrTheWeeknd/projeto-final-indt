import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("leitura")
export class Leitura {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "float", nullable: false })
    umidade: number;

    @Column({ type: "float", nullable: false })
    temperatura: number;

    @Column({ type: "date", nullable: false})
    dataHora: string;

}