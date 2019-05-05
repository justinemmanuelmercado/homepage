import React from "react";
import { Modal } from "./Modal";

interface Props {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirm(
    props: Props
): React.FunctionComponentElement<Props> {
    if (!props.isOpen) return <></>;
    const footer = (
        <div>
            <button onClick={props.onConfirm} className="button">
        Yes
            </button>
            <button onClick={props.onCancel} className="button">
        No
            </button>
        </div>
    );
    return (
        <Modal footer={footer}>
            <div>Delete the selected bookmarks?</div>
        </Modal>
    );
}
