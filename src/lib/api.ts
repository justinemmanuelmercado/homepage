import { websites } from "../mock/websites";
import { bookmarks } from "../mock/bookmarks";
import axios from "axios";

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ROOT
});

export interface Bookmark {
    title: string;
    url: string;
    image: string;
    dateCreated: string;
    id: string;
}

export interface Website {
    name: string;
    url: string;
}

export const getBookmarks = (): Promise<Bookmark[]> => {
    return new Promise((resolve, reject) => {
        if (!bookmarks) reject("Unable to get for some reason");
        setTimeout(() => {
            resolve(bookmarks);
        }, 1000);
    });
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
