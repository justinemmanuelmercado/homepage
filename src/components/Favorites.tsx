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
        const {
            state: { websites }
        } = this;
        return websites.map((ws: Website) => {
            return (
                <div key={ws.name} className="column">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img
                                    src="https://bulma.io/images/placeholders/1280x960.png"
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
            <div className="container">
                <h1>Favorites</h1>
                <div className="columns">{this.renderWebsites()}</div>
            </div>
        );
    }
}
