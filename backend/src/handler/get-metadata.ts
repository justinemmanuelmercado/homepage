import { Request, Response } from "express";
import { isURL } from "validator";

// @ts-ignore
import { getMetadata } from "page-metadata-parser";
import domino from "domino"
import fetch from "node-fetch";

export const GetMetadata = {
    get: async (req: Request, res: Response) => {
        const url = req.params[0];
        console.log(url);
        try {
            if (GetMetadata.validator(url)) {
                const metadata = await GetMetadata.scrape(url);
                res.status(200).json(metadata)
            } else {
                res.status(422).json({
                    message: "URL is invalid"
                })
            }
        } catch (e) {
            res.status(500).json({
                message: "Something went wrong"
            })
            console.error(e);
        }
    },
    scrape: async (url: string) => {;
        const response = await fetch(url);
        const html = await response.text();
        const doc = domino.createWindow(html).document;
        const metadata = getMetadata(doc, url);
        return metadata;
    },
    validator: (url: string) => {
        return isURL(url);
    }

};