import React from "react";
import { Bookmark } from "../lib/api";
import { FaTrash, FaPlus } from "react-icons/fa";
interface Props {
    items: number;
    bookmarks: Bookmark[];
}

interface State {
    currentPage: number;
    toDelete: string[];
}

export class BookmarksTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: 0,
            toDelete: []
        };
    }

    private renderMaxPage(): number {
        return Math.ceil(this.props.bookmarks.length / this.props.items);
    }

    private renderBookmarkRows(): React.ReactElement[] {
        const start = this.state.currentPage * this.props.items;
        const end = start + this.props.items;
        let rows = this.props.bookmarks.slice(start, end);

        return rows.map((bm: Bookmark, i: number) => {
            return (
                <tr style={{ cursor: "pointer" }} key={i}>
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
                    <td>
                        <b>{bm.title}</b>
                    </td>
                    <td>{bm.url}</td>
                    <td>{bm.image}</td>
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
                        </div>
                    </td>
                </tr>
            );
        });
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
        console.log(page);
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

    private isChecked(id: string): boolean {
        return this.state.toDelete.includes(id);
    }

    private check(id: string): void {
        const { toDelete } = this.state;
        const ind = toDelete.indexOf(id);
        if (ind < 0) {
            toDelete.push(id);
        } else {
            toDelete.splice(ind, 1);
        }

        this.setState({ toDelete });
    }

    public render(): React.ReactElement {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <td colSpan={5}>
                            <div
                                className="is-flex"
                                style={{
                                    justifyContent: "space-between"
                                }}
                            >
                                <span>
                  Showing page {this.state.currentPage + 1} of{" "}
                                    {this.renderMaxPage()}
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
                            <button className="button is-danger">
                                <FaTrash />
                            </button>
                        </th>
                        <th>Title</th>
                        <th>URL</th>
                        <th>Image</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{this.renderBookmarkRows()}</tbody>
            </table>
        );
    }
}
