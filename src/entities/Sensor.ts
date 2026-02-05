import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sensor")
export class Sensor {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    serialNumber: string;

    @Column({ type: "varchar", nullable: false })
    fabricante: string;

    @Column({ type: "varchar", nullable: false })
    modelo: string;

    @Column({ type: "varchar", nullable: false })
    tipo: string;

    @Column({ type: "varchar", nullable: false })
    status: string;

    @Column({ type: "varchar" })
    ipFixo?: string;

    @Column({ type: "date", nullable: false })
    dataInstalacao: string;

    @Column({ type: "date" })
    dataManutencao?: string;

    @Column({ type: "float", nullable: false })
    cicloLeitura: number;

    @Column({ type: "float", nullable: false })
    latitude: number;

    @Column({ type: "float", nullable: false })
    longitude:  number;

    @Column({ type: "varchar" })
    finalidade: string;
}