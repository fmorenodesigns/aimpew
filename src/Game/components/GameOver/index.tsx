import "./styles.scss";

import GameOptions, { Props as GameOptionsProps } from "../GameOptions";
import { GameOptionsButton, RestartButton } from "../KeyButton";
import PointsBoard, { Props as PointsBoardProps } from "../PointsBoard";

import Logo from "../Logo";

interface Props {
  pointsBoardProps: PointsBoardProps;
  gameOptionsProps: GameOptionsProps;
  restartGame: () => void;
}

export default function GameOver({
  pointsBoardProps,
  gameOptionsProps,
  restartGame,
}: Props) {
  return (
    <div className="game-over">
      <Logo />
      <GameOptionsButton onClick={restartGame} description={"Restart"} />
      <RestartButton onClick={restartGame} />

      <PointsBoard
        points={pointsBoardProps.points}
        firedTimes={pointsBoardProps.firedTimes}
        maxPoints={pointsBoardProps.maxPoints}
        totalTimeBeforeHit={pointsBoardProps.totalTimeBeforeHit}
      />
      <GameOptions
        gameOptions={gameOptionsProps.gameOptions}
        setGameOptions={gameOptionsProps.setGameOptions}
        showOptions={true}
        overlay={false}
        hideLogo
      />
    </div>
  );
}
