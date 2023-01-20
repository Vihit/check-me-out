import { config } from "./config";
import "./AuditTrailWindow.css";
import { useState } from "react";
import AuditTrailStrip from "./AuditTrailStrip";

function AuditTrailWindow(props) {
  const [showAuditTrailWindow, setShowAuditTrailWindow] = useState(false);

  function handleClicked() {
    setShowAuditTrailWindow(!showAuditTrailWindow);
  }

  return (
    <div
      className={
        "audit-window " + (showAuditTrailWindow ? "" : "slide-handle ")
      }
    >
      <div
        className={"handle " + (showAuditTrailWindow ? "shadow" : "normal")}
        onClick={handleClicked}
      >
        Audit Trail
      </div>
      <div className={"audits " + (showAuditTrailWindow ? "" : "")}>
        {props.auditTrails
          .sort((a, b) => a.id - b.id)
          .map((val, idx) => {
            return <AuditTrailStrip auditTrail={val}></AuditTrailStrip>;
          })}
      </div>
    </div>
  );
}

export default AuditTrailWindow;
