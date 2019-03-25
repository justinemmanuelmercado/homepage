import React from "react";
import { Title } from "./Title";
import { getFavorites, Website } from "../lib/api";

interface Props {}

interface State {
    websites: Website[];
    loading: boolean;
}

export class Favorites extends React.Component<Props, State> {
    public state = {
        websites: [],
        loading: true
    };
    public async componentDidMount() {
        const websites = await getFavorites();

        this.setState({
            websites: websites as Website[],
            loading: false
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
        const loading = (
            <div className="column">
                <h2>Loading...</h2>
            </div>
        );
        return (
            <div
                style={{
                    overflowX: "auto"
                }}
                className="section"
            >
                <div className="container">
                    <Title onClick={this.handleClick}>Favorites</Title>
                    <div className="columns">
                        {this.state.loading ? loading : this.renderWebsites()}
                    </div>
                </div>
            </div>
        );
    }

    private handleClick = () => {};
}
