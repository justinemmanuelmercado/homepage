import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar")
    username!: string;

    @Column("varchar")
    password!: string;

    @CreateDateColumn()
    dateCreated!: string;
}