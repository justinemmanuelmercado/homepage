import React from "react";
import { BookmarksTable } from "./BookmarksTable";
import { NewBookmarkForm } from "./NewBookmarkForm";
import { getBookmarks, Bookmark } from "../lib/api";

interface State {
    bookmarks: Bookmark[];
    loading: boolean;
    modalOpen: boolean;
    query: string;
}
interface Props {}
export class Bookmarks extends React.Component<Props, State> {
    public state = {
        bookmarks: [],
        loading: true,
        modalOpen: false,
        query: ""
    };

    public async componentDidMount(): Promise<void> {
        const bookmarks = await getBookmarks();
        this.setState({
            bookmarks: bookmarks as Bookmark[],
            loading: false,
            modalOpen: false
        });
    }

    private handleChangeQuery = (
        evt: React.SyntheticEvent<HTMLInputElement>
    ): void => {
        this.setState({ query: evt.currentTarget.value });
    };

    public render(): React.ReactElement {
        const loading = (
            <div>
                <h2>Loading...</h2>
            </div>
        );

        let { bookmarks, query } = this.state;
        if (query && bookmarks.length > 0) {
            bookmarks = bookmarks.filter((bookmark: Bookmark) => {
                let match = false;
                for (const key in bookmark as Bookmark) {
                    const bookmarkAttr = (bookmark[key] as string).toLowerCase();
                    if (
                        typeof bookmark[key] === "string" &&
            bookmarkAttr.indexOf(query.toLowerCase()) !== -1
                    ) {
                        match = true;
                        break;
                    }
                }

                return match;
            });
        }

        return (
            <div className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column  is-one-fifth">
                            <button className="button" onClick={() => this.toggleModal(true)}>
                Add Bookmark
                            </button>
                        </div>
                        <div className="column">
                            <input
                                onChange={this.handleChangeQuery}
                                placeholder="Search..."
                                type="text"
                                value={this.state.query}
                                className="input"
                            />
                        </div>
                    </div>
                    {this.state.loading ? (
                        loading
                    ) : (
                        <BookmarksTable items={10} bookmarks={bookmarks} />
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
