import "./styles.scss";

import { GameOptionsButton, RestartButton } from "../KeyButton";

import GameOptions from "../GameOptions";
import Logo from "../Logo";
import PointsBoard from "../PointsBoard";
import React from "react";

export default function GameOver({
  pointsBoardProps,
  gameOptionsProps,
  restartGame,
}) {
  return (
    <div className="game-over">
      <Logo />
      <GameOptionsButton onClick={restartGame} description={"Restart"} />
      <RestartButton onClick={restartGame} />

      <PointsBoard
        points={pointsBoardProps.points}
        firedTimes={pointsBoardProps.firedTimes}
        maxPoints={pointsBoardProps.maxPoints}
        totalReactionTime={pointsBoardProps.totalReactionTime}
      />
      <GameOptions
        gameOptions={gameOptionsProps.gameOptions}
        setGameOptions={gameOptionsProps.setGameOptions}
        updateGameOptionsVisibility={
          gameOptionsProps.updateGameOptionsVisibility
        }
        showOptions={true}
        overlay={false}
        hideLogo
      />
    </div>
  );
}
