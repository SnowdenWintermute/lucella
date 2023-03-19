import React, { useEffect, useRef } from "react";
import DangerIcon from "../../../img/alert-icons/danger.svg";
import SuccessIcon from "../../../img/alert-icons/success.svg";
import { AlertType } from "../../../enums";
import { useAppDispatch } from "../../../redux/hooks";
import { clearAlert } from "../../../redux/slices/alerts-slice";
import { defaultAlertTimeout } from "../../../consts";
import styles from "./alerts.module.scss";

interface Props {
  message: string;
  type: AlertType;
  id: number | null;
}

function AlertElement({ message, type, id }: Props) {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<NodeJS.Timer | null>(null);

  if (!id) return <span>Error, the alert was not provided an Id. Please report this issue on GitHub.</span>;

  useEffect(() => {
    timeoutRef.current = setTimeout(() => dispatch(clearAlert(id)), defaultAlertTimeout);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const alertIcon =
    type === AlertType.DANGER ? (
      <DangerIcon className={`${styles["alert__icon"]} ${styles["alert__icon--danger"]}`} />
    ) : (
      <SuccessIcon className={`${styles["alert__icon"]} ${styles["alert__icon--success"]}`} />
    );

  const removeAlert = () => {
    dispatch(clearAlert(id));
  };

  return (
    <li role="status" data-cy="alert-element" className={styles["alert__item"]}>
      <button type="button" className={`${styles["alert__button"]}`} onClick={removeAlert}>
        <div className={styles["alert__icon-container"]}>{alertIcon}</div>
        <span className={styles["alert__message-text"]}>{message}</span>
      </button>
    </li>
  );
}

export default AlertElement;
