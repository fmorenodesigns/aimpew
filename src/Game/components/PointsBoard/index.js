import "./styles.scss";

import React from "react";
import { prettyPercentage } from "../../utils";

export default function PointsBoard({ points, maxPoints, firedTimes }) {
  const hitAccuracy = points / firedTimes || 0;
  const targetsHitPct = points / maxPoints || 0;

  return (
    <div className="points-board">
      <CounterGroup
        count={points}
        helpCount={`${prettyPercentage(targetsHitPct, 1)}%`}
        name="Targets hit"
        counterClassName={targetsHitPct >= 0.5 ? "good" : "bad"}
      />
      <CounterGroup count={maxPoints} name="Total targets" />
      <CounterGroup
        count={`${prettyPercentage(hitAccuracy, 1)}%`}
        name="Hit accuracy"
        counterClassName={hitAccuracy >= 0.5 ? "good" : "bad"}
      />
    </div>
  );
}

function CounterGroup({ count, helpCount, name, counterClassName = "" }) {
  return (
    <div className="counter-group">
      <div className={`counter ${counterClassName}`}>
        {count}{" "}
        {helpCount && <span className="help-counter">({helpCount})</span>}
      </div>
      <div className="counter-name">{name}</div>
    </div>
  );
}
