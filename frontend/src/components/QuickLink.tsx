import React from "react";
import { QuickLink as QuickLinkInterface } from "../lib/api";
import { FaTimes } from "react-icons/fa";

interface Props {
    link: QuickLinkInterface;
    deleteMode: boolean;
    deleteQuickLink: (ql: QuickLinkInterface) => void;
}

export const QuickLink = (props: Props): React.ReactElement => {
    return (
        <span key={props.link.url}>
            <InnerLink {...props} />
        </span>
    );
};

const truncateText = (text: string, length: number = 50): string => {
    if (text.length < length) {
        return text;
    }

    return `${text.substring(0, length)}...`;
};

const InnerLink = (props: Props): React.FunctionComponentElement<Props> => {
    const ql = props.link;
    const url = new URL(ql.url);
    const domain = url.host;
    if (props.deleteMode) {
        return (
            <a
                onClick={(): void => props.deleteQuickLink(ql)}
                className="navbar-item"
            >
                <FaTimes /> {ql.name}
            </a>
        );
    } else {
        return (
            <div
                style={
                    {
                        // display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                        // flexDirection: "column"
                    }
                }
            >
                <figure className="quicklink-transition image is-1by1">
                    <img src="https://bulma.io/images/placeholders/128x128.png" />
                </figure>
                <small style={{ marginTop: 20 }}>
                    <a href={ql.url}>{truncateText(domain, 50)}</a>
                </small>
            </div>
        );
    }
};
