import { Entity, Column, ManyToMany, ObjectType, JoinColumn, PrimaryColumn } from "typeorm";
import { Bookmark } from "./Bookmark";

@Entity()
export class BookmarkTag {
    constructor(args: { tag: string, bookmark: Bookmark | string }) {
        if (args) {
            this.tag = args.tag;
            this.bookmark = args.bookmark;
        }
    }
    @PrimaryColumn('varchar')
    public tag!: string;
    
    @ManyToMany((): ObjectType<Bookmark> => Bookmark)
    @JoinColumn()
    public bookmark!: Bookmark | string;

    @PrimaryColumn()
    public bookmarkId!: string;

}