import "./styles.scss";

import { GameSettingsButton, RestartButton } from "../KeyButton";
import PointsBoard, { Props as PointsBoardProps } from "../PointsBoard";

import GameSettings from "../GameSettings";
import Logo from "../Logo";

interface Props {
  pointsBoardProps: PointsBoardProps;
  restartGame: () => void;
}

export default function GameOver({ pointsBoardProps, restartGame }: Props) {
  return (
    <div className="game-over">
      <Logo />
      <GameSettingsButton onClick={restartGame} description={"Restart"} />
      <RestartButton onClick={restartGame} />
      <PointsBoard
        points={pointsBoardProps.points}
        firedTimes={pointsBoardProps.firedTimes}
        maxPoints={pointsBoardProps.maxPoints}
        totalTimeBeforeHit={pointsBoardProps.totalTimeBeforeHit}
      />
      <GameSettings showOptions={true} overlay={false} hideLogo />
    </div>
  );
}
