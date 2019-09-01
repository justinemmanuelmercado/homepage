import React from "react";
import { FaPlus, FaTrash, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { QuickLink } from "./QuickLink";
import { NewQuickLinkForm } from "./NewQuickLinkForm";
import {
    getQuickLinks,
    QuickLink as QuickLinkInterface,
    putLink,
    deleteQuickLink
} from "../lib/api";

interface Props { }
interface State {
    quickLinks: QuickLinkInterface[];
    modalOpen: boolean;
    deleteMode: boolean;
    currentPage: number;
    items: number;
}

const MAX_ITEMS = 10;
export class QuickLinks extends React.Component<Props, State> {
    public state = {
        quickLinks: [],
        modalOpen: false,
        deleteMode: false,
        items: MAX_ITEMS,
        currentPage: 0
    };

    public async componentDidMount(): Promise<void> {
        await this.loadQuickLinks();
    }

    public render(): React.ReactElement {
        let { quickLinks, currentPage, items } = this.state;
        const start = currentPage * items;
        const end = start + items;
        const length = quickLinks.length;
        const maxPage = Math.ceil(length / items) - 1
        const filteredQuickLinks = quickLinks.slice(start, end);

        const goToPage = (page: number): void => {
            if (page < 0 || page > maxPage) return;
            {
                this.setState({
                    currentPage: page
                });
            }
        }

        return (
            <nav className="navbar is-inline-flex is-fullwidth" style={{
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div className="is-inline-flex">
                    <div className="is-flex" style={{
                        flexDirection: "column"
                    }}>
                        <div className="navbar-item">
                            <button className={`button is-small ${this.state.deleteMode ? 'is-active is-dark' : ''}`} onClick={() => this.toggleDeleteMode()}>
                                <FaTrash />
                            </button>
                        </div>
                        <div className="navbar-item">
                            <button className="button is-small" onClick={() => this.toggleModal(true)}>
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                    {maxPage > 0 && <div className="is-flex" style={{
                        flexDirection: "column"
                    }}>
                        <div className="navbar-item">
                            <button className="button is-small" disabled={currentPage === 0} onClick={() => goToPage(currentPage - 1)}>
                                <FaAngleUp />
                            </button>
                        </div>
                        <div className="navbar-item">
                            <button className="button is-small" disabled={currentPage === maxPage} onClick={() => goToPage(currentPage + 1)}>
                                <FaAngleDown />
                            </button>
                        </div>

                    </div>}
                </div>
                <div className="is-inline-flex">
                    {filteredQuickLinks.map((ql: QuickLinkInterface) => {
                        return <QuickLink key={ql.url} link={ql} deleteMode={this.state.deleteMode} deleteQuickLink={this.deleteQuickLink} />;
                    })}
                </div>
                <NewQuickLinkForm
                    isOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                    handleSubmit={this.handleSubmit}
                />
            </nav>
        );
    }

    private deleteQuickLink = async (ql: QuickLinkInterface) => {
        await deleteQuickLink([ql]);
        await this.loadQuickLinks();
    }

    private toggleDeleteMode = () => {
        this.setState({
            deleteMode: !this.state.deleteMode
        })
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
