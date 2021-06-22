import React, { useState } from "react";

import { OptionCoreProps } from ".";

interface SelectOptions {
  value: string;
  label: string;
}

interface Props extends OptionCoreProps {
  selectOptions: SelectOptions[];
  value: string;
  updateValue: (optionTag: string, value: string) => void;
}

export function Select({
  value,
  updateValue,
  selectOptions = [],
  label,
  optionTag,
  helpText,
}: Props) {
  const [selectIsOpen, setSelectIsOpen] = useState(false);

  return (
    <div className="game-option">
      <label htmlFor={`#gameoption-${optionTag}`}>
        {label}
        {helpText && <div className="help-text">{helpText}</div>}
      </label>
      <div className="select-wrapper">
        <div className="chevron">
          <i className={`fas fa-chevron-${selectIsOpen ? "up" : "down"}`}></i>
        </div>
        <select
          className="select"
          value={value}
          onChange={(e) => updateValue(optionTag, e.target.value)}
          onClick={() => setSelectIsOpen((cur) => !cur)}
          onBlur={() => setSelectIsOpen(false)}
        >
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
