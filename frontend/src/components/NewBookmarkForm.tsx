import React from "react";
import { NewBookmark, getMetaData } from "../lib/api";
import { Modal } from "./Modal";
import { ChipsInput } from "./ChipsInput";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import validator from "validator";

interface State {
    newBookmark: NewBookmark;
    loading: boolean;
}

interface Props {
    currentBookmark?: NewBookmark;
    handleSubmit: (newBookmark: NewBookmark) => Promise<void>;
    toggleModal: (v: boolean) => void;
    isOpen: boolean;
}

const blankBookmark: NewBookmark = {
    name: "",
    url: "",
    note: "",
    thumbnail: "",
    tags: []
};

export class NewBookmarkForm extends React.Component<Props, State> {
    public state = {
        loading: false,
        newBookmark: this.props.currentBookmark
            ? this.props.currentBookmark
            : blankBookmark
    };

    private handleInputChange = (
        evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const newBm = {
            ...this.state.newBookmark,
            [evt.currentTarget.id]: evt.currentTarget.value
        };
        this.setState({
            newBookmark: newBm
        });
    };

    private debounced = AwesomeDebouncePromise(getMetaData, 1000);

    private handleUrlChange = async (
        evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ): Promise<void> => {
        const url = evt.currentTarget.value;
        this.setState({
            newBookmark: {
                ...this.state.newBookmark,
                url
            }
        });

        if (validator.isURL(url)) {
            try {
                evt.persist();
                const { data } = await this.debounced(url);
                console.log(data);
                if (data.image) {
                    this.setState({
                        newBookmark: {
                            ...this.state.newBookmark,
                            thumbnail: data.image
                        }
                    });
                }
            } catch (e) {
                console.error("Something went wrong");
                console.error(e);
            }
        }
    };

    private handleSetChips = (tags: string[]): void => {
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
        let bm = this.state.newBookmark;
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
                    onClick={(): void => this.props.toggleModal(false)}
                    className={`button ${this.state.loading && "is-loading"}`}
                >
          Cancel
                </button>
            </div>
        );
        return (
            <Modal
                footer={footer}
                handleClose={(): void => this.props.toggleModal(false)}
                title={"Bookmark"}
            >
                <div className="form">
                    <div className="columns">
                        <div className="column">
                            <figure className="is-marginless image is-128x128">
                                <img
                                    src={
                                        bm.thumbnail
                                            ? bm.thumbnail
                                            : "https://via.placeholder.com/150"
                                    }
                                    alt="Link thumbnail"
                                />
                            </figure>
                            <div className="field">
                                <div className="control">
                                    <input
                                        disabled={true}
                                        value={bm.thumbnail}
                                        onChange={this.handleInputChange}
                                        id="thumbnail"
                                        className="input"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field">
                                <label className="label">URL</label>
                                <div className="control">
                                    <input
                                        value={bm.url}
                                        onChange={this.handleUrlChange}
                                        id="url"
                                        className="input"
                                        type="website"
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input
                                        value={bm.name}
                                        onChange={this.handleInputChange}
                                        id="name"
                                        className="input"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Note</label>
                        <div className="control">
                            <textarea
                                value={bm.note}
                                onChange={this.handleInputChange}
                                id="note"
                                className="textarea"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Tags</label>
                        <ChipsInput chips={bm.tags} onChange={this.handleSetChips} />
                    </div>
                </div>
            </Modal>
        );
    }
}
