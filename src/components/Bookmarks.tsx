import React from "react";
import { BookmarksTable } from "./BookmarksTable";
import { bookmarks } from "../mock/bookmarks";

interface Bookmark {
    title: string;
    url: string;
    image: string;
}
interface State {
    bookmarks: Bookmark[];
}
interface Props {}

export class Bookmarks extends React.Component<Props, State> {
    public state = {
        bookmarks: []
    };

    public componentDidMount(): void {
        this.setState({
            bookmarks: bookmarks as Bookmark[]
        });
    }

    public render(): React.ReactElement {
        return (
            <div className="section">
                <div className="container">
                    <h1>Bookmarks</h1>
                    <BookmarksTable items={5} bookmarks={this.state.bookmarks} />
                </div>
            </div>
        );
    }
}
