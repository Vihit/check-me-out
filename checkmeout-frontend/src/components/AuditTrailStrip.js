import { config } from "./config";
import "./AuditTrailStrip.css";
import { useEffect, useState } from "react";

function AuditTrailStrip(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let date = new Date();
    date.setTime(Date.parse(props.auditTrail.auditDt));
    setDate(date);
  });

  return (
    <div className="audit-strip">
      <div className="audit-time">{date.toLocaleString()}</div>
      <div className="audit-lines">
        <div className="audit-line1"></div>
        <div className="audit-line2"></div>
      </div>
      <div className="audit-graphic">
        {props.auditTrail.action === "CREATED" && (
          <div className="audit-icon">
            <div className="at-icon">
              <i class="fa-solid fa-plus"></i>
            </div>
          </div>
        )}
        {props.auditTrail.action === "STARTED" && (
          <div className="audit-icon" style={{ backgroundColor: "#f4444b" }}>
            <div className="at-icon">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
        )}
        {props.auditTrail.action === "ACTED" && (
          <div className="audit-icon" style={{ backgroundColor: "#f5c53d" }}>
            <div className="at-icon">
              <i class="fa-solid fa-fingerprint"></i>
            </div>
          </div>
        )}
        {props.auditTrail.action === "COMMENTED" && (
          <div className="audit-icon" style={{ backgroundColor: "#f69292" }}>
            <div className="at-icon">
              <i class="fa-solid fa-comment"></i>
            </div>
          </div>
        )}
        {props.auditTrail.action === "ACTED ON JOB" && (
          <div className="audit-icon" style={{ backgroundColor: "#81cdc8" }}>
            <div className="at-icon">
              <i class="fa-solid fa-list-check"></i>
            </div>
          </div>
        )}
        {props.auditTrail.action === "COMPLETED" && (
          <div className="audit-icon" style={{ backgroundColor: "#9a5581" }}>
            <div className="at-icon">
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
        )}

        <div className="audit-log">
          <div className="audit-un">{props.auditTrail.userName}</div>
          {props.auditTrail.action.toLowerCase() +
            " " +
            props.auditTrail.newState}
        </div>
      </div>
    </div>
  );
}

export default AuditTrailStrip;
