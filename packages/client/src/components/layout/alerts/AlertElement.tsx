import React, { useEffect, useRef } from "react";
import DangerIcon from "../../../img/alert-icons/danger.svg";
import SuccessIcon from "../../../img/alert-icons/success.svg";
import { AlertType } from "../../../enums";
import { useAppDispatch } from "../../../redux/hooks";
import { clearAlert } from "../../../redux/slices/alerts-slice";
import { defaultAlertTimeout } from "../../../consts";
import { ARIA_LABELS } from "../../../consts/aria-labels";

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
    timeoutRef.current = setTimeout(() => dispatch(clearAlert(id)), defaultAlertTimeout + message.length * 25);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const alertIcon =
    type === AlertType.DANGER ? <DangerIcon className="alert__icon alert__icon--danger" /> : <SuccessIcon className="alert__icon alert__icon--success" />;

  const removeAlert = () => {
    dispatch(clearAlert(id));
  };

  return (
    <li role="status" aria-label={ARIA_LABELS.ALERT} className="alert__item">
      <button type="button" className="alert__button" onClick={removeAlert}>
        <div className="alert__icon-container">{alertIcon}</div>
        <span className="alert__message-text">{message}</span>
      </button>
    </li>
  );
}

export default AlertElement;
