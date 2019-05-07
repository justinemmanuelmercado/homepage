import { Column, Entity } from "typeorm";
import { Link } from "./Link";

@Entity()
export class Bookmark extends Link {
    @Column({ nullable: true })
    note: string = "";

    @Column("simple-array", { nullable: true })
    tags: string[] = [];
}