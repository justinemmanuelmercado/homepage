import React from "react";

export function Navbar(): React.FunctionComponentElement<{}> {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand" />
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <a className="button is-primary">
                            <strong>Add Favorite Site</strong>
                        </a>
                        <a className="button is-light">Add Bookmark</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
