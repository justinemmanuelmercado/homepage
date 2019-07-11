import Express from "express";
import { Connection } from "typeorm";
import { QuickLink } from "../entity/QuickLink";
import { Bookmark } from "../entity/Bookmark";
import { BookmarkTag } from "../entity/BookmarkTags";
// import { putLink } from "../db";

async function putLink(body: any, connection: Connection) {
    let newLink: Bookmark | QuickLink;
    if (body.type == 1) {
        newLink = new Bookmark();
        newLink.name = body.name;
        newLink.url = body.url;
        newLink.note = body.note;

    } else if (body.type == 2) {
        newLink = new QuickLink();
        newLink.name = body.name;
        newLink.url = body.url;
        newLink.children = body.children;
    } else {
        throw `invalid type: ${body.type}`
    }
    const savedLink = await connection.manager.save(newLink);
    if (body.tags.length > 0) {
        let newTags: { tag: string, bookmarkId: string }[] = [];
        newTags = body.tags.map((tag: string) => {
            console.log({ tag, bookmarkId: savedLink.id });
            return { tag, bookmarkId: savedLink.id }
        })

        await connection
            .createQueryBuilder()
            .insert()
            .into(BookmarkTag)
            .values(newTags)
            .execute();

    }
}

export const PutLink = (connection: Connection) => async (req: Express.Request, res: Express.Response) => {
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