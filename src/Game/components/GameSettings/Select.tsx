import GameSetting, { GameSettingCoreProps } from "./GameSetting";

import { useState } from "react";

interface SelectOptions {
  value: string;
  label: string;
}

interface Props extends GameSettingCoreProps {
  selectOptions: SelectOptions[];
  value: string;
  updateValue: (settingTag: string, value: string) => void;
}

export function Select({
  value,
  updateValue,
  selectOptions = [],
  label,
  settingTag,
  helpText,
}: Props) {
  const [selectIsOpen, setSelectIsOpen] = useState(false);

  return (
    <GameSetting label={label} settingTag={settingTag} helpText={helpText}>
      <div className="select-wrapper">
        <div className="chevron">
          <i className={`fas fa-chevron-${selectIsOpen ? "up" : "down"}`}></i>
        </div>
        <select
          id={`gamesetting-${settingTag}`}
          className="select"
          value={value}
          onChange={(e) => updateValue(settingTag, e.target.value)}
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
    </GameSetting>
  );
}
