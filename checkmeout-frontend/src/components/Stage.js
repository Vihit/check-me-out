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
          ></Task>
        );
    })
  );
  const [name, setName] = useState(props.stage.name);
  const [stageJson, setStageJson] = useState(props.stage);
  const [taskJson, setTaskJson] = useState(props.stage.tasks);
  const [locked, setLocked] = useState(props.stage.name !== "");
  let userRole = JSON.parse(localStorage.getItem("user"))["role"][0];

  function updateStageJson() {
    const newStageJson = {
      name: name,
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
    <div className="stage-container">
      <div className="stage-header">
        <div>
          Stage - <span className="stage-heading">{name}</span>
        </div>
        {userRole !== "ROLE_OPERATOR" && (
          <div>
            <i
              className="fa-solid fa-trash-can trash"
              onClick={() => props.removeStage(props.number)}
            ></i>
            {!locked && (
              <i
                className="fa-solid fa-unlock lock-task"
                onClick={() => updateStageJson()}
              ></i>
            )}
            {locked && (
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
          (userRole === "ROLE_OPERATOR" ? " disabled-task-part" : "")
        }
      >
        <div className="stage-detail-container">
          <div style={{ width: "90%" }}>
            <input
              className="stage-name-control"
              type="text"
              placeholder="Name of the stage"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
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
