import "./styles.scss";

import { useState } from "react";

import { TargetProps } from "..";

export default function Covid({
  size,
  left,
  top,
  onHit,
  ...props
}: TargetProps) {
  const [hit, setHit] = useState(false);

  return (
    <div
      className={`target covid-19 ${hit ? "hit" : ""}`}
      style={{
        left: `${left * 100}%`,
        top: `${top * 100}%`,
        transform: `scale(${(size / 40) * (hit ? 1.7 : 1)})`,
      }}
      onClick={() => {
        if (hit) return;

        setHit(true);
        onHit();
      }}
      {...props}
    >
      <div className="tentacle tentacle--1" />
      <div className="tentacle tentacle--4" />
      <div className="tentacle tentacle--5" />
      <div className="tentacle tentacle--6" />
      <div className="body" />
      <div className="tentacle tentacle--2" />
      <div className="tentacle tentacle--3" />
      <div className="tentacle tentacle--7" />
      <div className="tentacle tentacle--8" />
      <div className="eyes">
        <div className="eye eye--left" />
        <div className="eye eye--right" />
      </div>
    </div>
  );
}
