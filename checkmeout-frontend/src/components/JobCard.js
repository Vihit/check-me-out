import "./JobCard.css";
import React, { useEffect } from "react";

function JobCard(props) {
  useEffect(() => {
    console.log();
  }, []);

  function compareJobLogStageWise(a, b) {
    if (a.stageId < b.stageId) {
      return -1;
    } else if (a.stageId > b.stageId) {
      return 1;
    } else {
      if (a.taskId < b.taskId) {
        return -1;
      } else if (a.taskId > b.taskId) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  function compareJobLogUpdateWise(a, b) {
    if (a.updateDt < b.updateDt) {
      return -1;
    } else if (a.updateDt > b.updateDt) {
      return 1;
    } else {
      return 0;
    }
  }

  function calcGradient() {
    let completed = props.job.jobLogs.filter(
      (jl) => jl.completedOn !== null
    ).length;
    let total = props.job.jobLogs.length;
    let finalGrad = "";
    for (let i = 0; i < total; i++) {
      if (i < completed) finalGrad = finalGrad + ",#00cfa0";
      else finalGrad = finalGrad + ",#EFEFEF";
    }
    return finalGrad;
  }
  return (
    <div className="job-card">
      <div className="cl-details">
        <div className="cl-card-id">#{props.job.id}</div>
        <div className="job-card-name">
          {props.job.checklist.name}
          {" For "} <i>{props.job.equipmentName}</i>
        </div>
        {/* <div className="job-card-name">{" For " + props.job.equipmentName}</div> */}
        <div className="job-card-sub-detail margin-top">
          Next pending task for
          <b>
            {" " +
              props.job.jobLogs
                .filter((jl) => jl.completedOn === null)
                .sort(compareJobLogStageWise)[0].user.username}
          </b>
        </div>
        <div className="job-card-sub-detail">
          Last updated by{" "}
          <b>
            {" " +
              props.job.jobLogs.sort(compareJobLogUpdateWise)[
                props.job.jobLogs.length - 1
              ].updatedBy}
          </b>{" "}
          {" at "}{" "}
          <b>
            {" "}
            {
              props.job.jobLogs.sort(compareJobLogUpdateWise)[
                props.job.jobLogs.length - 1
              ].updateDt
            }
          </b>
        </div>
        <div className="prog-bar-flex">
          <div
            className="prog-bar"
            style={{
              backgroundImage:
                "linear-gradient(to right" + calcGradient() + ")",
            }}
          >
            {props.job.jobLogs.filter((jl) => jl.completedOn !== null).length}{" "}
            of {props.job.jobLogs.length} tasks completed
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
