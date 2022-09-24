import { useHistory } from "react-router-dom";
import "./RoundStat.css";
import React from "react";

function RoundStat(props) {
  let history = useHistory();
  function navigate(link) {
    history.push(link);
  }
  return (
    <div className="stat-container" onClick={() => navigate(props.link)}>
      <div className="round-stat" style={{ backgroundColor: props.color }}>
        {props.value}
      </div>
      <div className="stat-label">{props.label}</div>
    </div>
  );
}

export default RoundStat;
