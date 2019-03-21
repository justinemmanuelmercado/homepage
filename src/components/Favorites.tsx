import React from "react";
// import { websites } from "../mock/websites";

interface Props {}
interface State {}

export class Favorites extends React.Component<Props, State> {
  public render(): React.ReactElement {
    return (
      <div className="container">
        <h1>Favorites</h1>
      </div>
    );
  }
}
