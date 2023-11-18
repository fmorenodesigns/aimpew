import "./styles.scss";

import GameSettings from "../GameSettings";
import { GameSettingsButton, RestartButton } from "../KeyButton";
import Logo from "../Logo";
import PointsBoard, { Props as PointsBoardProps } from "../PointsBoard";


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
      <GameSettings showSettings={true} overlay={false} hideLogo />
    </div>
  );
}
