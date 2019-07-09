import React from "react";
import { QuickLink as QuickLinkInterface } from "../lib/api";
import { FaTimes } from "react-icons/fa";

interface Props {
    link: QuickLinkInterface;
    deleteMode: boolean;
    deleteQuickLink: (ql: QuickLinkInterface) => void;
}

const childSeparator = "~~";

export const QuickLink = (props: Props) => {
    return (
        <span key={props.link.url}>
            <InnerLink {...props} />
        </span>
    )
}

const InnerLink = (
    props: Props
): React.FunctionComponentElement<Props> => {
    const ql = props.link;
    if (props.deleteMode) {
        return <a onClick={() => props.deleteQuickLink(ql)} className="navbar-item">
            <FaTimes />
            {" "}
            {ql.name}
        </a>
    } else if (ql.children.length > 0) {
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
