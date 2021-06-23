import "./styles.scss";

import Bullseye from "./Bullseye";
import Covid from "./Covid";
import { GameSettingsContext } from "../GameSettings/context";
import Pewion from "./Pewion";
import { useContext } from "react";

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
