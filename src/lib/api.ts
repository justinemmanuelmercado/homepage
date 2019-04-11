import { websites } from "../mock/websites";
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
    children: Map<string, string>;
    [key: string]: Map<string, string> | string | undefined;
}

export interface NewQuickLink extends BaseQuickLink {
    children: [string, string][];
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

export const getQuickLinks = async (): Promise<QuickLink[]> => {
    try {
        const items = (await http.get("/link?type=2")).data;
        return items.map((link: NewQuickLink) => {
            return {
                ...link,
                children: new Map(link.children)
            };
        });
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const putLink = async (
    link: Website | BaseBookmark | NewQuickLink,
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
