import GameSetting, { GameSettingCoreProps } from "./GameSetting";

interface Props extends GameSettingCoreProps {
  min: number;
  max: number;
  value: number;
  updateValue: (settingTag: string, value: number) => void;
}

export default function Input({
  value,
  updateValue,
  label,
  settingTag,
  helpText,
  min,
  max,
}: Props) {
  return (
    <GameSetting label={label} settingTag={settingTag} helpText={helpText}>
      <input
        type="number"
        className="input"
        id={`gamesetting-${settingTag}`}
        value={value || ""}
        onChange={(e) => {
          const newValue = isNaN(parseInt(e.target.value))
            ? 0
            : parseInt(e.target.value);

          updateValue(settingTag, Math.max(Math.min(newValue, max), 0));
        }}
        min={min}
        max={max}
      />
    </GameSetting>
  );
}
