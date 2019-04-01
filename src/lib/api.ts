import { websites } from "../mock/websites";
import axios from "axios";

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ROOT
});

export interface Bookmark {
    title: string;
    url: string;
    note: string;
    dateCreated: string;
    tags: string[];
    id: string;
}

export interface Website {
    name: string;
    url: string;
}

export const getBookmarks = async (): Promise<Bookmark[]> => {
    try {
        return (await http.get("/link?type=1")).data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getFavorites = (): Promise<Website[]> => {
    return new Promise((resolve, reject) => {
        if (!websites) reject("Unable to get for some reason");
        setTimeout(() => {
            resolve(websites);
        }, 1000);
    });
};

export const putLink = async (
    link: Website | Bookmark,
    type: number
): Promise<boolean> => {
    try {
        const newLink = {
            ...link,
            type
        };
        await http.put("/links", newLink);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};
