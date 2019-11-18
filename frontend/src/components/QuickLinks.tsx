import React from "react";
import { FaPlus, FaTrash, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { QuickLink } from "./QuickLink";
import { NewQuickLinkForm } from "./NewQuickLinkForm";
import {
    getQuickLinks,
    QuickLink as QuickLinkInterface,
    putLink,
    deleteQuickLink
} from "../lib/api";

interface Props {}
interface State {
    quickLinks: QuickLinkInterface[];
    modalOpen: boolean;
    deleteMode: boolean;
    currentPage: number;
    items: number;
}

const MAX_ITEMS = 8;
export class QuickLinks extends React.Component<Props, State> {
    public state = {
        quickLinks: [],
        modalOpen: false,
        deleteMode: false,
        items: MAX_ITEMS,
        currentPage: 0
    };

    private renderMaxPage(length: number): number {
        return Math.ceil(length / this.state.items);
    }

    public async componentDidMount(): Promise<void> {
        if (window && window.innerWidth < 769) {
            this.setState({
                items: MAX_ITEMS / 2
            });
        }
        await this.loadQuickLinks();
    }

    public render(): React.ReactElement {
        let { quickLinks, currentPage, items } = this.state;
        const start = currentPage * items;
        const end = start + items;
        const length = quickLinks.length;
        const maxPage = Math.ceil(length / items) - 1;
        const filteredQuickLinks = quickLinks.slice(start, end);

        const goToPage = (page: number): void => {
            if (page < 0 || page > maxPage) return;
            {
                this.setState({
                    currentPage: page
                });
            }
        };

        return (
            <div className="container">
                <div className="section">
                    <div style={{ maxWidth: 1024 }}>
                        <div className="column">
                            <div>
                                <button
                                    className={`button is-small ${
                                        this.state.deleteMode ? "is-active is-dark" : ""
                                    }`}
                                    onClick={(): void => this.toggleDeleteMode()}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div>
                                <button
                                    className="button is-small"
                                    onClick={(): void => this.toggleModal(true)}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                        <div className="column is-fullwidth columns">
                            <div className="pagination-button" style={{ display: "flex" }}>
                                <a
                                    className="pagination-previous"
                                    onClick={(): void => goToPage(this.state.currentPage - 1)}
                                >
                                    <FaAngleLeft />
                                </a>
                            </div>
                            <div className="columns column  is-fullwidth is-multiline is-mobile">
                                {filteredQuickLinks.map(
                                    (ql: QuickLinkInterface): React.ReactElement => {
                                        return (
                                            <div
                                                key={ql.url}
                                                className="column is-half-mobile is-one-quarter-tablet is-one-quarter-desktop is-one-quarter-widescreen is-one-quarter-fullhd"
                                            >
                                                <QuickLink
                                                    link={ql}
                                                    deleteMode={this.state.deleteMode}
                                                    deleteQuickLink={this.deleteQuickLink}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <div className="pagination-button" style={{ display: "flex" }}>
                                <a
                                    className="pagination-next"
                                    onClick={(): void => goToPage(this.state.currentPage + 1)}
                                >
                                    <FaAngleRight />
                                </a>
                            </div>
                        </div>
                        <NewQuickLinkForm
                            isOpen={this.state.modalOpen}
                            toggleModal={this.toggleModal}
                            handleSubmit={this.handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private deleteQuickLink = async (ql: QuickLinkInterface): Promise<void> => {
        await deleteQuickLink([ql]);
        await this.loadQuickLinks();
    };

    private toggleDeleteMode = (): void => {
        this.setState({
            deleteMode: !this.state.deleteMode
        });
    };

    private handleSubmit = async (ql: QuickLinkInterface): Promise<void> => {
        await putLink(ql, 2);
        await this.loadQuickLinks();
    };

    private toggleModal = (val: boolean): void => {
        this.setState({
            modalOpen: val
        });
    };

    private loadQuickLinks = async (): Promise<void> => {
        const ql = await getQuickLinks();
        this.setState({
            quickLinks: ql
        });
    };
}
