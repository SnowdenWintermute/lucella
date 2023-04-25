/* eslint-disable react/require-default-props */
import React, { useEffect, useRef, useState } from "react";

// type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

// type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type Props = {
  thickness: number;
  percentage: number;
  rotateAnimation?: boolean;
};

export default function CircularProgress({ thickness = 20, percentage, rotateAnimation }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [height, setHeight] = useState(1);

  useEffect(() => {
    if (svgRef.current?.clientHeight) setHeight(svgRef.current.clientHeight);
  }, [svgRef]);

  const radius = height / 2;
  const dashArray = 2 * Math.PI * radius;
  const percentHidden = 100 - percentage;
  const strokeDashoffset = (dashArray / 100) * percentHidden;
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`0 0 ${height} ${height}`}
      strokeDasharray={dashArray}
      strokeDashoffset={strokeDashoffset}
      strokeWidth={thickness}
      className={`circular-progress ${rotateAnimation && "circular-progress--animate"}`}
    >
      <circle cx={radius} cy={radius} r={radius} />
    </svg>
  );
}
