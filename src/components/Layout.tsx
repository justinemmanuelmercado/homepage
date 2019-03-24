import React from "react";
// import { Navbar } from "./Navbar";

interface Props {
    children: React.ReactElement | React.ReactElement[];
}

export function Layout(props: Props): React.FunctionComponentElement<Props> {
    return <div className="container">{props.children}</div>;
}
