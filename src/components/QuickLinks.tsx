import React from "react";
import { QuickLink } from "./QuickLink";
import { getQuickLinks, QuickLink as QuickLinkInterface } from "../lib/api";

interface Props {}
interface State {
    quickLinks: QuickLinkInterface[];
}

export class QuickLinks extends React.Component<Props, State> {
    public state = {
        quickLinks: []
    };

    public async componentDidMount(): Promise<void> {
        const ql = await getQuickLinks();
        this.setState({
            quickLinks: ql
        });
    }

    public render(): React.ReactElement {
        return (
            <nav className="navbar">
                <div className="navbar-menu">
                    {this.state.quickLinks.map((ql: QuickLinkInterface) => {
                        return <QuickLink key={ql.url} link={ql} />;
                    })}
                </div>
            </nav>
        );
    }
}
