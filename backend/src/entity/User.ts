import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Connection, createConnection } from 'typeorm';

interface UserConstructorArgs {
    username: string;
    password: string;
}

@Entity()
export class User {
    constructor(user: UserConstructorArgs){
        if(user){
            this.username = user.username;
            this.password = user.password;
        }
    }

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", { unique: true })
    username!: string;

    @Column("varchar")
    password!: string;

    @CreateDateColumn()
    dateCreated!: string;
}