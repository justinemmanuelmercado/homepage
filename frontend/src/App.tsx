import React, { Component } from "react";
import "./App.css";
import { Bookmarks } from "./components/Bookmarks";
import { Layout } from "./components/Layout";
import { QuickLinks } from "./components/QuickLinks";
class App extends Component {
    public render(): React.ReactElement {
        return (
            <Layout>
                <QuickLinks />
                <Bookmarks />
            </Layout>
        );
    }
}

export default App;
