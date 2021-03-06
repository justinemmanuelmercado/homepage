import React, { useState } from "react";
import { Bookmark, NewBookmark, putLinkEdit } from "../lib/api";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { NewBookmarkForm } from "./NewBookmarkForm";
import { truncateText } from "../lib/string";
import { redirect } from "../lib/links";

interface BookmarkRowProps {
  bm: Bookmark;
  check: (id: string | undefined) => void;
  checked: boolean;
  key?: string;
  onFinish: () => Promise<void>;
  setTag: (tag: string) => void;
}

export const BookmarkRow = (props: BookmarkRowProps): React.ReactElement => {
  const { bm, setTag } = props;
  const [modalOpened, setModalOpened] = useState(false);
  let editableBookmark: NewBookmark | Bookmark;
  if (bm.tags) {
    editableBookmark = {
      ...bm,
      tags: bm.tags.map((tag): string => tag.tag)
    };
  } else {
    editableBookmark = bm;
  }

  const submit = async (newBookmark: NewBookmark): Promise<void> => {
    await putLinkEdit(newBookmark, 1);
    await props.onFinish();
  };

  return (
    <div
      key={bm.id}
      style={{
        marginTop: "1em"
      }}
      className="card mt-3"
    >
      {modalOpened && (
        <NewBookmarkForm
          currentBookmark={editableBookmark as NewBookmark}
          isOpen={modalOpened}
          toggleModal={setModalOpened}
          handleSubmit={submit}
        />
      )}
      <header className="is-flex">
        <div
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center"
          }}
          className="is-flex"
        >
          <div
            style={{
              justifyContent: "flex-start",
              alignItems: "center"
            }}
            className="is-flex"
          >
            {bm.tags &&
              bm.tags.map(
                (tag, ind): React.ReactElement => {
                  return (
                    <small
                      style={{
                        cursor: "pointer"
                      }}
                      className="bookmark-tag"
                      key={ind}
                      id={ind.toString()}
                      onClick={(): void => setTag(tag.tag)}
                    >
                      {tag.tag}{" "}
                    </small>
                  );
                }
              )}
          </div>
          <div
            style={{
              justifyContent: "flex-end",
              alignItems: "center"
            }}
            className="is-flex"
          >
            <div>
              <button
                onClick={(): void => props.check(bm.id)}
                className={`button is-small ${
                  props.checked ? "is-active is-dark" : ""
                }`}
              >
                <FaTrash />
              </button>
              <button
                onClick={(): void => redirect(bm.url)}
                className="is-small button"
              >
                Open
              </button>
              <button
                onClick={(): void => redirect(bm.url, true)}
                className="is-small button"
              >
                <FaPlus /> Tab
              </button>
              <button
                onClick={(): void => setModalOpened(true)}
                className="is-small button"
              >
                <FaEdit />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="card-content">
        <div className="media is-marginless">
          <div className="media-left">
            <div className="media-left">
              <figure className="is-marginless image is-64x64">
                <img
                  src={
                    bm.thumbnail
                      ? bm.thumbnail
                      : "https://via.placeholder.com/150"
                  }
                  alt="Link thumbnail"
                />
              </figure>
            </div>
          </div>
          <div className="media-content">
            <div className="content">
              <p>
                <strong>{bm.name}</strong>
                <small style={{ marginLeft: "1rem" }}>
                  <a href={bm.url}>{truncateText(bm.url, 50)}</a>
                </small>
                <br />
                {bm.note}
              </p>
            </div>
          </div>
          <div className="media-right">
            <time>
              {bm.dateCreated && new Date(bm.dateCreated).toDateString()}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};
