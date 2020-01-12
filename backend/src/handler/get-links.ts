import Express from "express";
import { Connection, ObjectType } from "typeorm";
import { Bookmark } from "../entity/Bookmark";
import { QuickLink } from "../entity/QuickLink";

async function getLinks(type: Number, connection: Connection, userId?: string) {
    let entity: ObjectType<Bookmark | QuickLink>;
    let queryBuilder;
    if (type === 1) {
        entity = Bookmark;
        let repo = connection.getRepository(entity);
        queryBuilder = repo.createQueryBuilder('bookmark')
            .leftJoin('bookmark.user', 'user')
            .leftJoinAndSelect('bookmark.tags', 'tags')
            .orderBy({
                [`bookmark.dateCreated`]: "DESC",
            });
    } else {
        entity = QuickLink;
        let repo = connection.getRepository(entity);
        queryBuilder = repo.createQueryBuilder('ql')
            .leftJoin('ql.user', 'user')
            .orderBy({
                [`ql.dateCreated`]: "DESC",
            });;


    }
    if (userId) {
        queryBuilder = queryBuilder.where("user.id = :userId", { userId });
    } else {
        queryBuilder = queryBuilder.where("user is null")
    }
    return await queryBuilder.getMany();
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
        const links = await getLinks(typeAsNum, connection, req.user?.id);
        res.status(200);
        res.json(links)
    } catch (e) {
        console.error(e);
        res.status(500);
        res.json({
            body: e
        });
    }

};