import "./JobExecution.css";
import React, { useContext, useState } from "react";
import Stage from "./Stage";
import ExecutionStage from "./ExecutionStage";
import JobContext from "../context/JobContext";

function JobExecution(props) {
  let jobCtx = useContext(JobContext);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [stages, setStages] = useState(
    JSON.parse(jobCtx.job.checklist.template)["stages"].map((val, idx) => {
      if (val !== null)
        return (
          <ExecutionStage
            key={idx + 1}
            number={idx + 1}
            stage={val}
          ></ExecutionStage>
        );
    })
  );

  function compareJobLogUpdateWise(a, b) {
    if (a.updateDt < b.updateDt) {
      return 1;
    } else if (a.updateDt > b.updateDt) {
      return -1;
    } else {
      return 0;
    }
  }

  return (
    <div className="checklist-detailed-container">
      <div className={"notification" + (alert ? "" : " notification-hidden")}>
        <div>{alertContent}</div>
      </div>
      <div className="exec-detail-section">
        <div className="job-name">
          #{jobCtx.job.id + " " + jobCtx.job.checklist.name + " For "}
          <i>{jobCtx.job.equipmentName}</i>
        </div>
        <div className="exec-small-detail">
          Last updated by{" "}
          {jobCtx.job.jobLogs.sort(compareJobLogUpdateWise)[0].updatedBy} at{" "}
          {jobCtx.job.jobLogs.sort(compareJobLogUpdateWise)[0].updateDt}
        </div>
      </div>
      <div className="stg-area">
        {stages.map((val, idx) => {
          return val;
        })}{" "}
      </div>
    </div>
  );
}

export default JobExecution;
