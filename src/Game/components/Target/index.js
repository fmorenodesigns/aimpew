import "./styles.scss";

import Bullseye from "./Bullseye";
import Pewion from "./Pewion";
import React from "react";

export default function Target(props) {
  return props.type === "pewion" ? (
    <Pewion {...props} />
  ) : (
    <Bullseye {...props} />
  );
}
