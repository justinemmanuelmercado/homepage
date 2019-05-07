import React from "react";
import { ChipsInput } from "./ChipsInput";
import { Modal } from "./Modal";
import { QuickLink } from "../lib/api";

interface State {
    newQuickLink: QuickLink;
    loading: boolean;
}

interface Props {
    currentQuickLink?: QuickLink;
    toggleModal: (v: boolean) => void;
    isOpen: boolean;
    handleSubmit: (ql: QuickLink) => Promise<void>;
}

const childSeparator = "~~";

const blankQuickLink: QuickLink = {
    name: "",
    url: "",
    children: []
};

export class NewQuickLinkForm extends React.Component<Props, State> {
    public state = {
        loading: false,
        newQuickLink: this.props.currentQuickLink ? this.props.currentQuickLink : blankQuickLink
    };

    private handleInputChange = (
        evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newBm = {
            ...this.state.newQuickLink,
            [evt.currentTarget.id]: evt.currentTarget.value
        };
        this.setState({
            newQuickLink: newBm
        });
    };

    private handleSubmit = async (): Promise<void> => {
        const { newQuickLink } = this.state;
        this.setState({ loading: true });
        this.props.handleSubmit(newQuickLink);
        this.setState({ loading: false });
        this.props.toggleModal(false);
    };

    private handleSetChips = (children: string[]) => {
        this.setState({
            newQuickLink: {
                ...this.state.newQuickLink,
                children
            }
        });
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
        let chipsArray: string[] = [];
        if (this.state.newQuickLink.children) {
            chipsArray = this.state.newQuickLink.children;
        }
        return (
            <Modal
                footer={footer}
                handleClose={() => this.props.toggleModal(false)}
                title={"New Quick Link"}
            >
                <div className="form">
                    <pre>{JSON.stringify(this.state.newQuickLink)}</pre>
                    <div className="field">
                        <label className="label">URL</label>
                        <div className="control">
                            <input
                                value={this.state.newQuickLink.url}
                                onChange={this.handleInputChange}
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
                                value={this.state.newQuickLink.name}
                                onChange={this.handleInputChange}
                                id="name"
                                className="input"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Children</label>
                        <ChipsInput chips={chipsArray} onChange={this.handleSetChips} />
                    </div>
                    <p>
            Input chips as <i>{`"name${childSeparator}url"`}</i>. Press enter to save chip
                    </p>
                </div>
            </Modal>
        );
    }
}
