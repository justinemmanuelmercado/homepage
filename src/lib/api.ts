import { websites } from "../mock/websites";
import { bookmarks } from "../mock/bookmarks";

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
