import React from "react";

interface HeaderProps {
    setSelected: (selected: string) => void;
    selected: string;
    pages: string[];
}

export const Header = (props: HeaderProps): React.ReactElement => {
    const { selected, pages, setSelected } = props;
    return (
        <div className="tabs is-centered">
            <ul>
                {pages.map(
                    (page: string): React.ReactElement => {
                        const className = page === selected ? "is-active" : "";

                        return (
                            <li
                                key={page}
                                className={className}
                                onClick={(): void => setSelected(page)}
                            >
                                <a>
                                    <span className="icon is-small">
                                        <i className="fas fa-image" aria-hidden="true"></i>
                                    </span>
                                    <span>
                                        {page[0].toUpperCase()}
                                        {page.substring(1)}
                                    </span>
                                </a>
                            </li>
                        );
                    }
                )}
            </ul>
        </div>
    );
};
