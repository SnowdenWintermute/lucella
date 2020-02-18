import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { ReactComponent as DangerIcon } from "../../../img/alertIcons/danger.svg";
import { ReactComponent as SuccessIcon } from "../../../img/alertIcons/success.svg";

const Alert = ({ alertMsg = "undefined alert message", alertType }) => {
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

  return (
    <li className={`alert alert-${alertType} ${animateClass}`}>
      {alertIcon}
      {alertMsg}
    </li>
  );
};

Alert.propTypes = {
  alertMsg: PropTypes.string.isRequired,
  alertType: PropTypes.string
};

export default Alert;
