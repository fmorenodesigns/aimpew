import GameOption, { GameOptionCoreProps } from "./GameOption";

interface Props extends GameOptionCoreProps {
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
    <GameOption label={label} optionTag={optionTag} helpText={helpText}>
      <input
        type="checkbox"
        className="checkbox"
        id={`gameoption-${optionTag}`}
        checked={value}
        onChange={(e) => updateValue(optionTag, e.target.checked)}
      />
    </GameOption>
  );
}
