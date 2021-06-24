import GameSetting, { GameSettingCoreProps } from "./GameSetting";

interface Props extends GameSettingCoreProps {
  value: boolean;
  updateValue: (settingTag: string, value: boolean) => void;
}

export default function Checkbox({
  value,
  updateValue,
  label,
  settingTag,
  helpText,
}: Props) {
  return (
    <GameSetting label={label} settingTag={settingTag} helpText={helpText}>
      <input
        type="checkbox"
        className="checkbox"
        id={`gamesetting-${settingTag}`}
        checked={value}
        onChange={(e) => updateValue(settingTag, e.target.checked)}
      />
    </GameSetting>
  );
}
