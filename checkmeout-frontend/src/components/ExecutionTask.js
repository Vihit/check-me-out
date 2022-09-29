import "./ExecutionTask.css";
import React, { useContext, useEffect, useState } from "react";
import Task from "./Task";
import ExecutionChecklistActivity from "./ExecutionChecklistActivity";
import { config } from "./config";
import dateFormat from "dateformat";
import JobContext from "../context/JobContext";

function ExecutionTask(props) {
  let jobCtx = useContext(JobContext);
  // let taskJson =
  //   jobCtx.job.job.stages[props.stageNumber].tasks[props.number - 1];
  let taskLog = jobCtx.job.jobLogs.filter(
    (jl) => jl.stageId === props.stageNo && jl.taskId === props.number
  )[0];
  const [newComment, setNewComment] = useState("");
  const [showESign, setShowESign] = useState(false);
  const [esignPwd, setESignPwd] = useState("");
  const [esigned, setESigned] = useState(false);
  const [activities, setActivities] = useState(
    props.task.activities.map((val, idx) => {
      if (val !== null)
        if (val.type === "checklist") {
          return (
            <ExecutionChecklistActivity
              key={idx}
              id={idx}
              checklist={val}
            ></ExecutionChecklistActivity>
          );
        }
    })
  );
  const [taskAssignee, setTaskAssignee] = useState(taskLog.user);
  let comments = JSON.parse(taskLog.comments);

  function cancelESign() {
    setESignPwd("");
    setShowESign(false);
    setESigned(false);
  }

  function esign() {
    verifyESign();
  }

  function startTask() {
    if (!esigned) setShowESign(true);
    else {
      beginEndTask("BEGIN");
      setESigned(false);
    }
  }

  function endTask() {
    if (!esigned) setShowESign(true);
    else {
      beginEndTask("END");
      setESigned(false);
    }
  }
  function addComment() {
    const cmt = {
      user: JSON.parse(localStorage.getItem("user"))["sub"],
      comment: newComment,
    };
    setNewComment("");
    updateComments(cmt);
  }

  function verifyESign() {
    var formBody = [];
    formBody.push(
      encodeURIComponent("username") +
        "=" +
        encodeURIComponent(JSON.parse(localStorage.getItem("user"))["sub"])
    );
    formBody.push(
      encodeURIComponent("password") + "=" + encodeURIComponent(esignPwd)
    );
    formBody = formBody.join("&");
    fetch(config.apiUrl + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      body: formBody,
    }).then((response) => {
      if (response.ok) {
        setESigned(true);
        setShowESign(false);
        setESignPwd("");
      } else throw new Error("Login Unsuccessful!");
    });
  }

  function updateComments(comment) {
    const req = {
      jobId: jobCtx.job.id,
      jobLogId: props.taskLog.id,
      comment: comment,
    };
    fetch(config.apiUrl + "joblog/comments/", {
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

  function beginEndTask(what) {
    const req = {
      jobId: jobCtx.job.id,
      jobLogId: taskLog.id,
      startedOn:
        what === "BEGIN"
          ? dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
          : taskLog.startedOn,
      completedOn:
        what === "END" ? dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") : null,
    };
    fetch(config.apiUrl + "joblog/start-stop/", {
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

  function generateColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  }

  return (
    <div
      className={
        "exec-task-container " +
        (taskLog.completedOn !== null ? "disabled-task" : "")
      }
    >
      <div className="execution-assignee-container">
        <div className="exec-assignee">
          {taskAssignee.first_name.charAt(0).toUpperCase() +
            taskAssignee.last_name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="exec-act-task-container">
        <div className="exec-task-id">
          <div>Task {taskLog.stageId + "." + taskLog.taskId}</div>
          {props.task.checkpoint && (
            <div>
              <i className="fa-sharp fa-solid fa-check-double cp-exec"></i>
            </div>
          )}
        </div>
        <div className="full-width">
          <input
            type="text"
            placeholder="Name of the task"
            value={props.task.name}
          ></input>
        </div>
        {props.task.timed.isTimed && (
          <div className="full-width imp-tsk-msg">
            <i class="fa-sharp fa-solid fa-exclamation imp-tsk-info"></i>
            {props.task.timed.timeAct === "min" &&
              "This task needs to be in progress for minimum of " +
                props.task.timed.timeVal +
                " " +
                props.task.timed.timeUnit}
            {props.task.timed.timeAct === "max" &&
              "This task needs to be completed within " +
                props.task.timed.timeVal +
                " " +
                props.task.timed.timeUnit}
          </div>
        )}
        <div className="exec-activity-container">
          {activities.map((val, idx) => {
            return val;
          })}
        </div>
      </div>
      <div className="exec-button-container">
        <div>
          <i
            className={
              "fa-solid fa-play " +
              (taskLog.startedOn === null ? "play" : "play-disabled")
            }
            onClick={startTask}
          ></i>
        </div>
        <div>
          <i
            className={
              "fa-solid fa-stop " +
              (taskLog.completedOn === null && taskLog.startedOn !== null
                ? "stop"
                : "stop-disabled")
            }
            onClick={endTask}
          ></i>
        </div>
      </div>
      <div className="misc-container">
        <div className="task-prog-container">
          <ul>
            {taskLog.startedOn !== null && (
              <li>
                {"Task started by "}
                <b>{taskAssignee.first_name}</b> {" at " + taskLog.startedOn}
              </li>
            )}
            {taskLog.completedOn !== null && (
              <li>
                {"Task completed by "}
                <b>{taskAssignee.first_name}</b> {" at " + taskLog.completedOn}
              </li>
            )}
          </ul>
        </div>
        <div className="task-comment-container">
          <div className="comments">
            <div className="comments-header">Comments</div>
            {comments.map((cmt, idx) => {
              return (
                <div className="act-comments">
                  <b
                    style={{
                      color: generateColor(cmt.user),
                    }}
                  >
                    <i>{cmt.user + ":"}</i>
                  </b>{" "}
                  {cmt.comment}
                </div>
              );
            })}
          </div>
          <div className="comment-input">
            <input
              className="comm"
              type="text"
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></input>
            <i
              class="fa-sharp fa-solid fa-square-check"
              onClick={addComment}
            ></i>
            <i
              class="fa-sharp fa-solid fa-square-xmark"
              onClick={() => setNewComment("")}
            ></i>
          </div>
        </div>
      </div>
      <div className={"esign-modal " + (showESign ? " " : " close-flex")}>
        <div className="create-job-header">
          <div className="flex-row-title">
            <i class="fa-solid fa-signature new-job-icon"></i>
            <div className="new-job-head">E-Sign</div>
          </div>
          <div className="new-job-input">
            <div className="new-job-label">Password</div>
            <div className="new-job-ta">
              <input
                type="password"
                value={esignPwd}
                onChange={(e) => setESignPwd(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="flex-row-title">
            <div className="btn-save" onClick={esign}>
              E-Sign
            </div>
            <div className="btn-cancel" onClick={cancelESign}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutionTask;
