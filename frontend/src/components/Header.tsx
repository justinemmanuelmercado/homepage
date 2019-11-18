import React from "react";
import { IconType } from "react-icons";

interface HeaderProps {
    setSelected: (selected: string) => void;
    selected: string;
    pages: { id: string; icon: IconType }[];
}

export const Header = (props: HeaderProps): React.ReactElement => {
    const { selected, pages, setSelected } = props;
    return (
        <div className="tabs">
            <ul>
                {pages.map(
                    (page): React.ReactElement => {
                        const { icon: Icon, id } = page;
                        const className = id === selected ? "is-active" : "";
                        return (
                            <li
                                key={id}
                                className={className}
                                onClick={(): void => setSelected(id)}
                            >
                                <a>
                                    <span className="icon">
                                        <Icon />
                                    </span>
                                    <span>
                                        {id[0].toUpperCase()}
                                        {id.substring(1)}
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
