import { config } from "./config";
import "./AuditTrailStrip.css";
import { useEffect, useState } from "react";

function AuditTrailStrip(props) {
  return (
    <div
      className={
        props.auditTrail.action === "ACTED_ON_TASK"
          ? "audit-strip-act hidden-strip close-flex"
          : "audit-strip"
      }
    >
      <div className="audit-date">
        {new Date(Date.parse(props.auditTrail.auditDt)).toLocaleDateString()}
      </div>
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
        {props.auditTrail.action === "ACTED_ON_TASK" && <div></div>}
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

        {props.auditTrail.action === "ACTED_ON_TASK" && (
          <div className="audit-log-act">
            <div className="audit-message">
              <div className="audit-un">{props.auditTrail.userName}</div>

              {props.auditTrail.newState.split("|")[0]}
            </div>
            <div className="audit-time">
              <div>
                {new Date(
                  Date.parse(props.auditTrail.auditDt)
                ).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
        {props.auditTrail.action !== "ACTED_ON_TASK" && (
          <div className="audit-log">
            <div className="audit-message">
              <div className="audit-un">{props.auditTrail.userName}</div>

              {props.auditTrail.action.toLowerCase() +
                " " +
                props.auditTrail.newState.split("|")[0]}
            </div>
            <div className="audit-time">
              <div>
                {new Date(
                  Date.parse(props.auditTrail.auditDt)
                ).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditTrailStrip;
