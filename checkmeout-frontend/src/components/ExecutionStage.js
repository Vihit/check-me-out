import React, { useContext, useState } from "react";
import JobContext from "../context/JobContext";
import "./ExecutionStage.css";
import ExecutionTask from "./ExecutionTask";
import Task from "./Task";

function ExecutionStage(props) {
  let jobCtx = useContext(JobContext);
  let taskLogs = jobCtx.job.jobLogs.filter((jl) => jl.stageId === props.number);
  const [toggleVal, setToggleVal] = useState(false);
  const [tasks, setTasks] = useState(
    JSON.parse(jobCtx.job.checklist.template).stages[
      props.number - 1
    ].tasks.map((val, idx) => {
      if (val !== null)
        return (
          <ExecutionTask
            stageNo={props.number}
            number={idx + 1}
            key={idx + 1}
            task={val}
            taskLog={taskLogs.filter((sl) => sl.taskId === idx + 1)[0]}
            taskCompleted={taskCompleted}
          ></ExecutionTask>
        );
    })
  );
  // const [taskLogs, setTaskLogs] = useState(props.stageLogs);
  function taskCompleted() {}
  function calcGradient() {
    let completed = taskLogs.filter((jl) => jl.completedOn !== null).length;
    let total = taskLogs.length;
    let pct = (completed / total) * 100;

    return (
      ",#00cfa0 0%, #00cfa0 " + pct + "%, #EFEFEF " + pct + "%, #EFEFEF 100%"
    );
  }

  return (
    <div className="stage-container">
      <div className="stage-header">
        <div className="stg-name">
          Stage {props.number}{" "}
          <span className="stage-heading">{props.stage.name}</span>
        </div>
        <div className="etc-actions">
          <div className="stg-prog-bar-flex">
            <div
              className="stg-prog-bar"
              style={{
                background: "linear-gradient(to right" + calcGradient() + ")",
              }}
            ></div>
            <div className="stats">
              {taskLogs.filter((jl) => jl.completedOn !== null).length} of{" "}
              {taskLogs.length} tasks completed
            </div>
          </div>

          <i
            className={
              "fa-solid fa-circle-chevron-down toggler " +
              (toggleVal ? "animate-drawer" : "")
            }
            onClick={() => setToggleVal(!toggleVal)}
          ></i>
        </div>
      </div>
      <div className={"stage-task-container " + (toggleVal ? "closed" : "")}>
        <div className="execution-task-detail-container">
          {tasks.map((val, idx) => {
            return val;
          })}
        </div>
      </div>
    </div>
  );
}

export default ExecutionStage;
