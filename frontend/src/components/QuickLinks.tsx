import React from "react";
import { FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { QuickLink } from "./QuickLink";
import {
  BaseQuickLink,
  getQuickLinks,
  QuickLink as QuickLinkInterface,
  putLink,
  deleteQuickLink,
  getMetaData
} from "../lib/api";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import validator from "validator";
import { GlobalHotKeys } from "react-hotkeys";
import { redirect } from "../lib/links";
import { generalMovement, OPEN_LINK_SHORTCUT_KEYS } from "../lib/shortcut";

interface Props {
  selected: boolean;
}
interface State {
  quickLinks: QuickLinkInterface[];
  modalOpen: boolean;
  deleteMode: boolean;
  currentPage: number;
  items: number;
  containerWidth: number;
  formWidth: string;
  quicklink: BaseQuickLink;
  formLoading: boolean;
  filteredQuickLinks: QuickLinkInterface[];
}

const MAX_ITEMS_WIDE = 5;
const MAX_ITEMS_MOBILE = 3;
const LINKS_WIDTH_WIDE = 600;
const LINKS_WIDTH_MOBILE = 360;
const FORM_WIDTH_WIDE = "60%";
const FORM_WIDTH_MOBILE = "100%";
const BLANK_QL: BaseQuickLink = {
  name: "",
  url: "",
  thumbnail: ""
};

export class QuickLinks extends React.Component<Props, State> {
  public state: State = {
    formLoading: false,
    quickLinks: [],
    modalOpen: false,
    deleteMode: false,
    items: MAX_ITEMS_WIDE,
    currentPage: 0,
    containerWidth: LINKS_WIDTH_WIDE,
    formWidth: FORM_WIDTH_WIDE,
    quicklink: BLANK_QL,
    filteredQuickLinks: []
  };

  private renderMaxPage(): number {
    const length = this.state.quickLinks.length;
    return Math.ceil(length / this.state.items);
  }

  public async componentDidMount(): Promise<void> {
    if (window && window.innerWidth < 769) {
      this.setState({
        items: MAX_ITEMS_MOBILE,
        containerWidth: LINKS_WIDTH_MOBILE,
        formWidth: FORM_WIDTH_MOBILE
      });
    }
    await this.loadQuickLinks();
  }

  private debounced = AwesomeDebouncePromise(getMetaData, 1000);

  private handleUrlChange = async (
    evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const url = evt.currentTarget.value;
    const { quicklink } = this.state;
    if (!quicklink) return;
    const { name, thumbnail = "" } = quicklink;

    this.setState({
      quicklink: {
        url,
        name,
        thumbnail
      }
    });

    if (validator.isURL(url)) {
      try {
        evt.persist();
        this.setState({ formLoading: true });
        const { data } = await this.debounced(url);
        this.setState(
          (currentState): State => {
            const { quicklink: ql } = currentState;
            ql.thumbnail = data.logo ? data.logo : "";
            ql.name = data.title ? data.title : "";
            return {
              ...currentState,
              formLoading: false,
              quicklink: ql
            };
          }
        );
      } catch (e) {
        console.error("Something went wrong");
        console.error(e);
      }
    }
  };

  private keyMap = {
    ...generalMovement
  };

  private handlers = {
    PREV: (): void => {
      this.goToPage(this.state.currentPage - 1);
    },
    NEXT: (): void => {
      this.goToPage(this.state.currentPage + 1);
    },
    OPEN_PAGE: (evt?: KeyboardEvent) => {
      if (evt) {
        const withShift = evt.shiftKey;
        const keyPressed = evt.key.toLowerCase();
        let ind = 0;
        OPEN_LINK_SHORTCUT_KEYS.some((v, i) => {
          if (v === keyPressed) {
            ind = i;
          }
          return v === keyPressed;
        });

        const { url } = this.state.filteredQuickLinks[ind];
        redirect(url, withShift);
        console.log(evt);
      }
    }
  };

  private goToPage = (page: number): void => {
    if (page < 0 || page > this.renderMaxPage() - 1) return;

    this.setState(
      {
        currentPage: page
      },
      this.loadFilteredQuickLinks
    );
  };

  private filteredQuickLinks = (): QuickLinkInterface[] => {
    const { quickLinks, currentPage, items } = this.state;
    const start = currentPage * items;
    const end = start + items;
    return quickLinks.slice(start, end);
  };

  private loadFilteredQuickLinks = () => {
    this.setState({
      filteredQuickLinks: this.filteredQuickLinks()
    });
  };

  public render(): React.ReactElement {
    const { formWidth, formLoading, filteredQuickLinks } = this.state;

    return (
      <div className="container">
        {this.props.selected && (
          <GlobalHotKeys
            handlers={this.handlers}
            keyMap={this.keyMap}
          ></GlobalHotKeys>
        )}
        <div className="section">
          <div>
            <div className="column">
              <div>
                <div
                  className="field has-addons is-horizontal"
                  style={{ justifyContent: "center" }}
                >
                  <div
                    className={`control ${formLoading ? "is-loading" : ""}`}
                    style={{ width: formWidth }}
                  >
                    <input
                      onChange={this.handleUrlChange}
                      className="input"
                      type="text"
                      placeholder="https://www.example.com"
                    />
                  </div>
                  <div className="control">
                    <button className="button" onClick={this.handleSubmit}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <div className="pagination-button">
                <span
                  onClick={(): void =>
                    this.goToPage(this.state.currentPage - 1)
                  }
                >
                  <FaAngleLeft />
                </span>
              </div>
              {filteredQuickLinks.map(
                (ql: QuickLinkInterface): React.ReactElement => {
                  return (
                    <div style={{ margin: "0 0.8rem" }} key={ql.id}>
                      <QuickLink
                        link={ql}
                        deleteMode={this.state.deleteMode}
                        deleteQuickLink={this.deleteQuickLink}
                      />
                    </div>
                  );
                }
              )}
              <div className="pagination-button">
                <span
                  onClick={(): void =>
                    this.goToPage(this.state.currentPage + 1)
                  }
                >
                  <FaAngleRight />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private deleteQuickLink = async (ql: QuickLinkInterface): Promise<void> => {
    await deleteQuickLink([ql]);
    await this.loadQuickLinks();
  };

  private handleSubmit = async (): Promise<void> => {
    const { quicklink } = this.state;
    await putLink(quicklink, 2);
    await this.loadQuickLinks();
  };

  private loadQuickLinks = async (): Promise<void> => {
    const ql = await getQuickLinks();
    this.setState(
      {
        quickLinks: ql
      },
      this.loadFilteredQuickLinks
    );
  };
}
