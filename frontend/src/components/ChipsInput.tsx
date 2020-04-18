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

  const addChip = (): void => {
    props.onChange([newChip, ...props.chips]);
    setNewChip("");
  };
  const inputRef = React.createRef<HTMLInputElement>();

  const removeChip = (chip: string) => {
    const chipIndex = props.chips.indexOf(chip);
    const newChips = props.chips;
    newChips.splice(chipIndex, 1);
    props.onChange(newChips);
  };

  const handleKeyPress = (evt: React.KeyboardEvent<HTMLInputElement>): void => {
    if (evt.key === "Backspace" && !newChip && props.chips.length > 0) {
      evt.preventDefault();
      removeChip(props.chips[props.chips.length - 1]);
    }
    if (evt.key === "," || evt.key === "Enter") {
      evt.preventDefault();
      addChip();
    }
  };

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
            <button onClick={() => removeChip(chip)} className="chip-button">
              {chip}
            </button>
          </div>
        );
      })}
      <div
        className="control"
        style={{
          width: "100%"
        }}
      >
        <input
          ref={inputRef}
          value={newChip}
          onChange={setChip}
          onKeyDown={handleKeyPress}
          id="newTag"
          className="chips-input"
          type="text"
          style={{
            width: "100%"
          }}
        />
      </div>
    </div>
  );
};
