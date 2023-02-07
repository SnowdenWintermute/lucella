/* eslint-disable react/require-default-props */
import React from "react";
import styles from "./circular-progress.module.scss";

// type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

// type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type Props = {
  percentage: number;
  rotateAnimation?: boolean;
};

export default function CircularProgress({ percentage, rotateAnimation }: Props) {
  const outerDiameter = 20;
  const thickness = 5;
  const radius = outerDiameter / 2;
  const dashArray = 2 * Math.PI * radius;
  const percentHidden = 100 - percentage;
  const strokeDashoffset = (dashArray / 100) * percentHidden;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={outerDiameter}
      height={outerDiameter}
      strokeDasharray={dashArray}
      strokeDashoffset={strokeDashoffset}
      strokeWidth={thickness}
      className={`${styles.circle} ${rotateAnimation && styles["circle-animate"]}`}
    >
      <circle cx={radius} cy={radius} r={radius} />
    </svg>
  );
}
