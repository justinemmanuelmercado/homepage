import { Entity, ManyToOne, ObjectType, JoinColumn, PrimaryColumn } from "typeorm";
import { Bookmark } from "./Bookmark";

@Entity()
export class BookmarkTag {
    constructor(args: { tag: string, bookmarkId: string }) {
        if (args) {
            this.tag = args.tag;
            this.bookmarkId = args.bookmarkId;
        }
    }
    @PrimaryColumn('varchar')
    public tag!: string;
    
    @ManyToOne((): ObjectType<Bookmark> => Bookmark, user => user.tags, { onDelete: 'CASCADE' })
    @JoinColumn()
    public bookmark!: Bookmark | string;

    @PrimaryColumn()
    public bookmarkId!: string;

}