import { GameSettingsType } from "./context";
import { ReactNode } from "react";

export interface GameSettingCoreProps {
  label: ReactNode;
  settingTag: keyof GameSettingsType;
  helpText?: string;
}

interface Props extends GameSettingCoreProps {
  children: ReactNode;
}

export default function GameSetting({
  label,
  settingTag,
  helpText,
  children,
}: Props) {
  return (
    <div className="game-setting">
      <label htmlFor={`#gamesetting-${settingTag}`}>
        {label}
        {helpText && <div className="help-text">{helpText}</div>}
      </label>
      {children}
    </div>
  );
}
