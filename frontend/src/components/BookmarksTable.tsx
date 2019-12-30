import React, { FormEvent } from "react";
import { FaTrash, FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import { DeleteConfirm } from "../components/DeleteConfirm";
import { Bookmark, deleteBookmarks, getTags, BookmarkTag } from "../lib/api";
import { BookmarkRow } from "./BookmarkRow";
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
    query: string;
    tag: string;
    tags: BookmarkTag[];
}

export class BookmarksTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: 0,
            toDelete: [],
            deleteConfirm: false,
            tags: [],
            tag: "",
            query: ""
        };
    }

    public async componentDidMount() {
        const tags = await getTags();
        this.setState({
            tags
        });
    }

    private renderMaxPage(length: number): number {
        return Math.ceil(length / this.props.items);
    }

    private renderTags = (): React.ReactNode => {
        const { tags, tag } = this.state;
        if (tags.length > 0) {
            return (
                <div className="select is-fullwidth">
                    <select
                        value={tag}
                        onChange={(evt: FormEvent<HTMLSelectElement>) =>
                            this.handleChangeTag(evt.currentTarget.value)
                        }
                    >
                        <option value="">All tags</option>
                        {tags.map((tag: BookmarkTag) => {
                            return (
                                <option value={tag.tag} key={tag.tag}>
                                    {tag.tag}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );
        } else {
            return (
                <div className="select">
                    <select></select>
                </div>
            );
        }
    };

    private getFilteredRows = (): Bookmark[] => {
        const { query, tag } = this.state;
        let { bookmarks } = this.props;

        if ((query || tag) && bookmarks.length > 0) {
            bookmarks = bookmarks.filter((bookmark: Bookmark) => {
                let matchQuery = false;
                let matchTag = false;
                for (const key in bookmark as Bookmark) {
                    if (typeof bookmark[key] !== "string") continue;
                    const bookmarkAttr = (bookmark[key] as string).toLowerCase();
                    if (bookmarkAttr.indexOf(query.toLowerCase()) !== -1) {
                        matchQuery = true;
                        break;
                    }
                }

                matchTag = Boolean(
                    bookmark.tags &&
                    bookmark.tags.some(bmTag => {
                        return bmTag.tag.toLowerCase() === tag.toLowerCase();
                    })
                );

                return (matchQuery || !query) && (matchTag || !tag);
            });
        }
        return bookmarks;
    };

    private renderBookmarkRows(
        rows: Bookmark[]
    ): React.ReactElement[] | React.ReactElement {
        if (rows.length === 0) {
            return <div className="notification is-info">Unable to load links</div>;
        }

        const start = this.state.currentPage * this.props.items;
        const end = start + this.props.items;
        rows = rows.slice(start, end);

        return rows.map((bm: Bookmark) => {
            return (
                <BookmarkRow
                    bm={bm}
                    onFinish={this.props.loadBookmarks}
                    key={bm.id}
                    check={this.check}
                    checked={this.isChecked(bm.id)}
                    setTag={this.handleChangeTag}
                />
            );
        });
    }

    private handleEdit = (bookmark: Bookmark) => {
        const bm = {
            name: bookmark.name,
            url: bookmark.url,
            note: bookmark.note,
            tags: bookmark.tags
        };
        this.props.toggleModal(true, bm);
    };

    private renderPageNumbers(bookmarksLength: number): React.ReactElement {
        if (!this.renderMaxPage(bookmarksLength)) return <></>;
        const goToPage = (page: number): void => {
            if (page < 0 || page >= this.renderMaxPage(bookmarksLength)) return;
            this.setState({
                currentPage: page
            });
        };

        return (
            <nav className="pagination is-small is-right">
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
                <span
                    className="pagination-previous"
                    onClick={() => goToPage(this.state.currentPage - 1)}
                >
                    <FaAngleLeft />
                </span>
                <span
                    className="pagination-next"
                    onClick={() => goToPage(this.state.currentPage + 1)}
                >
                    <FaAngleRight />
                </span>
                <ul className="pagination-list">
                    {Array.from(Array(this.renderMaxPage(bookmarksLength)).keys()).map(
                        num => {
                            if (num === this.state.currentPage) {
                                return (
                                    <li key={num}>
                                        <span className="pagination-link is-current" key={num}>
                                            {num + 1}
                                        </span>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={num}>
                                        <span
                                            key={num}
                                            onClick={() => goToPage(num)}
                                            className="pagination-link"
                                        >
                                            {num + 1}
                                        </span>
                                    </li>
                                );
                            }
                        }
                    )}
                </ul>
            </nav>
        );
    }

    private isChecked = (id?: string): boolean => {
        if (!id) return false;
        return this.state.toDelete.includes(id);
    };

    private check = (id?: string): void => {
        if (!id) return;
        const { toDelete } = this.state;
        const ind = toDelete.indexOf(id);
        if (ind < 0) {
            toDelete.push(id);
        } else {
            toDelete.splice(ind, 1);
        }

        this.setState({ toDelete });
    };

    private toggleDeleteConfirm(val: boolean): void {
        this.setState({ deleteConfirm: val });
    }

    private handleDelete = async (): Promise<void> => {
        this.toggleDeleteConfirm(false);

        await deleteBookmarks(this.state.toDelete, 1);
        await this.props.loadBookmarks();
    };

    private renderFilters(): React.ReactNode {
        return (
            <div className="columns">
                <div className="column">
                    <div className="field">
                        <div className="control has-icons-left">
                            <input
                                onChange={this.handleChangeQuery}
                                placeholder="Search..."
                                type="text"
                                value={this.state.query}
                                className="input"
                            />
                            <span className="icon is-small is-left">
                                <FaSearch />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="column columns">
                    <div className="column">{this.renderTags()}</div>
                    <div className="column">
                        <button
                            className="button is-fullwidth"
                            onClick={() => this.props.toggleModal(true)}
                        >
                            Add Bookmark
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    private handleChangeQuery = (
        evt: React.SyntheticEvent<HTMLInputElement>
    ): void => {
        this.setState({
            currentPage: 0,
            query: evt.currentTarget.value
        });
    };

    private handleChangeTag = (tag: string) => {
        this.setState({
            currentPage: 0,
            tag
        });
    };

    public render(): React.ReactElement {
        const rows = this.getFilteredRows();
        return (
            <div className="container">
                <DeleteConfirm
                    isOpen={this.state.deleteConfirm}
                    onCancel={() => this.toggleDeleteConfirm(false)}
                    onConfirm={this.handleDelete}
                />
                <div className="column">
                    {this.renderFilters()}
                    {this.renderPageNumbers(rows.length)}
                    {this.renderBookmarkRows(rows)}
                </div>
            </div>
        );
    }
}
