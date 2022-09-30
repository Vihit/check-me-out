import "./ExecutionChecklistActivity.css";
import React, { useContext, useState } from "react";
import JobContext from "../context/JobContext";
import { config } from "./config";

function ExecutionChecklistActivity(props) {
  let jobCtx = useContext(JobContext);
  let taskLogId = jobCtx.job.jobLogs.filter(
    (jl) => jl.stageId === props.stageNo && jl.taskId === props.taskNo
  )[0].id;
  let taskActivity = JSON.parse(
    jobCtx.job.jobLogs.filter(
      (jl) => jl.stageId === props.stageNo && jl.taskId === props.taskNo
    )[0].taskActivity
  )[props.id];

  function handleChecklist(clData, idx) {
    if (taskActivity.filter((ta) => ta.actionOn === clData).length > 0) {
      taskActivity.filter((ta) => ta.actionOn === clData)[
        taskActivity.filter((ta) => ta.actionOn === clData).length - 1
      ].action === "checked"
        ? updateTaskActivity({ action: "unchecked", actionOn: clData })
        : updateTaskActivity({
            action: "checked",
            actionOn: clData,
          });
    } else {
      updateTaskActivity({ action: "checked", actionOn: clData });
    }
  }

  function updateTaskActivity(tA) {
    const req = {
      jobId: jobCtx.job.id,
      jobLogId: taskLogId,
      taskActivityId: props.id,
      taskActivity: tA,
    };
    fetch(config.apiUrl + "joblog/task-activity/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
      body: JSON.stringify(req),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Some error occurred!");
      })
      .then((actualData) => {
        jobCtx.setJob(actualData);
        jobCtx.setJobs(jobCtx.job.id, actualData);
      })
      .catch(function (error) {
        console.log("Some error occurred!", error);
      });
  }

  return (
    <div className="exec-checklist-act-container">
      {props.checklist.checklistData.map((val, idx) => {
        return (
          <div
            key={idx}
            className="checklist-with-delete"
            onClick={() => handleChecklist(val, idx)}
          >
            <div
              className={
                "checklist " +
                (taskActivity.filter((ta) => ta.actionOn === val).length > 0
                  ? taskActivity.filter((ta) => ta.actionOn === val)[
                      taskActivity.filter((ta) => ta.actionOn === val).length -
                        1
                    ].action === "checked"
                    ? "checked-cl"
                    : ""
                  : "")
              }
            >
              <input
                type="checkbox"
                checked={
                  taskActivity.filter((ta) => ta.actionOn === val).length > 0
                    ? taskActivity.filter((ta) => ta.actionOn === val)[
                        taskActivity.filter((ta) => ta.actionOn === val)
                          .length - 1
                      ].action === "checked"
                    : false
                }
                onChange={(e) => handleChecklist(val, idx)}
              ></input>
              {val}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExecutionChecklistActivity;
