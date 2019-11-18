import Express from "express";
import { Connection } from "typeorm";
import { QuickLink } from "../entity/QuickLink";
import { Bookmark } from "../entity/Bookmark";
import { BookmarkTag } from "../entity/BookmarkTag";
// import { putLink } from "../db";
import uuidv4 from "uuid/v4";

async function putLink(body: any, connection: Connection) {
    let newLink: QuickLink | Bookmark;
    let linkId = uuidv4();
    if (body.type == 1) {
        const newBookmark: Bookmark = new Bookmark({
            id: linkId,
            name: body.name,
            url: body.url
        });
        newBookmark.note = body.note;
        newBookmark.thumbnail = body.thumbnail
        const savedLink = await connection.manager.save(newBookmark);
        if (body.tags.length > 0) {
            let newTags: { tag: string, bookmarkId: string }[] = [];
            newTags = body.tags.map((tag: string) => {
                return { tag, bookmarkId: savedLink.id }
            })

            await connection
                .createQueryBuilder()
                .insert()
                .into(BookmarkTag)
                .values(newTags)
                .execute();

        }
    } else if (body.type == 2) {
        let newQuicklink: QuickLink = new QuickLink({
            id: linkId,
            name: body.name,
            url: body.url
        });
        if (body.thumbnail) {
            newQuicklink.thumbnail = body.thumbnail
        }
        await connection.manager.save(newQuicklink);

    } else {
        throw `invalid type: ${body.type}`
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