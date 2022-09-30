import "./ExecutionTask.css";
import React, { useContext, useEffect, useState } from "react";
import Task from "./Task";
import ExecutionChecklistActivity from "./ExecutionChecklistActivity";
import { config } from "./config";
import dateFormat from "dateformat";
import JobContext from "../context/JobContext";

function ExecutionTask(props) {
  let jobCtx = useContext(JobContext);
  let stagesJson = JSON.parse(jobCtx.job.checklist.template).stages;
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
              stageNo={props.stageNo}
              taskNo={props.number}
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
  let disabled =
    (props.stageNo === 1 ||
      jobCtx.job.jobLogs
        .filter((jl) => jl.stageId === props.stageNo - 1)
        .filter((sl) => sl.completedOn === null).length === 0) &&
    jobCtx.job.jobLogs.filter(
      (jl) =>
        jl.stageId === props.stageNo &&
        jl.taskId < props.number &&
        jl.completedOn === null &&
        stagesJson[props.stageNo - 1].tasks[jl.taskId - 1].checkpoint
    ).length === 0
      ? false
      : true;

  const [hours, setHours] = useState("--");
  const [mins, setMins] = useState("--");
  const [secs, setSecs] = useState("--");
  const [triggerColor, setTriggerColor] = useState(false);
  const greenColor = props.task.timed.timeAct === "max" ? "#00CFA0" : "#e85151";
  const redColor = props.task.timed.timeAct === "min" ? "#00CFA0" : "#e85151";
  const [intervalFn, setIntervalFn] = useState();

  useEffect(() => {
    if (taskLog.startedOn !== null && taskLog.completedOn === null) {
      triggerClock(taskLog.startedOn);
    } else if (taskLog.startedOn !== null && taskLog.completedOn !== null) {
      const dateNow = new Date(taskLog.completedOn).getTime();
      const dateStarted = new Date(taskLog.startedOn).getTime();
      let delta = Math.abs(dateNow - dateStarted) / 1000;
      setHours(String(Math.floor(delta / 3600) % 24).padStart(2, "0"));
      setMins(String(Math.floor(delta / 60) % 60).padStart(2, "0"));
      setSecs(String(Math.floor(delta % 60)).padStart(2, "0"));
      if (props.task.timed.isTimed) {
        if (props.task.timed.timeUnit === "secs")
          setTriggerColor(
            Math.floor(delta % 60) - props.task.timed.timeVal >= 0
          );
        else if (props.task.timed.timeUnit === "mins")
          setTriggerColor(
            (Math.floor(delta / 60) % 60) - props.task.timed.timeVal >= 0
          );
        else
          setTriggerColor(
            (Math.floor(delta / 3600) % 24) - props.task.timed.timeVal >= 0
          );
      }
    }
  }, [taskLog.completedOn]);
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
      clearInterval(intervalFn);
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
    const dateVal = new Date();
    const req = {
      jobId: jobCtx.job.id,
      jobLogId: taskLog.id,
      startedOn:
        what === "BEGIN"
          ? dateFormat(dateVal, "yyyy-mm-dd HH:MM:ss")
          : taskLog.startedOn,
      completedOn:
        what === "END" ? dateFormat(dateVal, "yyyy-mm-dd HH:MM:ss") : null,
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
        if (what === "BEGIN")
          if (props.task.timed.isTimed) {
            triggerClock(dateVal);
          }
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

  function triggerClock(taskLogStartedOn) {
    const interval = setInterval(() => {
      const dateNow = new Date();
      const dateStarted = new Date(taskLogStartedOn).getTime();
      let delta = Math.abs(dateNow - dateStarted) / 1000;
      setHours(String(Math.floor(delta / 3600) % 24).padStart(2, "0"));
      setMins(String(Math.floor(delta / 60) % 60).padStart(2, "0"));
      setSecs(String(Math.floor(delta % 60)).padStart(2, "0"));
      if (props.task.timed.isTimed) {
        if (props.task.timed.timeUnit === "secs")
          setTriggerColor(
            Math.floor(delta % 60) - props.task.timed.timeVal >= 0
          );
        else if (props.task.timed.timeUnit === "mins")
          setTriggerColor(
            (Math.floor(delta / 60) % 60) - props.task.timed.timeVal >= 0
          );
        else
          setTriggerColor(
            (Math.floor(delta / 3600) % 24) - props.task.timed.timeVal >= 0
          );
      }
    }, 1000);
    setIntervalFn(interval);
  }
  return (
    <div
      className={
        "exec-task-container " +
        (taskLog.completedOn !== null || disabled ? "disabled-task" : "")
      }
    >
      <div className="execution-assignee-container">
        <div
          className="exec-assignee"
          style={{
            backgroundColor: generateColor(taskAssignee.username),
            color: "white",
          }}
        >
          {taskAssignee.first_name.charAt(0).toUpperCase() +
            taskAssignee.last_name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div
        className={
          "exec-act-task-container " +
          (taskLog.startedOn === null ? "disabled-task-part" : "")
        }
      >
        <div className="exec-task-id">
          <div>Task {taskLog.stageId + "." + taskLog.taskId}</div>
          <div className="actions-exec">
            <div
              className={
                "clock " + (props.task.timed.isTimed ? "" : "close-flex")
              }
            >
              <div className="clock-group">
                <div
                  className="clock-digit"
                  style={{
                    backgroundColor: triggerColor ? redColor : greenColor,
                  }}
                >
                  {(hours + "").charAt(0)}
                </div>
                <div
                  className="clock-digit"
                  style={{
                    backgroundColor: triggerColor ? redColor : greenColor,
                  }}
                >
                  {(hours + "").charAt(1)}
                </div>
              </div>{" "}
              :
              <div className="clock-group">
                <div
                  className="clock-digit"
                  style={{
                    backgroundColor: triggerColor ? redColor : greenColor,
                  }}
                >
                  {(mins + "").charAt(0)}
                </div>
                <div
                  className="clock-digit"
                  style={{
                    backgroundColor: triggerColor ? redColor : greenColor,
                  }}
                >
                  {(mins + "").charAt(1)}
                </div>
              </div>
              :
              <div className="clock-group">
                <div
                  className="clock-digit"
                  style={{
                    backgroundColor: triggerColor ? redColor : greenColor,
                  }}
                >
                  {(secs + "").charAt(0)}
                </div>
                <div
                  className="clock-digit"
                  style={{
                    backgroundColor: triggerColor ? redColor : greenColor,
                  }}
                >
                  {(secs + "").charAt(1)}
                </div>
              </div>
            </div>
            {props.task.checkpoint && (
              <div>
                <i className="fa-sharp fa-solid fa-check-double cp-exec"></i>
              </div>
            )}
          </div>
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
