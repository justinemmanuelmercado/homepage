import Express from "express";
import { Connection, ObjectType } from "typeorm";
import { Bookmark } from "../entity/Bookmark";
import { QuickLink } from "../entity/QuickLink";

async function getLinks(type: Number, connection: Connection) {
    let entity: ObjectType<Bookmark | QuickLink>;
    if (type === 1) {
        entity = Bookmark;
    } else {
        entity = QuickLink;
    }
    let repo = connection.getRepository(entity);
    return await repo.find()
}


export const GetLinks = (connection: Connection) => async (req: Express.Request, res: Express.Response) => {
    const { type } = req.query;
    if (isNaN(type)) {
        res.status(400);
        res.json({
            body: `${type} must be a number`
        });
        return;
    }
    const typeAsNum = parseInt(type);
    try {
        if (typeAsNum !== 1 && typeAsNum !== 2) {
            res.status(400);
            res.json({
                body: `Invalid type: ${type}`
            });
            return;
        }
        const links = await getLinks(typeAsNum, connection);
        res.status(200);
        res.json(links)
    } catch (e) {
        res.status(e.statusCode);
        res.json({
            body: e
        });
    }

};