import "./styles.scss";

import { PauseDatetime, getPauseDuration } from "../../utils/utils";
import Target, { TargetMetadata } from "../Target";

import { GameOptionsType } from "../GameOptions";

interface Props {
  targets: TargetMetadata[];
  pauseDatetime: PauseDatetime;
  gameOptions: GameOptionsType;
  onTargetHit: (targetIndex: number, lifeTime: number) => void;
}

export default function TargetsContainer({
  targets,
  pauseDatetime,
  gameOptions,
  onTargetHit,
}: Props) {
  return (
    <div className="target-container">
      {targets.map((target) => (
        <Target
          key={target.index}
          size={target.size}
          left={target.left}
          top={target.top}
          onHit={() => {
            const now = new Date();

            const pauseDuration = getPauseDuration(
              pauseDatetime,
              target.lifeStart
            );

            const lifeTime =
              now.valueOf() - pauseDuration - target.lifeStart.valueOf();

            onTargetHit(target.index, lifeTime);
          }}
          type={gameOptions.targetType}
        />
      ))}
    </div>
  );
}
