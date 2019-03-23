import React, { Component } from "react";
import "./App.css";
import typography from "./typography";
// Components
import { Helmet } from "react-helmet";
// import { TypographyStyle, GoogleFont } from "react-typography";
import { Layout } from "./components/Layout";
import { Favorites } from "./components/Favorites";
import { Bookmarks } from "./components/Bookmarks";
class App extends Component {
    public render(): React.ReactElement {
        return (
            <Layout>
                <Helmet>
                    <style type="text/css">{typography}</style>
                </Helmet>
                <Favorites />
                <Bookmarks />
            </Layout>
        );
    }
}

export default App;
