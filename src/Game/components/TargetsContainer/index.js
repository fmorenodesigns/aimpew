import "./styles.scss";

import React from "react";
import Target from "../Target";
import { getPauseDuration } from "../../utils/utils";

export default function TargetsContainer({
  targets,
  pauseDatetime,
  gameOptions,
  onTargetHit
}) {
  return (
    <div className="target-container">
      {targets.map((target) => (
        <Target
          key={target.index}
          size={target.size}
          left={`${target.left * 100}%`}
          top={`${target.top * 100}%`}
          onHit={() => {
            const now = new Date();

            const pauseDuration = getPauseDuration(
              pauseDatetime,
              target.lifeStart
            );
            const lifeTime = now - pauseDuration - target.lifeStart;

            onTargetHit(target.index, lifeTime);
          }}
          type={gameOptions.targetType}
        />
      ))}
    </div>
  );
}
