import React, { useEffect, useState } from "react";
import DangerIcon from "../../../img/alertIcons/danger.svg";
import SuccessIcon from "../../../img/alertIcons/success.svg";
import { AlertType } from "../../../enums";
import { useAppDispatch } from "../../../redux";
import { clearAlert } from "../../../redux/slices/alerts-slice";
import { defaultAlertTimeout } from "../../../consts";
import styles from "./alerts.module.scss";

interface Props {
  message: string;
  type: AlertType;
  id: string;
}

const AlertElement = ({ message, type, id }: Props) => {
  if (!message) message = "undefined alert message";
  const dispatch = useAppDispatch();
  const [animateClass, setAnimateClass] = useState("");

  useEffect(() => {
    setTimeout(() => setAnimateClass("alert-animate"), 1);
    setTimeout(() => dispatch(clearAlert(id)), defaultAlertTimeout);
  }, []);

  const alertIcon =
    type === AlertType.DANGER ? (
      <DangerIcon className={styles["alert-icon"]}></DangerIcon>
    ) : (
      <SuccessIcon className={styles["alert-icon"]}></SuccessIcon>
    );

  const removeAlert = (id: string) => {
    dispatch(clearAlert(id));
  };

  return (
    <li
      className={`${styles.alert} ${styles[`alert-${type.toLowerCase()}`]} ${animateClass ? styles[animateClass] : ""}`}
      onClick={(e) => removeAlert(id)}
    >
      {alertIcon}
      {message}
    </li>
  );
};

export default AlertElement;
