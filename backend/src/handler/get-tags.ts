import Express from "express";
import { Connection } from "typeorm";
import { BookmarkTag } from "../entity/BookmarkTag";

export const GetTags = (connection: Connection) => async (req: Express.Request, res: Express.Response) => {
    try {
        const tagsQuery = connection.createQueryBuilder()
            .select('DISTINCT ON (bookmarkTag.tag) "bookmarkTag"."tag"')
            .from(BookmarkTag, 'bookmarkTag')

        const tags = await tagsQuery.getRawMany();
        if (tags) {
            res.status(200);
            res.json({
                query: tagsQuery.getQuery(),
                tags
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500);
        res.json({
            body: e
        });
    }

};