import React, { Component } from "react";
import "./App.css";
import { Bookmarks } from "./components/Bookmarks";
import { Layout } from "./components/Layout";
import { QuickLinks } from "./components/QuickLinks";
import { Header } from "./components/Header";
import { FaBookmark, FaStar } from "react-icons/fa";
import { checkCredentials } from "./lib/api";
import { GlobalHotKeys } from "react-hotkeys";

interface State {
  selected: string;
  loggedIn: boolean;
}

export const AuthContext = React.createContext<{
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}>({ loggedIn: true, setLoggedIn: checkCredentials });

class App extends Component<{}, State> {
  public state: State = {
    selected: "favorites",
    loggedIn: false
  };
  public componentDidMount() {
    const isLoggedIn = checkCredentials();
    this.setLoggedIn(Boolean(isLoggedIn));
  }
  public pages = [
    { id: "favorites", icon: FaStar },
    { id: "bookmarks", icon: FaBookmark }
  ];
  public setSelected = (selected: string): void => {
    this.setState({
      selected
    });
  };

  private setLoggedIn = (value: boolean) => {
    this.setState({ loggedIn: value });
  };

  private keyMap = {
    GOTO_FAVORITES: ["up", "w"],
    GOTO_BOOKMARK: ["down", "s"]
  };

  private handlers = {
    GOTO_BOOKMARK: () => {
      this.setSelected("bookmarks");
    },
    GOTO_FAVORITES: () => {
      this.setSelected("favorites");
    }
  };

  public render(): React.ReactElement {
    const { selected } = this.state;
    const favoritesSelected = selected === "favorites";
    return (
      <Layout>
        <GlobalHotKeys handlers={this.handlers} keyMap={this.keyMap}>
          <AuthContext.Provider
            value={{
              loggedIn: this.state.loggedIn,
              setLoggedIn: this.setLoggedIn
            }}
          >
            <Header
              setSelected={this.setSelected}
              pages={this.pages}
              selected={selected}
            />
            <div
              style={{
                display: favoritesSelected ? "block" : "none"
              }}
            >
              <QuickLinks selected={favoritesSelected} />
            </div>
            <div
              style={{
                display: !favoritesSelected ? "block" : "none"
              }}
            >
              <Bookmarks selected={!favoritesSelected} />
            </div>
          </AuthContext.Provider>
        </GlobalHotKeys>
      </Layout>
    );
  }
}

export default App;
