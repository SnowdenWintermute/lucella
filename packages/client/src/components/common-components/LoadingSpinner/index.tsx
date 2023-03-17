import React from "react";
import styles from "./loading-spinner.module.scss";

export default function LoadingSpinner({ extraStyles = "" }: { extraStyles?: string }) {
  return <div className={`${styles["loading-spinner"]} ${extraStyles}`} />;
}
