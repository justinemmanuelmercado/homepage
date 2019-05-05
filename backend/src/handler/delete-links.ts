import Express from "express";
import { deleteLinks } from "../db";

export const DeleteLinks = async (req: Express.Request, res: Express.Response) => {
    const { ids, dates } = req.query;
    try {
        const response = await deleteLinks(ids, dates);
        res.status(200);
        res.json({
            body: response
        });
    } catch(e) {
        res.status(500);
        res.json({
            body: e
        })
    }
};