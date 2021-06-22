import "./styles.scss";

import Logo from "./components/Logo";
import PlayableGame from "./PlayableGame";
import { isMobile } from "./utils/utils";

export default function Game() {
  return isMobile() ? (
    <div className="game is-mobile">
      <div className="error">
        <Logo />
        <p>
          This application has been developed to help people practice their
          mouse aim, and is currently not compatible with mobile devices.
        </p>
      </div>
    </div>
  ) : (
    <div className="game">
      <PlayableGame />
    </div>
  );
}
