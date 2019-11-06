import Express from "express";
import { Connection, Repository, Entity } from "typeorm";
import { Bookmark } from "../entity/Bookmark";
import { QuickLink } from "../entity/QuickLink";

export const DeleteLinks = (connection: Connection) => async (req: Express.Request, res: Express.Response) => {
    const { ids, type } = req.query;
    try {
        let query;
        let repository:  Repository<any>;
        if (type == 1) {
            repository = await connection.getRepository(Bookmark);
        } else {
            repository = await connection.getRepository(QuickLink);
        }
        const toRemove = await repository.findByIds(ids);
        await repository.remove(toRemove);

        res.status(200);
        res.json({
            body: `Successfully deleted`,
            ids
        });
    } catch (e) {
        res.status(500);
        res.json({
            body: e
        })
    }
};