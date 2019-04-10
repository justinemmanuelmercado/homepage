import React from "react";
import { ChipsInput } from "./ChipsInput";
import { Modal } from "./Modal";
import { putLink, QuickLink } from "../lib/api";

interface State {
    newQuickLink: QuickLink;
    loading: boolean;
}

interface Props {
    toggleModal: (v: boolean) => void;
    isOpen: boolean;
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
        newQuickLink: blankQuickLink
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
        await putLink(newQuickLink, 2);
        this.setState({ loading: false });
        this.props.toggleModal(false);
    };

    private handleSetChips = (children: string[]) => {
        const childrenConverted = children.map((child: string) => {
            const childObj = child.split(childSeparator);
            return {
                url: childObj[0],
                name: childObj[1]
            };
        });
        this.setState({
            newQuickLink: {
                ...this.state.newQuickLink,
                children: childrenConverted
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
            chipsArray = this.state.newQuickLink.children.map(child => {
                return `${child.url}~~${child.name}`;
            });
        }
        return (
            <Modal
                footer={footer}
                handleClose={() => this.props.toggleModal(false)}
                title={"New Quick Link"}
            >
                <div className="form">
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
                                id="title"
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
            Input chips as <i>{`"url${childSeparator}name"`}</i>
                    </p>
                </div>
            </Modal>
        );
    }
}
