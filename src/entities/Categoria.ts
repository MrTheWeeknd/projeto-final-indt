import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categoria")
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    nome: string;

    @Column({ type: "text", nullable: true })
    descricao?: string;
}