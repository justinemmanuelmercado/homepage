import React from "react";
import { BookmarksTable } from "./BookmarksTable";
import { NewBookmarkForm } from "./NewBookmarkForm";
import { putLink, BaseBookmark, getBookmarks, getTags, Bookmark, NewBookmark, BookmarkTag } from "../lib/api";

interface State {
    bookmarks: Bookmark[];
    loading: boolean;
    modalOpen: boolean;
    editableBookmark?: BaseBookmark,
}
interface Props { }
export class Bookmarks extends React.Component<Props, State> {
    public state = {
        bookmarks: [],
        loading: true,
        modalOpen: false,
        query: "",
        editableBookmark: undefined,
        tag: "",
        tags: [],
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

        let { bookmarks } = this.state;

        return (
            <div className="section">
                <div className="container">
                    {this.state.loading ? (
                        loading
                    ) : (
                            <BookmarksTable
                                toggleModal={this.toggleModal}
                                items={5}
                                bookmarks={bookmarks}
                                loadBookmarks={this.loadBookmarks}
                            />
                        )}
                </div>
                <NewBookmarkForm
                    currentBookmark={this.state.editableBookmark}
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

    private toggleModal = (val: boolean, bookmark?: Bookmark): void => {
        let newState;
        if (bookmark) {
            let editableBookmark: NewBookmark | Bookmark;
            if (bookmark.tags) {
                editableBookmark = {
                    ...bookmark,
                    tags: bookmark.tags.map(tag => tag.tag)
                };
            } else {
                editableBookmark = bookmark;
            }
            newState = {
                modalOpen: val,
                editableBookmark
            }
        } else {
            newState = {
                modalOpen: val
            }
        }
        this.setState(newState);
    };
}
