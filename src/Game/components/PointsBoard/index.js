import "./styles.scss";

import React from "react";
import { prettyNumber } from "../../utils";

export default function PointsBoard({
  points,
  maxPoints,
  firedTimes,
  totalReactionTime,
}) {
  const hitAccuracy = points / firedTimes || 0;
  const targetsHitPct = points / maxPoints || 0;

  return (
    <div
      className={`points-board ${
        totalReactionTime ? "with-reaction-time" : ""
      }`}
    >
      <CounterGroup
        count={points}
        helpCount={`${prettyNumber(targetsHitPct * 100, 1)}%`}
        name="Targets hit"
        counterClassName={targetsHitPct >= 0.5 ? "good" : "bad"}
      />
      <CounterGroup count={maxPoints} name="Total targets" />
      <CounterGroup
        count={`${prettyNumber(hitAccuracy * 100, 1)}%`}
        name="Hit accuracy"
        counterClassName={hitAccuracy >= 0.5 ? "good" : "bad"}
      />
      {totalReactionTime && maxPoints && (
        <CounterGroup
          count={`${prettyNumber(totalReactionTime / 1000 / maxPoints, 4)}s`}
          name="Avg. reaction time"
        />
      )}
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
