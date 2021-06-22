import { OptionCoreProps } from ".";
import React from "react";

interface Props extends OptionCoreProps {
  min: number;
  max: number;
  value: number;
  updateValue: (optionTag: string, value: number) => void;
}

export default function Input({
  value,
  updateValue,
  label,
  optionTag,
  helpText,
  min,
  max,
}: Props) {
  return (
    <div className="game-option">
      <label htmlFor={`#gameoption-${optionTag}`}>
        {label}
        {helpText && <div className="help-text">{helpText}</div>}
      </label>
      <input
        type="number"
        className="input"
        id={`gameoption-${optionTag}`}
        value={value || ""}
        onChange={(e) =>
          updateValue(
            optionTag,
            Math.max(Math.min(parseInt(e.target.value), max), min)
          )
        }
      />
    </div>
  );
}
