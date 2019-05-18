import React from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { QuickLink } from "./QuickLink";
import { NewQuickLinkForm } from "./NewQuickLinkForm";
import {
    getQuickLinks,
    QuickLink as QuickLinkInterface,
    putLink
} from "../lib/api";

interface Props {}
interface State {
    quickLinks: QuickLinkInterface[];
    modalOpen: boolean;
}

export class QuickLinks extends React.Component<Props, State> {
    public state = {
        quickLinks: [],
        modalOpen: false
    };

    public async componentDidMount(): Promise<void> {
        await this.loadQuickLinks();
    }

    public render(): React.ReactElement {
        return (
            <nav className="navbar">
                <div className="navbar-menu">
                    {this.state.quickLinks.map((ql: QuickLinkInterface) => {
                        return <QuickLink key={ql.url} link={ql} />;
                    })}
                </div>
                <div className="navbar-end">
                <div className="navbar-item">
                        <button className="button" onClick={() => this.toggleModal(true)}>
                            <FaEdit />
                        </button>
                    </div>
                    <div className="navbar-item">
                        <button className="button" onClick={() => this.toggleModal(true)}>
                            <FaPlus />
                        </button>
                    </div>
                </div>
                <NewQuickLinkForm
                    isOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                    handleSubmit={this.handleSubmit}
                />
            </nav>
        );
    }

    private handleSubmit = async (ql: QuickLinkInterface) => {
        await putLink(ql, 2);
        await this.loadQuickLinks();
    };

    private toggleModal = (val: boolean) => {
        this.setState({
            modalOpen: val
        });
    };

    private loadQuickLinks = async () => {
        const ql = await getQuickLinks();
        this.setState({
            quickLinks: ql
        });
    };
}