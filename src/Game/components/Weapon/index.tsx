import { GameSettingsContext } from "../GameSettings/context";
import Gun from "./Gun";
import Syringe from "./Syringe";
import { useContext } from "react";

export const INITIAL_WEAPON_ROTATION = { horizontal: 10, vertical: -5 };

export type WeaponType = "gun" | "syringe";

export interface WeaponRotation {
  vertical: number;
  horizontal: number;
}

export interface WeaponProps {
  rotation: WeaponRotation;
  coiling: boolean;
  hasFlash: boolean;
}

export default function Weapon(props: WeaponProps) {
  const { gameSettings } = useContext(GameSettingsContext);

  return gameSettings.targetType !== "covid" ? (
    <Gun {...props} />
  ) : (
    <Syringe {...props} />
  );
}
