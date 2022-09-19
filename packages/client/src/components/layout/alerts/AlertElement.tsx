import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as DangerIcon } from "../../../img/alertIcons/danger.svg";
import { ReactComponent as SuccessIcon } from "../../../img/alertIcons/success.svg";
import { clearAlert } from "../../../store/actions/alert";
import { AlertType } from "../../../enums";

interface Props {
  message: string;
  type: AlertType;
  id: string;
}

const AlertElement = ({ message, type, id }: Props) => {
  if (!message) message = "undefined alert message";
  const dispatch = useDispatch();
  const [animateClass, setAnimateClass] = useState("");

  useEffect(() => {
    setTimeout(() => setAnimateClass("alert-animate"), 1);
  }, []);

  const alertIcon =
    type === AlertType.DANGER ? (
      <DangerIcon className="alert-icon"></DangerIcon>
    ) : (
      <SuccessIcon className="alert-icon"></SuccessIcon>
    );

  const removeAlert = (id: string) => {
    dispatch(clearAlert(id));
  };

  return (
    <li className={`alert alert-${type} ${animateClass}`} onClick={(e) => removeAlert(id)}>
      {alertIcon}
      {message}
    </li>
  );
};

export default AlertElement;
