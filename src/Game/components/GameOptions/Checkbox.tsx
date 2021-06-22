import { OptionCoreProps } from ".";
import React from "react";

interface Props extends OptionCoreProps {
  value: boolean;
  updateValue: (optionTag: string, value: boolean) => void;
}

export default function Checkbox({
  value,
  updateValue,
  label,
  optionTag,
  helpText,
}: Props) {
  return (
    <div className="game-option">
      <label htmlFor={`#gameoption-${optionTag}`}>
        {label}
        {helpText && <div className="help-text">{helpText}</div>}
      </label>
      <input
        type="checkbox"
        className="checkbox"
        id={`gameoption-${optionTag}`}
        checked={value}
        onChange={(e) => updateValue(optionTag, e.target.checked)}
      />
    </div>
  );
}
