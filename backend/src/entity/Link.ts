import { Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from './User';

export interface LinkConstructorArgs {
    id: string;
    name: string;
    url: string;
}
export class Link {
    constructor(args: LinkConstructorArgs){
        if(args){
            this.id = args.id;
            this.name = args.name;
            this.url = args.url;
        }
    }

    @PrimaryColumn('varchar')
    id!: string;

    @Column()
    name: string = "";

    @Column()
    url: string = "";

    @CreateDateColumn()
    dateCreated!: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn()
    user!: string | User;

}