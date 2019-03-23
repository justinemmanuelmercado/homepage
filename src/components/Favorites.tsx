import React from "react";
import { websites } from "../mock/websites";

interface Props {}

interface Website {
    name: string;
    url: string;
}

interface State {
    websites: Website[];
}

export class Favorites extends React.Component<Props, State> {
    public state = {
        websites: []
    };
    public componentDidMount(): void {
        this.setState({
            websites: websites as Website[]
        });
    }

    private renderWebsites(): React.ReactElement[] {
        return this.state.websites.map((ws: Website, i: number) => {
            return (
                <div key={i} className="column is-one-fifth">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img
                                    src="https://loremflickr.com/200/200"
                                    alt="Placeholder image"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            );
        });
    }
    public render(): React.ReactElement {
        return (
            <div
                style={{
                    overflowX: "scroll"
                }}
                className="section"
            >
                <div className="container">
                    <h1>Favorites</h1>
                    <div className="columns">{this.renderWebsites()}</div>
                </div>
            </div>
        );
    }
}
