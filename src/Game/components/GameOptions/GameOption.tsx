import { ReactNode } from "react";

export interface GameOptionCoreProps {
  label: ReactNode;
  optionTag: string;
  helpText?: string;
}

interface Props extends GameOptionCoreProps {
  children: ReactNode;
}

export default function GameOption({
  label,
  optionTag,
  helpText,
  children,
}: Props) {
  return (
    <div className="game-option">
      <label htmlFor={`#gameoption-${optionTag}`}>
        {label}
        {helpText && <div className="help-text">{helpText}</div>}
      </label>
      {children}
    </div>
  );
}
