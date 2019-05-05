/* eslint-disable */
import uuid from 'uuid';
import Express from "express";
import { putLink } from "../db";

export const PutLink = async (req: Express.Request, res: Express.Response) => {
    let response = {
        table: process.env.TABLE_NAME,
        statusCode: 200,
        body: JSON.stringify('Successfully inserted object'),
    };
    const params = {
        Item: {
            ...req.body,
            "id": uuid.v1(),
            "dateCreated": new Date().toISOString()
        },
        TableName: process.env.TABLE_NAME as string
    };
    try {
        await putLink(params);
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