import { websites } from "../mock/websites";
import { quickLinks } from "../mock/quicklink";
import axios from "axios";

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ROOT
});

export interface BaseBookmark {
    title: string;
    url: string;
    note: string;
    tags: string[];
}

export interface Bookmark extends BaseBookmark {
    id: string;
    dateCreated: string;
    type: number;
    [key: string]: number | string | string[];
}

export interface Website {
    name: string;
    url: string;
}

export interface BaseQuickLink {
    name: string;
    url: string;
}

export interface QuickLink extends BaseQuickLink {
    children?: BaseQuickLink[];
    [key: string]: BaseQuickLink[] | string | undefined;
}

export const deleteBookmarks = async (
    items: ({ id: string; dateCreated: string } | undefined)[]
): Promise<boolean> => {
    try {
        let parameters = "";
        items.forEach((item: { id: string; dateCreated: string } | undefined) => {
            if (!item) return;
            parameters += `ids[]=${item.id}&dates[]=${item.dateCreated}&`;
        });
        await http.delete(`/link?${parameters}`);
        return true;
    } catch (e) {
        return false;
    }
};

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

export const getQuickLinks = (): Promise<QuickLink[]> => {
    return new Promise((resolve, reject) => {
        if (!quickLinks) reject("Unable to get for some reason");
        setTimeout(() => {
            resolve(quickLinks);
        }, 1000);
    });
};

export const putLink = async (
    link: Website | BaseBookmark,
    type: number
): Promise<boolean> => {
    try {
        const newLink = {
            ...link,
            type
        };
        await http.put("/link", newLink);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};
