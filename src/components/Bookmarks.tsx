import React from "react";
import { BookmarksTable } from "./BookmarksTable";
import { NewBookmarkForm } from "./NewBookmarkForm";
import { getBookmarks, Bookmark } from "../lib/api";

interface State {
    bookmarks: Bookmark[];
    loading: boolean;
    modalOpen: boolean;
}
interface Props {}
export class Bookmarks extends React.Component<Props, State> {
    public state = {
        bookmarks: [],
        loading: true,
        modalOpen: false
    };

    public async componentDidMount(): Promise<void> {
        const bookmarks = await getBookmarks();
        this.setState({
            bookmarks: bookmarks as Bookmark[],
            loading: false,
            modalOpen: false
        });
    }

    public render(): React.ReactElement {
        const loading = (
            <div>
                <h2>Loading...</h2>
            </div>
        );
        return (
            <div className="section">
                <div className="container">
                    <button className="button" onClick={() => this.toggleModal(true)}>
            Add Bookmark
                    </button>
                    {this.state.loading ? (
                        loading
                    ) : (
                        <BookmarksTable items={10} bookmarks={this.state.bookmarks} />
                    )}
                </div>
                <NewBookmarkForm
                    isOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                />
            </div>
        );
    }

    private toggleModal = (val: boolean): void => {
        this.setState({
            modalOpen: val
        });
    };
}
