import React, { useEffect } from "react";
import { Alert } from "../../../classes/Alert";
import { AlertType } from "../../../enums";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeOldestAlert } from "../../../redux/slices/alerts-slice";
import AlertElement from "./AlertElement";

function Alerts() {
  const { alerts } = useAppSelector((state) => state.alerts);
  const dispatch = useAppDispatch();
  const alertsToDisplay: React.ReactElement[] = [
    // <AlertElement
    //   message="Battle School is in alpha. All accounts are likely to be deleted upon the first beta release. Please report any issues here: https://github.com/SnowdenWintermute/lucella/issues  Server : Welcome to battle-room-chat."
    //   type={AlertType.SUCCESS}
    //   id={1}
    // />,
    // <AlertElement message="alert" type={AlertType.SUCCESS} id={1} />,
    // <AlertElement message="Battle School is in alpha. All accounts are likely to be deleted" type={AlertType.DANGER} id={1} />,
  ];
  if (alerts.length) {
    alerts.forEach((alert: Alert) => {
      const { message, type, id } = alert;
      alertsToDisplay.push(<AlertElement message={message} type={type} key={id} id={id} />);
    });
  }

  function handleKeyPress(e: KeyboardEvent) {
    const { key } = e;
    if (key === "Escape" || key === "Esc") dispatch(removeOldestAlert());
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  return <ul className="alerts-holder">{alertsToDisplay}</ul>;
}

export default Alerts;
