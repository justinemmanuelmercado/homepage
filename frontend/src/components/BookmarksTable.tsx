import React, { FormEvent } from "react";
import { FaTrash, FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import { DeleteConfirm } from "../components/DeleteConfirm";
import { Bookmark, deleteBookmarks, getTags, BookmarkTag } from "../lib/api";
import { BookmarkRow } from "./BookmarkRow";
import { GlobalHotKeys } from "react-hotkeys";
import { redirect } from "../lib/links";
import { generalMovement, OPEN_LINK_SHORTCUT_KEYS } from "../lib/shortcut";
interface Props {
  toggleModal: (val: boolean, bookmark?: Bookmark) => void;
  items: number;
  loadBookmarks: () => Promise<void>;
  bookmarks: Bookmark[];
  selected: boolean;
}
interface State {
  paginatedFilteredBookmarks: Bookmark[];
  filteredBookmarks: Bookmark[];
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
      query: "",
      filteredBookmarks: [],
      paginatedFilteredBookmarks: []
    };
  }

  public componentDidUpdate(prevProps: Props) {
    // Typical usage (don't forget to compare props):
    if (this.props.bookmarks.length !== prevProps.bookmarks.length) {
      this.loadFilteredBookmarks();
    }
  }

  public async componentDidMount() {
    const tags = await getTags();
    this.setState(
      {
        tags
      },
      this.loadFilteredBookmarks
    );
  }

  private renderMaxPage(): number {
    const length = this.state.filteredBookmarks.length;
    return Math.ceil(length / this.props.items);
  }

  private loadEverything = async () => {
    await this.props.loadBookmarks();
    await this.loadFilteredBookmarks();
  };

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

    return rows.map((bm: Bookmark) => {
      return (
        <BookmarkRow
          bm={bm}
          onFinish={this.loadEverything}
          key={bm.id}
          check={this.check}
          checked={this.isChecked(bm.id)}
          setTag={this.handleChangeTag}
        />
      );
    });
  }

  private goToPage = (page: number): void => {
    if (page < 0 || page >= this.renderMaxPage()) return;
    this.setState(
      {
        currentPage: page
      },
      this.loadFilteredBookmarks
    );
  };

  private renderPageNumbers(bookmarksLength: number): React.ReactElement {
    if (!this.renderMaxPage()) return <></>;
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
          className="pagination-prev_BMious"
          onClick={() => this.goToPage(this.state.currentPage - 1)}
        >
          <FaAngleLeft />
        </span>
        <span
          className="pagination-next_BM"
          onClick={() => this.goToPage(this.state.currentPage + 1)}
        >
          <FaAngleRight />
        </span>
        <ul className="pagination-list">
          {Array.from(Array(this.renderMaxPage()).keys()).map(num => {
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
                    onClick={() => this.goToPage(num)}
                    className="pagination-link"
                  >
                    {num + 1}
                  </span>
                </li>
              );
            }
          })}
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
    this.loadFilteredBookmarks();
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
    this.setState(
      {
        currentPage: 0,
        query: evt.currentTarget.value
      },
      this.loadFilteredBookmarks
    );
  };

  private handleChangeTag = (tag: string) => {
    this.setState(
      {
        currentPage: 0,
        tag
      },
      this.loadFilteredBookmarks
    );
  };

  private loadFilteredBookmarks() {
    const filteredBookmarks = this.getFilteredRows();
    const start = this.state.currentPage * this.props.items;
    const end = start + this.props.items;
    const paginatedFilteredBookmarks = filteredBookmarks.slice(start, end);
    this.setState({
      filteredBookmarks,
      paginatedFilteredBookmarks
    });
  }

  private keyMap = {
    ...generalMovement
  };

  private handlers = {
    NEXT: (): void => {
      this.goToPage(this.state.currentPage + 1);
    },
    PREV: (): void => {
      this.goToPage(this.state.currentPage - 1);
    },
    OPEN_PAGE: (evt?: KeyboardEvent) => {
      if (evt) {
        const withShift = evt.shiftKey;
        const keyPressed = evt.code;
        let ind = 0;
        OPEN_LINK_SHORTCUT_KEYS.some((v, i) => {
          const keyCode = v.code;
          if (keyCode === keyPressed) {
            ind = i;
          }
          return keyCode === keyPressed;
        });

        const { url } = this.state.paginatedFilteredBookmarks[ind];
        redirect(url, withShift);
      }
    }
  };

  public render(): React.ReactElement {
    const rows = this.state.paginatedFilteredBookmarks;

    return (
      <div className="container">
        {this.props.selected && (
          <GlobalHotKeys keyMap={this.keyMap} handlers={this.handlers} />
        )}
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
