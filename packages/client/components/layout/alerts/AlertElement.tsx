import React, { useEffect, useRef, useState } from "react";
import DangerIcon from "../../../img/alertIcons/danger.svg";
import SuccessIcon from "../../../img/alertIcons/success.svg";
import { AlertType } from "../../../enums";
import { useAppDispatch } from "../../../redux/hooks";
import { clearAlert } from "../../../redux/slices/alerts-slice";
import { defaultAlertTimeout } from "../../../consts";
import styles from "./alerts.module.scss";

interface Props {
  message: string;
  type: AlertType;
  id: string;
}

function AlertElement({ message, type, id }: Props) {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => dispatch(clearAlert(id)), defaultAlertTimeout);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const alertIcon = type === AlertType.DANGER ? <DangerIcon className={styles["alert-icon"]} /> : <SuccessIcon className={styles["alert-icon"]} />;

  const removeAlert = () => {
    dispatch(clearAlert(id));
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li role="status" data-cy="alert-element" className={`${styles.alert} ${styles[`alert-${type.toLowerCase()}`]}`} onClick={removeAlert}>
      {alertIcon}
      {message}
    </li>
  );
}

export default AlertElement;
