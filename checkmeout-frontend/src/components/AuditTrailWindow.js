import { config } from "./config";
import "./AuditTrailWindow.css";
import { useState } from "react";
import AuditTrailStrip from "./AuditTrailStrip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function AuditTrailWindow(props) {
  const [showAuditTrailWindow, setShowAuditTrailWindow] = useState(false);

  function handleClicked() {
    setShowAuditTrailWindow(!showAuditTrailWindow);
  }

  function downloadAT() {
    const input = document.getElementById("audit-window");
    const audits = document.getElementsByClassName("audits");

    const auditStrips = document.getElementsByClassName(
      "audit-strip-act hidden-strip"
    );
    const downloads = document.getElementsByClassName("download-at");
    for (let download of downloads) {
      download.classList.add("close-flex");
    }
    for (let item of audits) {
      item.classList.remove("height-limit");
    }
    for (let item of auditStrips) {
      item.classList.remove("close-flex");
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let pdf = null;
      if (canvas.width > canvas.height) {
        pdf = new jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: [canvas.width, canvas.height],
        });
      } else {
        pdf = new jsPDF({
          orientation: "potrait",
          unit: "pt",
          format: [canvas.width, canvas.height],
        });
      }
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      var file = "Audit_trail_job_" + props.jobId + ".pdf";
      pdf.save(file);
    });
    for (let item of audits) {
      item.classList.add("height-limit");
    }

    for (let item of auditStrips) {
      item.classList.add("close-flex");
    }
    for (let download of downloads) {
      download.classList.remove("close-flex");
    }
  }

  return (
    <div
      className={
        "audit-window " + (showAuditTrailWindow ? "" : "slide-handle ")
      }
      id="audit-window"
    >
      <div
        className={"handle " + (showAuditTrailWindow ? "shadow" : "normal")}
        onClick={handleClicked}
      >
        Audit Trail
      </div>
      <div
        className={"audits height-limit " + (showAuditTrailWindow ? "" : "")}
      >
        <div className="download-at" onClick={downloadAT}>
          <button>Download</button>
        </div>
        {props.auditTrails
          .sort((a, b) => a.id - b.id)
          .map((val, idx) => {
            return (
              <AuditTrailStrip auditTrail={val} key={idx}></AuditTrailStrip>
            );
          })}
      </div>
    </div>
  );
}

export default AuditTrailWindow;
