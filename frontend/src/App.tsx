import React, { Component } from "react";
import "./App.css";
import { Bookmarks } from "./components/Bookmarks";
import { Layout } from "./components/Layout";
import { QuickLinks } from "./components/QuickLinks";
import { Header } from "./components/Header";
import { FaBookmark, FaStar } from "react-icons/fa";

interface State {
    selected: string;
}

class App extends Component<{}, State> {
    public state = {
        selected: "favorites"
    };
    public pages = [
        { id: "favorites", icon: FaStar },
        { id: "bookmarks", icon: FaBookmark }
    ];
    public setSelected = (selected: string): void => {
        this.setState({
            selected
        });
    };
    public render(): React.ReactElement {
        const { selected } = this.state;
        return (
            <Layout>
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
            </Layout>
        );
    }
}

export default App;
