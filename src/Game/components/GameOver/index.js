import "./styles.scss";

import Logo from "../Logo";
import React from "react";
import { RestartButton } from "../KeyButton";

export default function GameOver({ pointsBoard, gameOptions, restartGame }) {
  return (
    <div className="game-over">
      <Logo className="default-logo" />
      <RestartButton onClick={restartGame} animated />
      {pointsBoard}
      {gameOptions}
    </div>
  );
}
