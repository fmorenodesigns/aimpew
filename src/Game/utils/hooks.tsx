import { RefObject, useMemo, useState } from "react";

// Adaptation of hook by https://usehooks.com/useLocalStorage/
export function useLocalStorage<S>(
  key: string,
  initialValue: S
): [S, (value: S) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: S) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function usePlayableArea(ref: RefObject<HTMLDivElement>) {
  return {
    playableAreaWidth: ref.current?.getBoundingClientRect().width || 0,
    playableAreaHeight: ref.current?.getBoundingClientRect().height || 0,
  };
}

export function useAudio() {
  const onFireSoundFx = useMemo(() => new Audio("./laserbeam.mp3"), []);
  const onHitSoundFx = useMemo(() => {
    const audio = new Audio("./hit.mp3");
    audio.volume = 0.2;
    return audio;
  }, []);

  return { onFireSoundFx, onHitSoundFx };
}

export function useQueryParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const queryParams = Object.fromEntries(urlSearchParams.entries());

  if (Object.keys(queryParams).length === 0) return undefined;

  return queryParams;
}
