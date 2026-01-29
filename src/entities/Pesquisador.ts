import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pesquisador")
export class Pesquisador {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false })
    nome: string;

    @Column({ type: "varchar", nullable: false })
    senha: string;

    @Column({ type: "varchar", nullable: true })
    especialidade?: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", nullable: false })
    titulacao: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    matricula: string;

    @Column({ type: "varchar", nullable: true})
    linhaPesquisar?: string;

    @Column({ type: "date", nullable: false})
    dataNascimento: string;

}