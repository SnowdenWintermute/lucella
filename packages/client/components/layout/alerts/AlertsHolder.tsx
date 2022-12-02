import React from "react";
import { Alert } from "../../../classes/Alert";
import { useAppSelector } from "../../../redux/hooks";
import AlertElement from "./AlertElement";
import styles from "./alerts.module.scss";

const Alerts = () => {
  const { alerts } = useAppSelector((state) => state.alerts);

  const alertsToDisplay: React.ReactElement[] = [];
  if (alerts.length) {
    alerts.forEach((alert: Alert) => {
      const { message, type, id } = alert;
      alertsToDisplay.push(<AlertElement message={message} type={type} key={id} id={id} />);
    });
  }

  return <ul className={styles["alerts-holder"]}>{alertsToDisplay}</ul>;
};

export default Alerts;
