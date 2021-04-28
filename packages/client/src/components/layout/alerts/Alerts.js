import React from "react";
import { useSelector } from "react-redux";
import Alert from "./Alert";

const Alerts = () => {
  const alerts = useSelector((state) => state.alert);

  const alertsToDisplay = [];
  if (alerts.length) {
    alerts.forEach((alert) => {
      alertsToDisplay.push(
        <Alert
          alertMsg={alert.msg}
          alertType={alert.alertType}
          key={alert.msg}
          id={alert.id}
        />,
      );
    });
  }

  return <ul className="alerts-holder">{alertsToDisplay}</ul>;
};

export default Alerts;
