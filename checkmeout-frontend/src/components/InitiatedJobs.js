import React, { useContext, useEffect, useState } from "react";
import JobContext from "../context/JobContext";
import { config } from "./config";
import "./InitiatedJobs.css";
import JobCard from "./JobCard";

function InitiatedJobs() {
  let jobCtx = useContext(JobContext);
  const [pendingToggle, setPendingToggle] = useState(false);
  const [completedToggle, setCompletedToggle] = useState(false);
  let jobs = jobCtx.jobs;

  return (
    <div className="created-checklists">
      <div className="page-header">
        <div>Jobs</div>
      </div>
      <div className="stage-header header-bg margin-top">
        <div className="clr-white">Pending</div>
        <div>
          <i
            className={
              "fa-solid fa-circle-chevron-down toggler clr-white " +
              (pendingToggle ? "animate-drawer" : "")
            }
            onClick={() => setPendingToggle(!pendingToggle)}
          ></i>
        </div>
      </div>
      <div
        className={
          "stage-task-container cont-bg " + (pendingToggle ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {jobs
            .filter((val) => val.completedOn === null)
            .map((val, idx) => {
              return <JobCard job={val} key={idx}></JobCard>;
            })}
        </div>
      </div>
      <div className="stage-header header-bg margin-top">
        <div className="clr-white">Completed</div>
        <div>
          <i
            className={
              "fa-solid fa-circle-chevron-down toggler clr-white " +
              (completedToggle ? "animate-drawer" : "")
            }
            onClick={() => setCompletedToggle(!completedToggle)}
          ></i>
        </div>
      </div>
      <div
        className={
          "stage-task-container  cont-bg-review " +
          (completedToggle ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {jobs
            .filter((val) => val.completedOn !== null)
            .map((val, idx) => {
              return <JobCard job={val} key={idx}></JobCard>;
            })}
        </div>
      </div>
    </div>
  );
}

export default InitiatedJobs;
