import React from "react";
import { BaseBookmark } from "../lib/api";
import { Modal } from "./Modal";

interface State {
    newBookmark: BaseBookmark;
    loading: boolean;
}

interface Props {
    currentBookmark?: BaseBookmark;
    handleSubmit: (newBookmark: BaseBookmark) => Promise<void>;
    toggleModal: (v: boolean) => void;
    isOpen: boolean;
}

const blankBookmark: BaseBookmark = {
    title: "",
    url: "",
    note: "",
    tags: []
};

export class NewBookmarkForm extends React.Component<Props, State> {
    public state = {
        loading: false,
        newBookmark: this.props.currentBookmark ? this.props.currentBookmark : blankBookmark
    };

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

    private handleSetChips = (tags: string[]) => {
        this.setState({
            newBookmark: {
                ...this.state.newBookmark,
                tags
            }
        });
    };

    
    private handleSubmit = async (): Promise<void> => {
        const { newBookmark } = this.state;
        this.setState({ loading: true });
        this.props.handleSubmit(newBookmark);
        this.setState({ loading: false });
        this.props.toggleModal(false);
    };
    

    public render(): React.ReactElement {
        if (!this.props.isOpen) return <></>;
        const footer = (
            <div>
                <button
                    disabled={this.state.loading}
                    onClick={this.handleSubmit}
                    className={`button ${this.state.loading && "is-loading"}`}
                >
          Save
                </button>
                <button
                    disabled={this.state.loading}
                    onClick={() => this.props.toggleModal(false)}
                    className={`button ${this.state.loading && "is-loading"}`}
                >
          Cancel
                </button>
            </div>
        );
        return (
            <Modal
                footer={footer}
                handleClose={() => this.props.toggleModal(false)}
                title={"Bookmark"}
            >
                <div className="form">
                    <div className="field">
                        <label className="label">URL</label>
                        <div className="control">
                            <input
                                value={this.state.newBookmark.url}
                                onChange={this.handleInputChange}
                                id="url"
                                className="input"
                                type="website"
                            />
                        </div>
                    </div>
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
                        <label className="label">Note</label>
                        <div className="control">
                            <textarea
                                value={this.state.newBookmark.note}
                                onChange={this.handleInputChange}
                                id="note"
                                className="textarea"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
