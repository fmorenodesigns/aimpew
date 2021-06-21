import "./styles.scss";

import { GameOptionsButton, RestartButton } from "../KeyButton";

import Logo from "../Logo";
import React from "react";

export default function GameOver({ pointsBoard, gameOptions, restartGame }) {
  return (
    <div className="game-over">
      <Logo className="default-logo" />
      <GameOptionsButton onClick={restartGame} description={"Restart"} />
      <RestartButton onClick={restartGame} />
      {pointsBoard}
      {gameOptions}
    </div>
  );
}
