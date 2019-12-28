import { Request, Response } from "express";

import validator from "validator";

import metascraper from 'metascraper';
// @ts-ignore
import metascraperAuthor from 'metascraper-author';
// @ts-ignore
import metascraperDate from 'metascraper-date';
// @ts-ignore
import metascraperDescription from 'metascraper-description';
// @ts-ignore
import metascraperImage from 'metascraper-image';
// @ts-ignore
import metascraperLogo from 'metascraper-logo';
// @ts-ignore
import metascraperLogoFavicon from 'metascraper-logo-favicon';
// @ts-ignore
import metascraperTitle from 'metascraper-title';
// @ts-ignore
import metascraperUrl from 'metascraper-url';
// @ts-ignore
import metascraperVideo from 'metascraper-video';
// @ts-ignore
import metascraperYoutube from 'metascraper-youtube';
import got from "got";
// import { getMetadata } from "page-metadata-parser";
import domino from "domino"
import fetch from "node-fetch";

export const GetMetadata = {
    get: async (req: Request, res: Response) => {
        const url = req.params[0];
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
    scrape: async (url: string) => {
        ;
        const response = await fetch(url);
        const html = await response.text();
        const doc = domino.createWindow(html).document;
        // const metadata = getMetadata(doc, url);

        const { body, url: gotUrl } = await got(url);
        const scraper = metascraper([
            metascraperAuthor(),
            metascraperDate(),
            metascraperDescription(),
            metascraperImage(),
            metascraperLogo(),
            metascraperLogoFavicon(),
            metascraperTitle(),
            metascraperUrl(),
            metascraperYoutube(),
            metascraperVideo()
        ])

        const metadata = await scraper({ html: body, url: gotUrl })
        return metadata;
    },
    validator: (url: string) => {
        return validator.isURL(url);
    }

};