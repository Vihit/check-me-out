import { useEffect, useState } from "react";
import "./Stage.css";
import Task from "./Task";

function Stage(props) {
  const newTask = {
    name: "",
    timed: { isTimed: false },
    checkpoint: false,
    activities: [],
  };
  const [toggleVal, setToggleVal] = useState(props.stage.name !== "");
  const [tasks, setTasks] = useState(
    props.stage.tasks.map((val, idx) => {
      if (val !== null)
        return (
          <Task
            number={idx + 1}
            key={idx + 1}
            removeTask={removeTask}
            updateTask={updateTask}
            task={val}
            inReview={props.inReview}
          ></Task>
        );
    })
  );
  const [name, setName] = useState(props.stage.name);
  const [type, setType] = useState(props.stage.type);
  const [stageJson, setStageJson] = useState(props.stage);
  const [taskJson, setTaskJson] = useState(props.stage.tasks);
  const [locked, setLocked] = useState(props.stage.name !== "");
  let userRole = JSON.parse(localStorage.getItem("user"))["role"][0];

  function updateStageJson() {
    const newStageJson = {
      name: name,
      type: type,
      tasks: taskJson,
    };
    setStageJson((prev) => {
      return newStageJson;
    });
    props.updateStage(props.number, newStageJson);
    lockAndClose();
  }

  function addTask() {
    setTasks((prev) => {
      const updated = [...prev];
      updated.push(
        <Task
          number={updated.length + 1}
          key={updated.length + 1}
          removeTask={removeTask}
          updateTask={updateTask}
          task={newTask}
          inReview={props.inReview}
        ></Task>
      );
      return updated;
    });
  }

  function lockAndClose() {
    setLocked(true);
    setToggleVal(true);
  }

  function unlockAndOpen() {
    setLocked(false);
    setToggleVal(false);
  }

  function updateTask(id, value) {
    setTaskJson((prev) => {
      const updated = [...prev];
      updated.splice(id - 1, 1, value);
      return updated;
    });
  }

  function toggle() {
    setToggleVal((prev) => {
      return !prev;
    });
  }

  function removeTask(id) {
    setTasks((prev) => {
      const updated = [...prev];
      updated.splice(id - 1, 1, <div key={id}></div>);
      return updated;
    });
    setTaskJson((prev) => {
      const updated = [...prev];
      updated.splice(id - 1, 1, null);
      return updated;
    });
  }

  return (
    <div className={"stage-container"}>
      <div className="stage-header">
        <div>
          Stage - <span className="stage-heading">{name}</span>
        </div>
        <div>
          Type - <span className="stage-heading">{type}</span>
        </div>
        {userRole !== "ROLE_OPERATOR" && (
          <div>
            {!props.inReview && (
              <i
                className="fa-solid fa-trash-can trash"
                onClick={() => props.removeStage(props.number)}
              ></i>
            )}
            {!locked && !props.inReview && (
              <i
                className="fa-solid fa-unlock lock-task"
                onClick={() => updateStageJson()}
              ></i>
            )}
            {locked && !props.inReview && (
              <i
                className="fa-solid fa-lock unlock-task"
                onClick={() => unlockAndOpen()}
              ></i>
            )}
            <i
              className={
                "fa-solid fa-circle-chevron-down toggler " +
                (toggleVal ? "animate-drawer" : "")
              }
              onClick={toggle}
            ></i>
          </div>
        )}
        {userRole === "ROLE_OPERATOR" && (
          <div>
            <i
              className={
                "fa-solid fa-circle-chevron-down toggler " +
                (toggleVal ? "animate-drawer" : "")
              }
              onClick={toggle}
            ></i>
          </div>
        )}
      </div>
      <div
        className={
          "stage-task-container " +
          (toggleVal ? "closed" : "") +
          (userRole === "ROLE_OPERATOR" || locked ? " disabled-task-part" : "")
        }
      >
        <div className="stage-detail-container">
          <div className="stage-nm" style={{ width: "90%" }}>
            <input
              className="stage-name-control"
              type="text"
              placeholder="Name of the stage"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>{" "}
          <div className="stage-nm" style={{ width: "90%" }}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={"stage-name-control"}
            >
              <option value="">Type</option>
              <option value="Pre-requisite">Pre-requisite</option>
              <option value="Cleaning Steps">Cleaning Steps</option>
              <option value="Visual Inspection by Operator">
                Visual Inspection by Operator
              </option>
              <option value="Visual Inspection by Supervisor">
                Visual Inspection by Supervisor
              </option>
              <option value="Visual Inspection by QA">
                Visual Inspection by QA
              </option>
              <option value="Assembling">Assembling</option>
            </select>
          </div>
        </div>
        <div className="task-detail-container">
          {tasks.map((val, idx) => {
            return val;
          })}
          {!locked && (
            <div className="add-a-task" onClick={() => addTask()}>
              Add a Task
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stage;
