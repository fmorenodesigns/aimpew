import GameOption, { GameOptionCoreProps } from "./GameOption";

interface Props extends GameOptionCoreProps {
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
    <GameOption label={label} optionTag={optionTag} helpText={helpText}>
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
    </GameOption>
  );
}
