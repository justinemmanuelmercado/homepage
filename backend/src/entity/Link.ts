import { Column, CreateDateColumn, PrimaryColumn } from "typeorm";

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

}