import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "./Alert";

const Alerts = ({ alerts }) => {
  const alertsToDisplay = [];
  if (alerts.length) {
    alerts.forEach((alert) => {
      alertsToDisplay.push(
        <Alert
          alertMsg={alert.msg}
          alertType={alert.alertType}
          key={alert.msg}
          id={alert.id}
        />
      );
    });
  }

  return <ul className="alerts-holder">{alertsToDisplay}</ul>;
};

Alerts.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alerts);
