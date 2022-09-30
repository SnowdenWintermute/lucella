import React from "react";
import { Alert } from "../../../classes/Alert";
import { useAppSelector } from "../../../redux";
import AlertElement from "./AlertElement";

const Alerts = () => {
  const { alerts } = useAppSelector((state) => state.alerts);

  const alertsToDisplay: React.ReactElement[] = [];
  if (alerts.length) {
    alerts.forEach((alert: Alert) => {
      const { message, type, id } = alert;
      alertsToDisplay.push(<AlertElement message={message} type={type} key={id} id={id} />);
    });
  }

  return <ul className="alerts-holder">{alertsToDisplay}</ul>;
};

export default Alerts;
