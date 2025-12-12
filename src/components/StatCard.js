import React from "react";
import PropTypes from "prop-types";

const StatCard = ({ icon, label, value, subtext }) => (
  <div className="StatCard">
    <div className="StatCard-icon">{icon}</div>
    <div className="StatCard-content">
      <div className="StatCard-value">{value}</div>
      <div className="StatCard-label">{label}</div>
      {subtext && <div className="StatCard-subtext">{subtext}</div>}
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtext: PropTypes.string
};

export default StatCard;
