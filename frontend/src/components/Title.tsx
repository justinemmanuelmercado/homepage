import React from "react";

interface Props {
    children?: React.ReactChild[] | string;
}

export const Title = (props: Props): React.ReactElement => {
    return <h1 className="is-1">{props.children}</h1>;
};
