import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alerts = ({ alerts }) => {
  const alertsToDisplay = [];
  if (alerts.length) {
    alerts.forEach(alert => {
      const animateClass = alert.animating ? "alert-animate" : null;
      alertsToDisplay.push(
        <div
          className={`alert alert-${alert.alertType} ${animateClass}`}
          key={alert.msg}
        >
          {alert.msg}
        </div>
      );
    });
  }

  return <div className="alerts-holder">{alertsToDisplay}</div>;
};

Alerts.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alerts);
