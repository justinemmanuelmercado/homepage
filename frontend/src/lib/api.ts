import axios from "axios";

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ROOT
});

export interface BookmarkTag {
    bookmarkId: string;
    tag: string;
}

export interface BaseBookmark {
    id?: string;
    name: string;
    url: string;
    note: string;
    thumbnail?: string;
}

export interface NewBookmark extends BaseBookmark {
    tags: string[];
}

export interface Bookmark extends BaseBookmark {
    dateCreated?: string;
    type?: number;
    tags?: BookmarkTag[];
    [key: string]: number | string | string[] | BookmarkTag[] | undefined;
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
    children: string[];
    id: string;
    [key: string]: string[] | string | undefined;
}

export interface NewQuickLink extends BaseQuickLink {
    children: [string, string][];
}

export const deleteBookmarks = async (
    items: string[],
    type: number
): Promise<boolean> => {
    try {
        let parameters = "";
        items.forEach((id: string): void => {
            if (!id) return;
            parameters += `ids[]=${id}&`;
        });
        await http.delete(`/link?${parameters}type=${type}`);
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

export const getQuickLinks = async (): Promise<QuickLink[]> => {
    try {
        const items = (await http.get("/link?type=2")).data;
        return items;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getTags = async (): Promise<BookmarkTag[]> => {
    try {
        const { tags } = (await http.get("/tags")).data;
        return tags;
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

export const deleteQuickLink = async (links: QuickLink[]): Promise<boolean> => {
    try {
        let parameters = "";
        links.forEach((ql: QuickLink): void => {
            if (!ql) return;
            parameters += `ids[]=${ql.id}&type=2`;
        });
        await http.delete(`link?${parameters}`);
        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const putLinkEdit = async (
    link: NewBookmark,
    type: number
): Promise<boolean> => {
    try {
        const newLink = {
            ...link,
            type
        };
        await http.put(`/link/${link.id}`, newLink);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/* eslint-disable */
export const getMetaData = async (
  url: string
): Promise<{ data: Record<string, any> }> => {
  /* eslint-enable */

    try {
        const metadata = await http.get(`/metadata/${url}`);
        return metadata;
    } catch (e) {
        console.error(e);
        return { data: [] };
    }
};
