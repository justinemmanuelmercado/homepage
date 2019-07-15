import React from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { DeleteConfirm } from "../components/DeleteConfirm";
import { Bookmark, deleteBookmarks } from "../lib/api";
interface Props {
    toggleModal: (val: boolean, bookmark?: Bookmark) => void;
    items: number;
    loadBookmarks: () => Promise<void>;
    bookmarks: Bookmark[];
}

interface State {
    currentPage: number;
    toDelete: string[];
    deleteConfirm: boolean;
}

const columnsCount = 5;

export class BookmarksTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: 0,
            toDelete: [],
            deleteConfirm: false
        };
    }

    private renderMaxPage(): number {
        return Math.ceil(this.props.bookmarks.length / this.props.items);
    }

    private renderBookmarkRows(): React.ReactElement[] | React.ReactElement {
        if (this.props.bookmarks.length === 0) {
            return (
                <tr>
                    <td colSpan={columnsCount}>Unable to load links</td>
                </tr>
            );
        }

        const start = this.state.currentPage * this.props.items;
        const end = start + this.props.items;
        let rows = this.props.bookmarks.slice(start, end);

        return rows.map((bm: Bookmark, i: number) => {
            return (
                <tr key={i}>
                    <td
                        style={{
                            padding: "0",
                            margin: "auto",
                            textAlign: "center",
                            verticalAlign: "middle"
                        }}
                    >
                        <input
                            onChange={() => this.check(bm.id)}
                            checked={this.isChecked(bm.id)}
                            type="checkbox"
                        />
                    </td>
                    <td>{bm.dateCreated && new Date(bm.dateCreated).toDateString()}</td>
                    <td>
                        <a href={bm.url}>{bm.name}</a>
                    </td>
                    <td>{bm.note}</td>
                    <td>
                        <div className="field is-grouped">
                            <button
                                onClick={() => this.redirect(bm.url)}
                                className="is-small button"
                            >
                                Open
                            </button>
                            <button
                                onClick={() => this.redirect(bm.url, true)}
                                className="is-small button"
                            >
                                <FaPlus /> Tab
                            </button>
                            <button onClick={() => this.handleEdit(bm)} className="is-small button">
                                <FaEdit />
                            </button>
                            <span>
                                {bm.tags && bm.tags.map((tag, ind) => {
                                    return (<span id={ind.toString()}>{tag.tag}</span>)
                                })}
                            </span>
                        </div>

                    </td>
                    <td>

                    </td>
                </tr>
            );
        });
    }

    private handleEdit = (bookmark: Bookmark) => {
        const bm = {
            name: bookmark.name,
            url: bookmark.url,
            note: bookmark.note,
            tags: bookmark.tags
        }
        this.props.toggleModal(true, bm);
    }

    private renderPageNumbers(): React.ReactElement[] {
        return Array.from(Array(this.renderMaxPage()).keys()).map(num => {
            if (num === this.state.currentPage) {
                return (
                    <b key={num} className="column">
                        {num + 1}
                    </b>
                );
            } else {
                return (
                    <a key={num} onClick={() => this.goToPage(num)} className="column">
                        {num + 1}
                    </a>
                );
            }
        });
    }

    private goToPage(page: number): void {
        if (page < 0 || page >= this.renderMaxPage()) return;

        this.setState({
            currentPage: page
        });
    }

    private redirect(url: string, tab?: boolean): void {
        if (tab) {
            window.open(url, "_blank");
            return;
        }

        window.open(url, "_self");
    }

    private isChecked(id?: string): boolean {
        if (!id) return false;
        return this.state.toDelete.includes(id);
    }

    private check(id?: string): void {
        if (!id) return;
        const { toDelete } = this.state;
        const ind = toDelete.indexOf(id);
        if (ind < 0) {
            toDelete.push(id);
        } else {
            toDelete.splice(ind, 1);
        }

        this.setState({ toDelete });
    }

    private toggleDeleteConfirm(val: boolean): void {
        this.setState({ deleteConfirm: val });
    }

    private handleDelete = async (): Promise<void> => {
        this.toggleDeleteConfirm(false);

        await deleteBookmarks(this.state.toDelete, 1);
        await this.props.loadBookmarks();
    };

    public render(): React.ReactElement {
        return (
            <table className="table is-fullwidth is-narrow is-striped">
                <DeleteConfirm
                    isOpen={this.state.deleteConfirm}
                    onCancel={() => this.toggleDeleteConfirm(false)}
                    onConfirm={this.handleDelete}
                />
                <thead>
                    <tr>
                        <td colSpan={columnsCount}>
                            <div
                                className="is-flex"
                                style={{
                                    justifyContent: "space-between"
                                }}
                            >
                                <span>
                                    <button
                                        className="button"
                                        onClick={() => this.props.toggleModal(true)}
                                    >
                                        Add Bookmark
                                    </button>
                                </span>
                                <span className="columns">
                                    <a
                                        className="column"
                                        onClick={() => this.goToPage(this.state.currentPage - 1)}
                                    >
                                        {" "}
                                        {"<<"}{" "}
                                    </a>
                                    {this.renderPageNumbers()}
                                    <a
                                        className="column"
                                        onClick={() => this.goToPage(this.state.currentPage + 1)}
                                    >
                                        {" "}
                                        {">>"}{" "}
                                    </a>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th
                            style={{
                                padding: 0,
                                width: 0
                            }}
                        >
                            <button
                                disabled={this.state.toDelete.length <= 0}
                                onClick={() => this.toggleDeleteConfirm(true)}
                                style={{
                                    borderColor: "transparent"
                                }}
                                className="button"
                            >
                                <FaTrash />
                            </button>
                        </th>
                        <th />
                        <th />
                        <th />
                        <th />
                        <th />
                    </tr>
                </thead>
                <tbody>{this.renderBookmarkRows()}</tbody>
            </table>
        );
    }
}
