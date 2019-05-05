import Express from "express";

import { getLinks } from "../db";

export const GetLinks = async (req: Express.Request, res: Express.Response) => {
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
        const links = await getLinks(typeAsNum);
        res.status(200);
        res.json(links.Items)
    } catch (e) {
        res.status(e.statusCode);
        res.json({
            body: e
        });
    }

};