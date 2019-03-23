import React from "react";

interface Bookmark {
    title: string;
    url: string;
    image: string;
}

interface Props {
    items: number;
    bookmarks: Bookmark[];
}

interface State {
    currentPage: number;
}

export class BookmarksTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: 0
        };
    }

    private renderMaxPage(): number {
        return Math.ceil(this.props.bookmarks.length / this.props.items);
    }

    private renderBookmarkRows(): React.ReactElement[] {
        console.log(this.props.bookmarks.length);
        const start = this.state.currentPage * this.props.items;
        const end = start + this.props.items;
        let rows = this.props.bookmarks.slice(start, end);

        return rows.map((bm: Bookmark, i: number) => {
            return (
                <tr key={i}>
                    <td>
                        <b>{bm.title}</b>
                    </td>
                    <td>{bm.url}</td>
                    <td>{bm.image}</td>
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
    public render(): React.ReactElement {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>URL</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>{this.renderBookmarkRows()}</tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>
                            <div
                                className="is-flex"
                                style={{
                                    justifyContent: "space-between"
                                }}
                            >
                                <span>
                  Showing page {this.state.currentPage + 1} out of{" "}
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
                </tfoot>
            </table>
        );
    }
}
