import { Column, Entity } from "typeorm";
import { Link } from "./Link";

@Entity()
export class QuickLink extends Link {
    @Column("simple-array", { nullable: true })
    children: string[] = [];
}