import React from "react";
import { NewBookmark, getMetaData } from "../lib/api";
import { Modal } from "./Modal";
import { ChipsInput } from "./ChipsInput";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import validator from "validator";

interface State {
  newBookmark: NewBookmark;
  loading: boolean;
}

interface Props {
  currentBookmark?: NewBookmark;
  handleSubmit: (newBookmark: NewBookmark) => Promise<void>;
  toggleModal: (v: boolean) => void;
  isOpen: boolean;
}

const blankBookmark: NewBookmark = {
  name: "",
  url: "",
  note: "",
  thumbnail: "",
  tags: []
};

export class NewBookmarkForm extends React.Component<Props, State> {
  public state = {
    loading: false,
    newBookmark: this.props.currentBookmark
      ? this.props.currentBookmark
      : blankBookmark
  };

  private handleInputChange = (
    evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newBm = {
      ...this.state.newBookmark,
      [evt.currentTarget.id]: evt.currentTarget.value
    };
    this.setState({
      newBookmark: newBm
    });
  };

  private debounced = AwesomeDebouncePromise(getMetaData, 1000);

  private handleUrlChange = async (
    evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const url = evt.currentTarget.value;
    this.setState({
      newBookmark: {
        ...this.state.newBookmark,
        url
      }
    });

    if (validator.isURL(url)) {
      try {
        this.setState({
          loading: true
        });
        evt.persist();
        const { data } = await this.debounced(url);
        this.setState(currentState => {
          const { newBookmark } = currentState;
          newBookmark.thumbnail = data.thumbnail ? data.thumbnail : "";
          newBookmark.note =
            data.description && newBookmark.note.length < 2
              ? data.description
              : "";
          newBookmark.name =
            data.title && newBookmark.name.length < 2 ? data.title : "";
          newBookmark.thumbnail = data.image ? data.image : "";
          return {
            newBookmark,
            loading: false
          };
        });
      } catch (e) {
        console.error("Something went wrong");
        console.error(e);
      }
    }
  };

  private handleSetChips = (tags: string[]): void => {
    this.setState({
      newBookmark: {
        ...this.state.newBookmark,
        tags
      }
    });
  };

  private handleSubmit = async (): Promise<void> => {
    const { newBookmark } = this.state;
    this.setState({ loading: true });
    this.props.handleSubmit(newBookmark);
    this.setState({ loading: false });
    this.props.toggleModal(false);
  };

  public render(): React.ReactElement {
    const { loading, newBookmark } = this.state;
    if (!this.props.isOpen) return <></>;
    const footer = (
      <div>
        <button onClick={this.handleSubmit} className={`button`}>
          Save
        </button>
        <button
          onClick={(): void => this.props.toggleModal(false)}
          className={`button`}
        >
          Cancel
        </button>
      </div>
    );
    return (
      <Modal
        footer={footer}
        handleClose={(): void => this.props.toggleModal(false)}
        title={"Bookmark"}
      >
        <div className="form">
          <div className="columns">
            <div className="column">
              <figure className="is-marginless image is-128x128">
                <img
                  src={
                    newBookmark.thumbnail
                      ? newBookmark.thumbnail
                      : "https://via.placeholder.com/150"
                  }
                  alt="Link thumbnail"
                />
              </figure>
              <div className="field">
                <div className={`control ${loading ? "is-loading" : ""}`}>
                  <input
                    disabled={true}
                    value={newBookmark.thumbnail}
                    onChange={this.handleInputChange}
                    id="thumbnail"
                    className="input"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">URL</label>
                <div className={`control`}>
                  <input
                    value={newBookmark.url}
                    onChange={this.handleUrlChange}
                    id="url"
                    className="input"
                    type="website"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Name</label>
                <div className={`control ${loading ? "is-loading" : ""}`}>
                  <input
                    value={newBookmark.name}
                    onChange={this.handleInputChange}
                    id="name"
                    className="input"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Note</label>
            <div className={`control ${loading ? "is-loading" : ""}`}>
              <textarea
                value={newBookmark.note}
                onChange={this.handleInputChange}
                id="note"
                className="textarea"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Tags</label>
            <ChipsInput
              chips={newBookmark.tags}
              onChange={this.handleSetChips}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
