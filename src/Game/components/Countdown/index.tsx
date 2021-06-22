import "./styles.scss";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  startValue: number;
  setStarted: Dispatch<SetStateAction<boolean>>;
}

export default function Countdown({ startValue, setStarted }: Props) {
  const [count, setCount] = useState(startValue / 1000);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (count - 1 === 0) {
        setStarted(true);
        return;
      }

      setCount((cur) => cur - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count, setStarted]);

  return (
    <div className="overlay">
      <div className="countdown-text">{count}</div>
    </div>
  );
}
