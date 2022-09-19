import React from "react";
import { useSelector } from "react-redux";
import { Alert } from "../../../classes/Alert";
import { RootState } from "../../../store";
import AlertElement from "./AlertElement";

const Alerts = () => {
  const alerts = useSelector((state: RootState) => state.alert);

  const alertsToDisplay: React.ReactElement[] = [];
  if (alerts.length) {
    alerts.forEach((alert: Alert) => {
      const { message, type, id } = alert;
      alertsToDisplay.push(<AlertElement message={message} type={type} key={message} id={id} />);
    });
  }

  return <ul className="alerts-holder">{alertsToDisplay}</ul>;
};

export default Alerts;
