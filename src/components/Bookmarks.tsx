import React from "react";

interface State {}
interface Props {}

export class Bookmarks extends React.Component<Props, State> {
  public render(): React.ReactElement {
    return (
      <div className="container">
        <h1>Bookmarks</h1>
      </div>
    );
  }
}
