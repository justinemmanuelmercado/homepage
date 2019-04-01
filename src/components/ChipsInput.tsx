import React from "react";

interface Props {
    chips: string[];
    onChange: (chips: string[]) => void;
}

export const ChipsInput = (
    props: Props
): React.FunctionComponentElement<Props> => {
    const [newChip, setNewChip] = React.useState("");
    const setChip = (evt: React.SyntheticEvent<HTMLInputElement>): void => {
        setNewChip(evt.currentTarget.value);
    };
    const addChip = (evt: React.SyntheticEvent<HTMLFormElement>): void => {
        evt.preventDefault();
        const newChips = props.chips;
        newChips.push(newChip);
        props.onChange(newChips);
        setNewChip("");
    };
    const inputRef = React.createRef<HTMLInputElement>();
    const focusInput = (): void => {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.focus();
    };
    return (
        <div onClick={focusInput} className="chips">
            {props.chips.map((chip, idx) => {
                return (
                    <div key={idx} className="chip">
                        <button className="chip-button">{chip}</button>
                    </div>
                );
            })}
            <div className="control">
                <form onSubmit={addChip}>
                    <input
                        ref={inputRef}
                        value={newChip}
                        onChange={setChip}
                        id="newTag"
                        className="chips-input"
                        type="text"
                    />
                </form>
            </div>
        </div>
    );
};
