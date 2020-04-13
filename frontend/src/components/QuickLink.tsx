import React from "react";
import { QuickLink as QuickLinkInterface } from "../lib/api";
import { FaTrash } from "react-icons/fa";
import { getDomain, truncateText } from "../lib/string";

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

const InnerLink = (props: Props): React.FunctionComponentElement<Props> => {
  const ql = props.link;
  const domain = getDomain(ql.url);
  const imgSrc = ql.thumbnail
    ? ql.thumbnail
    : "https://bulma.io/images/placeholders/128x128.png";

  return (
    <div className="quicklink">
      <a href={ql.url}>
        <figure
          style={{
            height: "5rem",
            width: "5rem"
          }}
          className="quicklink-transition image is-1by1"
        >
          <img alt={ql.name} src={imgSrc} />
        </figure>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            width: "100%"
          }}
        >
          <small>{truncateText(domain, 50)}</small>
        </div>
      </a>
      <button
        className="delete-ql button"
        onClick={(): void => props.deleteQuickLink(ql)}
      >
        <FaTrash size={8} />
      </button>
    </div>
  );
};
