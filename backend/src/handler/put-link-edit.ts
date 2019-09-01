import Express from "express";
import { Connection } from "typeorm";
import { QuickLink } from "../entity/QuickLink";
import { Bookmark } from "../entity/Bookmark";
import { BookmarkTag } from "../entity/BookmarkTag";

interface BookmarkRequest {
    name?: string;
    url?: string;
    thumbnail?: string;
    note?: string;
    id: string;
    dateCreated?: string;
    tags: string[];
    type: number;
}

async function putLink(body: any, connection: Connection) {

    let link: Bookmark | QuickLink | undefined;
    let repo;
    if (isBookmark(body)) {
        const {tags, ...bodyWithoutTags} = body;
        repo = await connection.getRepository(Bookmark);
        link = await repo.findOne(body.id);
        if(!link) throw new Error(`unable to find bookmark with id ${body.id}`);
        link.name = bodyWithoutTags.name || "";
        link.note = bodyWithoutTags.note || "";
        link.thumbnail = bodyWithoutTags.thumbnail || "";
        link.url = bodyWithoutTags.url || "";

        repo.save(link);
        if (tags.length > 0) {
            let newTags: { tag: string, bookmarkId: string }[] = [];
            newTags = body.tags.map((tag: string) => {
                return { tag, bookmarkId: body.id }
            })

            await connection.createQueryBuilder().delete().from(BookmarkTag).where("bookmarkId = :bookmarkId", { bookmarkId: body.id }).execute();

            await connection
                .createQueryBuilder()
                .insert()
                .into(BookmarkTag)
                .values(newTags)
                .execute();

        }
    } else if (isQuickLink(body)) {
        // repo = await connection.getRepository(QuickLink);
    } else {
        throw new Error("invalid type");
    }

    const savedLink = await connection.manager.save(link);

}

export const PutLinkEdit = (connection: Connection) => async (req: Express.Request, res: Express.Response) => {
    const { id } = req.params;
    console.log(req.body);

    let response = {
        table: process.env.TABLE_NAME,
        statusCode: 200,
        body: JSON.stringify('Successfully inserted object'),
    };
    try {
        await putLink(req.body, connection);
        res.status(200);
        res.json({
            message: response
        })
    } catch (e) {
        res.status(500);
        res.json({
            body: e
        })
    }

}

const isBookmark = (link: any): link is BookmarkRequest => {
    return link.type === 1;
}

const isQuickLink = (link: any): link is QuickLink => {
    return link.type === 2;
} 