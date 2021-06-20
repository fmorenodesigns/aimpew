import "./styles.scss";

import React from "react";
import { RestartButton } from "../KeyButton";

export default function GameOver({ pointsBoard, gameOptions, restartGame }) {
  return (
    <div className="game-over">
      <RestartButton onClick={restartGame} />
      {gameOptions}
      {pointsBoard}
    </div>
  );
}
