import React from "react";
import { FaPlus } from "react-icons/fa";
import { QuickLink } from "./QuickLink";
import { NewQuickLinkForm } from "./NewQuickLinkForm";
import { getQuickLinks, QuickLink as QuickLinkInterface } from "../lib/api";

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
        const ql = await getQuickLinks();
        this.setState({
            quickLinks: ql
        });
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
                            <FaPlus />
                        </button>
                    </div>
                </div>
                <NewQuickLinkForm
                    isOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                />
            </nav>
        );
    }

    private toggleModal = (val: boolean) => {
        this.setState({
            modalOpen: val
        });
    };
}
