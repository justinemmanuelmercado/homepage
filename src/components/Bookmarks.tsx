import React from "react";
import { BookmarksTable } from "./BookmarksTable";
import { Title } from "./Title";
import { getBookmarks, Bookmark } from "../lib/api";
import { Modal } from "./Modal";

interface State {
    bookmarks: Bookmark[];
    loading: boolean;
    modalOpen: boolean;
    newBookmark: NewBookmark;
}
interface Props {}

export interface NewBookmark {
    title: string;
    url: string;
    note: string;
    tags: string[];
}

const blankBookmark: NewBookmark = {
    title: "",
    url: "",
    note: "",
    tags: []
};
export class Bookmarks extends React.Component<Props, State> {
    public state = {
        bookmarks: [],
        loading: true,
        modalOpen: false,
        newBookmark: blankBookmark
    };

    public async componentDidMount(): Promise<void> {
        const bookmarks = await getBookmarks();
        console.log(bookmarks);
        this.setState({
            bookmarks: bookmarks as Bookmark[],
            loading: false,
            modalOpen: false
        });
    }

    private renderModal = (): React.ReactElement => {
        const footer = (
            <div>
                <button className="button">Save</button>
            </div>
        );
        return (
            <Modal
                footer={footer}
                handleClose={() => this.toggleModal(false)}
                title={"Add Bookmark"}
            >
                <div className="form">
                    <div className="field">
                        <label className="label">Title</label>
                        <div className="control">
                            <input
                                value={this.state.newBookmark.title}
                                onChange={this.handleInputChange}
                                id="title"
                                className="input"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">URL</label>
                        <div className="control">
                            <input
                                value={this.state.newBookmark.title}
                                onChange={this.handleInputChange}
                                id="title"
                                className="input"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Note</label>
                        <div className="control">
                            <textarea
                                value={this.state.newBookmark.title}
                                onChange={this.handleInputChange}
                                id="note"
                                className="textarea"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Tags</label>
                        <div className="control">
                            <input
                                value={this.state.newBookmark.title}
                                onChange={this.handleInputChange}
                                id="title"
                                className="input"
                                type="text"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    public render(): React.ReactElement {
        const loading = (
            <div>
                <h2>Loading...</h2>
            </div>
        );
        return (
            <div className="section">
                <div className="container">
                    <Title onClick={() => this.toggleModal(true)}>Bookmarks</Title>
                    {this.state.loading ? (
                        loading
                    ) : (
                        <BookmarksTable items={5} bookmarks={this.state.bookmarks} />
                    )}
                </div>
                {this.state.modalOpen && this.renderModal()}
            </div>
        );
    }

    private handleInputChange = (
        evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newBm = {
            ...this.state.newBookmark,
            [evt.currentTarget.id]: evt.currentTarget.value
        };
        this.setState({
            newBookmark: newBm
        });
    };

    private toggleModal(val: boolean): void {
        console.log(val);
        this.setState({
            modalOpen: val
        });
    }
}
