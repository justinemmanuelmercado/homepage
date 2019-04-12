import React from "react";
import { FaSearch } from "react-icons/fa";
import { BookmarksTable } from "./BookmarksTable";
import { NewBookmarkForm } from "./NewBookmarkForm";
import { putLink, BaseBookmark, getBookmarks, Bookmark } from "../lib/api";

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
                    if (typeof bookmark[key] !== "string") continue;
                    const bookmarkAttr = (bookmark[key] as string).toLowerCase();
                    if (bookmarkAttr.indexOf(query.toLowerCase()) !== -1) {
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
                        <div className="column">
                            <div className="field">
                                <p className="control has-icons-left">
                                    <input
                                        onChange={this.handleChangeQuery}
                                        placeholder="Search..."
                                        type="text"
                                        value={this.state.query}
                                        className="input"
                                    />
                                    <span className="icon is-small is-left">
                                        <FaSearch />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {this.state.loading ? (
                        loading
                    ) : (
                        <BookmarksTable
                            toggleModal={this.toggleModal}
                            items={10}
                            bookmarks={bookmarks}
                            loadBookmarks={this.loadBookmarks}
                        />
                    )}
                </div>
                <NewBookmarkForm
                    handleSubmit={this.handleSubmit}
                    isOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                />
            </div>
        );
    }

    private handleSubmit = async (newBookmark: BaseBookmark) => {
        await putLink(newBookmark, 1);
        await this.loadBookmarks();
    };

    private loadBookmarks = async () => {
        this.setState({
            loading: true
        });
        const bookmarks = await getBookmarks();
        this.setState({
            bookmarks: bookmarks as Bookmark[],
            loading: false,
            modalOpen: false
        });
    };

    private toggleModal = (val: boolean): void => {
        this.setState({
            modalOpen: val
        });
    };
}
