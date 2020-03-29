import React, { Component } from "react";
import "./App.css";
import { Bookmarks } from "./components/Bookmarks";
import { Layout } from "./components/Layout";
import { QuickLinks } from "./components/QuickLinks";
import { Header } from "./components/Header";
import { FaBookmark, FaStar } from "react-icons/fa";
import { checkCredentials } from "./lib/api";

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
  public render(): React.ReactElement {
    const { selected } = this.state;
    return (
      <Layout>
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
              display: selected === "favorites" ? "block" : "none"
            }}
          >
            <QuickLinks />
          </div>
          <div
            style={{
              display: selected === "bookmarks" ? "block" : "none"
            }}
          >
            <Bookmarks />
          </div>
        </AuthContext.Provider>
      </Layout>
    );
  }
}

export default App;
