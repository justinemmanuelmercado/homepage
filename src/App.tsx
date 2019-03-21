import React, { Component } from "react";
import "./App.css";

// Components
import { Layout } from "./components/Layout";
import { Favorites } from "./components/Favorites";
import { Bookmarks } from "./components/Bookmarks";

class App extends Component {
  public render(): React.ReactElement {
    return (
      <Layout>
        <div className="section">
          <Favorites />
        </div>
        <div className="section">
          <Bookmarks />
        </div>
      </Layout>
    );
  }
}

export default App;
