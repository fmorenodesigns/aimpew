import "./styles.scss";

import React from "react";

export default function PointsBoard({ points, maxPoints, firedTimes }) {
  const hitAccuracy = points / firedTimes || 0;

  return (
    <div className="points-board">
      <div className="counter-group">
        <div className={`counter ${points / maxPoints > 0.5 ? "good" : "bad"}`}>
          {points}
        </div>
        <div className="counter-name">Targets hit</div>
      </div>
      <div className="counter-group">
        <div className="counter">{maxPoints}</div>
        <div className="counter-name">Total targets</div>
      </div>
      <div className="counter-group">
        <div className={`counter ${hitAccuracy > 0.5 ? "good" : "bad"}`}>
          {(hitAccuracy * 100).toFixed(1)}%
        </div>
        <div className="counter-name">Hit accuracy</div>
      </div>
    </div>
  );
}
