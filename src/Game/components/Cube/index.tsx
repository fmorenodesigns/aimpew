import "./styles.scss";

import React, { useMemo } from "react";

export interface CubeColors {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  front?: string;
  back?: string;
}

interface Props {
  width: number;
  depth: number;
  height: number;
  colors: CubeColors | string;
  borderColor?: string;
}

export default function Cube({
  width,
  depth,
  height,
  colors,
  borderColor,
}: Props) {
  const boxShadow = useMemo(
    () => (borderColor ? `inset 0 0 0 1px ${borderColor}` : undefined),
    [borderColor]
  );

  return (
    <div className="cube-container">
      <div
        className="cube"
        style={{
          width,
          height,
          transformOrigin: `center center -${depth / 2}px`,
        }}
      >
        <CubeFace
          face="front"
          width={width}
          height={height}
          backgroundColor={typeof colors === "string" ? colors : colors.front}
          boxShadow={boxShadow}
        />
        <CubeFace
          face="back"
          width={width}
          height={height}
          backgroundColor={typeof colors === "string" ? colors : colors.back}
          boxShadow={boxShadow}
        />
        <CubeFace
          face="left"
          width={depth}
          height={height}
          backgroundColor={typeof colors === "string" ? colors : colors.left}
          boxShadow={boxShadow}
        />
        <CubeFace
          face="right"
          width={depth}
          height={height}
          backgroundColor={typeof colors === "string" ? colors : colors.right}
          boxShadow={boxShadow}
        />
        <CubeFace
          face="top"
          width={width}
          height={depth}
          backgroundColor={typeof colors === "string" ? colors : colors.top}
          boxShadow={boxShadow}
        />
        <CubeFace
          face="bottom"
          width={width}
          height={depth}
          backgroundColor={typeof colors === "string" ? colors : colors.bottom}
          boxShadow={boxShadow}
        />
      </div>
    </div>
  );
}

interface CubeFaceProps {
  face: string;
  width: number;
  height: number;
  backgroundColor?: string;
  boxShadow?: string;
}

export function CubeFace({
  face,
  width,
  height,
  backgroundColor,
  boxShadow,
}: CubeFaceProps) {
  return backgroundColor ? (
    <div
      className={`face ${face}`}
      style={{
        width,
        height,
        backgroundColor,
        boxShadow,
      }}
    />
  ) : null;
}
