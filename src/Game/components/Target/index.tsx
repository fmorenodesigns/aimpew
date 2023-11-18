import { useContext } from "react";

import { GameSettingsContext } from "../GameSettings/context";

import Bullseye from "./Bullseye";
import Covid from "./Covid";
import Pewion from "./Pewion";


export type TargetType = "pewion" | "bullseye" | "covid";

export interface TargetMetadata {
  index: number;
  size: number;
  left: number;
  top: number;
  lifeStart: Date;
}

export interface TargetProps
  extends Omit<TargetMetadata, "index" | "lifeStart"> {
  onHit: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Target(props: TargetProps) {
  const { gameSettings } = useContext(GameSettingsContext);

  return (
    <>
      {(() => {
        switch (gameSettings.targetType) {
          default:
          case "pewion":
            return <Pewion {...props} />;
          case "covid":
            return <Covid {...props} />;
          case "bullseye":
            return <Bullseye {...props} />;
        }
      })()}
    </>
  );
}
