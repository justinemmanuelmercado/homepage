import React, { Component } from "react";
import "./App.css";
import typography from "./typography";

import { Helmet } from "react-helmet";
import { Bookmarks } from "./components/Bookmarks";
import { Layout } from "./components/Layout";
import { QuickLinks } from "./components/QuickLinks";
class App extends Component {
    public render(): React.ReactElement {
        return (
            <Layout>
                <Helmet>
                    <style type="text/css">{typography}</style>
                </Helmet>
                <QuickLinks />
                <Bookmarks />
            </Layout>
        );
    }
}

export default App;
