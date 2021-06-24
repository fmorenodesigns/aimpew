import "./styles.scss";

import { PauseDatetime, getPauseDuration } from "../../utils/utils";
import Target, { TargetMetadata } from "../Target";

import { useState } from "react";

interface Props {
  targets: TargetMetadata[];
  pauseDatetime: PauseDatetime;
  onTargetHit: (targetIndex: number, lifeTime: number) => void;
}

export default function TargetsContainer({
  targets,
  pauseDatetime,
  onTargetHit,
}: Props) {
  const [bringToFront, setBringToFront] = useState(false);

  return (
    <div className={`target-container ${bringToFront ? "bring-front" : ""}`}>
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
          onMouseEnter={() => setBringToFront(true)}
          onMouseLeave={() => setBringToFront(false)}
        />
      ))}
    </div>
  );
}
