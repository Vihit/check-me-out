import "./JobExecution.css";
import React, { useContext, useEffect, useState } from "react";
import Stage from "./Stage";
import ExecutionStage from "./ExecutionStage";
import JobContext from "../context/JobContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AuditTrailWindow from "./AuditTrailWindow";
import { config } from "./config";

function JobExecution(props) {
  let jobCtx = useContext(JobContext);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [jobAT, setJobAT] = useState([]);
  const [jobLogAT, setJobLogAT] = useState([]);
  const [stages, setStages] = useState(
    JSON.parse(props.location.state.checklist.template)["stages"].map(
      (val, idx) => {
        if (val !== null) {
          console.log(val);
          return (
            <ExecutionStage
              key={idx + 1}
              number={idx + 1}
              stage={val}
            ></ExecutionStage>
          );
        }
      }
    )
  );
  const [job, setJob] = useState(props.location.state);
  useEffect(() => {
    if (JSON.stringify(jobCtx.job) === "{}") {
      jobCtx.setJob(props.location.state);
    }
    getAuditTrails(
      props.location.state.jobLogs.map((jl) => jl.id).join(","),
      "JOB_LOG"
    );
    getAuditTrails(props.location.state.id, "JOB");
  }, []);

  function compareJobLogUpdateWise(a, b) {
    if (a.updateDt < b.updateDt) {
      return 1;
    } else if (a.updateDt > b.updateDt) {
      return -1;
    } else {
      return 0;
    }
  }

  function printDocument() {
    const input = document.getElementById("checklist-detailed-container");
    const tasks = document.getElementsByClassName("exec-task-container");
    for (let item of tasks) {
      item.classList.remove("disabled-task");
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [1086, 720],
      });
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      console.log(width + " " + height);
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      // pdf.output('dataurlnewwindow');
      var file =
        (job.id + " " + job.checklist.name + " " + job.equipmentName)
          .replace(/\s+/g, "_")
          .toLowerCase() + ".pdf";
      pdf.save(file);
    });
    for (let item of tasks) {
      item.classList.add("disabled-task");
    }
  }

  function getAuditTrails(ids, type) {
    fetch(config.apiUrl + "audit-trail/?pkValues=" + ids + "&type=" + type, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Some error occurred!");
        }
      })
      .then((actualData) => {
        if (type === "JOB_LOG") setJobLogAT(actualData);
        else setJobAT(actualData);
      });
  }

  return (
    <div>
      {JSON.stringify(jobCtx.job) !== "{}" && (
        <div
          id="checklist-detailed-container"
          className="checklist-detailed-container"
        >
          <AuditTrailWindow
            auditTrails={jobAT.concat(jobLogAT)}
          ></AuditTrailWindow>
          <div
            className={"notification" + (alert ? "" : " notification-hidden")}
          >
            <div>{alertContent}</div>
          </div>

          <div className="exec-detail-section">
            <div className="job-name">
              #{job.id + " " + job.checklist.name + " For "}
              <i>{job.equipmentName}</i>
            </div>

            <div className="exec-small-detail">
              Last updated by{" "}
              {job.jobLogs.sort(compareJobLogUpdateWise)[0].updatedBy} at{" "}
              {job.jobLogs.sort(compareJobLogUpdateWise)[0].updateDt}
              {job.completedOn !== null && (
                <div>
                  <button className="download-btn" onClick={printDocument}>
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="stg-area">
            {stages.map((val, idx) => {
              return val;
            })}{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobExecution;
