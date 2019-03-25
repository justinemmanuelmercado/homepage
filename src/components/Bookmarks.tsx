import React from "react";
import { BookmarksTable } from "./BookmarksTable";
import { Title } from "./Title";
import { getBookmarks, Bookmark } from "../lib/api";
import { Modal } from "./Modal";

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

    private renderModal = (): React.ReactElement => {
        return (
            <Modal handleClose={() => this.toggleModal(false)} title={"Add Bookmark"}>
                <div className="form">
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="e.g Alex Smith"
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

    private toggleModal(val: boolean): void {
        console.log(val);
        this.setState({
            modalOpen: val
        });
    }
}
