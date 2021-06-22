import "./styles.scss";

import Bullseye from "./Bullseye";
import Pewion from "./Pewion";

export type TargetType = "pewion" | "bullseye";

export interface TargetMetadata {
  index: number;
  size: number;
  left: number;
  top: number;
  lifeStart: Date;
}

export interface TargetProps
  extends Omit<TargetMetadata, "index" | "lifeStart"> {
  type: TargetType;
  onHit: () => void;
}

export default function Target(props: TargetProps) {
  return props.type === "pewion" ? (
    <Pewion {...props} />
  ) : (
    <Bullseye {...props} />
  );
}
