import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { ReactComponent as DangerIcon } from "../../../img/alertIcons/danger.svg";
import { ReactComponent as SuccessIcon } from "../../../img/alertIcons/success.svg";

import { clearAlert } from "../../../store/actions/alert";

const Alert = ({ alertMsg = "undefined alert message", alertType, id }) => {
  const dispatch = useDispatch();
  const [animateClass, setAnimateClass] = useState("");

  useEffect(() => {
    setTimeout(() => setAnimateClass("alert-animate"), 1);
  }, []);

  const alertIcon =
    alertType === "danger" ? (
      <DangerIcon className="alert-icon"></DangerIcon>
    ) : (
      <SuccessIcon className="alert-icon"></SuccessIcon>
    );

  const removeAlert = (id) => {
    dispatch(clearAlert(id));
  };

  return (
    <li
      className={`alert alert-${alertType} ${animateClass}`}
      onClick={(e) => removeAlert(id)}
    >
      {alertIcon}
      {alertMsg}
    </li>
  );
};

Alert.propTypes = {
  alertMsg: PropTypes.string.isRequired,
  alertType: PropTypes.string,
};

export default Alert;
