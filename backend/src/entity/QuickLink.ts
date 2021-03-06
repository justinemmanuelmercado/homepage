import { Column, Entity } from "typeorm";
import { Link, LinkConstructorArgs } from "./Link";

export interface QuickLinkConstructorArgs extends LinkConstructorArgs { }

@Entity()
export class QuickLink extends Link {
    constructor(args: QuickLinkConstructorArgs) {
        super(args);
    }
    @Column({ nullable: true })
    thumbnail: string = "";
}