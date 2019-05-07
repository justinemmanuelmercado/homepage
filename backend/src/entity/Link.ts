import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class Link {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name: string = "";

    @Column()
    url: string = "";

    @CreateDateColumn()
    dateCreated!: string;

}