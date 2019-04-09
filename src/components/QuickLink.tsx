import React from "react";
import { QuickLink as QuickLinkInterface } from "../lib/api";

interface Props {
    link: QuickLinkInterface;
}

export const QuickLink = (
    props: Props
): React.FunctionComponentElement<Props> => {
    const ql = props.link;
    if (ql.children) {
        return (
            <div className="navbar-item">
                <a className="navbar-link" href={ql.url}>
                    {ql.name}
                </a>
            </div>
        );
    } else {
        return (
            <a href={ql.url} className="navbar-item">
                {ql.name}
            </a>
        );
    }
};
