import React, { Component } from "react";
import "./App.css";
import typography from "./typography";

import { Helmet } from "react-helmet";
import { Layout } from "./components/Layout";
import { Bookmarks } from "./components/Bookmarks";
class App extends Component {
    public render(): React.ReactElement {
        return (
            <Layout>
                <Helmet>
                    <style type="text/css">{typography}</style>
                </Helmet>
                {/* <Favorites /> */}
                <Bookmarks />
            </Layout>
        );
    }
}

export default App;
