import React from "react";
import { createPortal } from "react-dom";

interface Props {
    children: React.ReactElement[] | React.ReactElement;
    title: string;
    footer?: React.ReactElement[];
    handleClose: () => void;
}

export const Modal: React.FunctionComponent<Props> = (props: Props) => {
    return createPortal(
        <div className="modal is-active">
            <div className="modal-background" />
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{props.title}</p>
                    <button
                        onClick={props.handleClose}
                        className="delete"
                        aria-label="close"
                    />
                </header>
                <section className="modal-card-body">{props.children}</section>
                <footer className="modal-card-foot">{props.footer}</footer>
            </div>
        </div>,
        document.body
    );
};
