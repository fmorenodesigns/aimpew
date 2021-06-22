import "./styles.scss";

import { prettyNumber } from "../../utils/utils";

export interface Props {
  points: number;
  maxPoints: number;
  firedTimes: number;
  totalTimeBeforeHit?: number;
}

export default function PointsBoard({
  points,
  maxPoints,
  firedTimes,
  totalTimeBeforeHit,
}: Props) {
  const hitAccuracy = points / firedTimes || 0;
  const targetsHitPct = points / maxPoints || 0;

  return (
    <div
      className={`points-board ${
        totalTimeBeforeHit ? "with-reaction-time" : ""
      }`}
    >
      <CounterGroup
        count={`${points}`}
        helpCount={`${prettyNumber(targetsHitPct * 100, 1)}%`}
        label="Targets hit"
        counterClassName={targetsHitPct >= 0.5 ? "good" : "bad"}
      />
      <CounterGroup count={`${maxPoints}`} label="Total targets" />
      <CounterGroup
        count={`${prettyNumber(hitAccuracy * 100, 1)}%`}
        label="Hit accuracy"
        counterClassName={hitAccuracy >= 0.5 ? "good" : "bad"}
      />
      {!!totalTimeBeforeHit && !!maxPoints && (
        <CounterGroup
          count={`${prettyNumber(totalTimeBeforeHit / 1000 / points, 4)}s`}
          label="Avg. time to hit"
        />
      )}
    </div>
  );
}

interface CounterGroupProps {
  count: string;
  label: string;
  helpCount?: string;
  counterClassName?: string;
}

function CounterGroup({
  count,
  helpCount,
  label,
  counterClassName = "",
}: CounterGroupProps) {
  return (
    <div className="counter-group">
      <div className={`counter ${counterClassName}`}>
        {count}{" "}
        {helpCount && <span className="help-counter">({helpCount})</span>}
      </div>
      <div className="counter-label">{label}</div>
    </div>
  );
}
