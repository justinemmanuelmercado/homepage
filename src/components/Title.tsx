import React from "react";
import { FaPlus } from "react-icons/fa";

interface Props {
    children?: React.ReactChild[] | string;
    onClick: () => void;
}

export const Title = (props: Props): React.ReactElement => {
    return (
        <div
            style={{
                alignItems: "center"
            }}
            className="is-flex column"
        >
            <h1
                className="is-inline-block"
                style={{
                    margin: 0
                }}
            >
                {props.children}
            </h1>
            <button
                onClick={props.onClick}
                style={{ height: "100%" }}
                className="button"
                type="button"
            >
                <FaPlus />
            </button>
        </div>
    );
};
