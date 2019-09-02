import { Column, Entity, OneToMany, ObjectType } from "typeorm";
import { Link, LinkConstructorArgs } from "./Link";
import { BookmarkTag } from "./BookmarkTag";
 
export interface BookmarkConstructorArgs extends LinkConstructorArgs {}

@Entity()
export class Bookmark extends Link {
    constructor(args: BookmarkConstructorArgs){
        super(args);
    }

    @Column({ nullable: true })
    thumbnail: string = "";

    @Column({ nullable: true })
    note: string = "";

    @OneToMany((): ObjectType<BookmarkTag> => BookmarkTag, bookmarkTag => bookmarkTag.bookmark,  { onDelete: 'CASCADE' })
    public tags!: BookmarkTag[]
}