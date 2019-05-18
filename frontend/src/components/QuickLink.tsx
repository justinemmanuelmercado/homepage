import React from "react";
import { QuickLink as QuickLinkInterface } from "../lib/api";

interface Props {
    link: QuickLinkInterface;
}

const childSeparator = "~~";

export const QuickLink = (
    props: Props
): React.FunctionComponentElement<Props> => {
    const ql = props.link;
    if (ql.children.length > 0) {
        const childNodes = ql.children.map(
            (child: string): React.ReactElement => {
                const [name, url] = child.split(childSeparator);
                return <a key={url} href={url} className="navbar-item">
                    {name}
                </a>

            }
        );
        return (
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link" href={ql.url}>
                    {ql.name}
                </a>
                <div className="navbar-dropdown">{childNodes}</div>
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