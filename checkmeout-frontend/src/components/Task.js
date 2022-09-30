import { useEffect, useState } from "react";
import "./Task.css";
import ChecklistActivity from "./ChecklistActivity";

function Task(props) {
  const newCLActivity = { type: "checklist", checklistData: [] };
  const [activities, setActivities] = useState(
    props.task.activities.map((val, idx) => {
      if (val !== null)
        if (val.type === "checklist") {
          return (
            <ChecklistActivity
              key={idx}
              id={idx}
              removeCLActivity={removeCLActivity}
              updateCL={updateCL}
              checklist={val}
              inReview={props.inReview}
            ></ChecklistActivity>
          );
        }
    })
  );
  const [activitySelected, setActivitySelected] = useState(0);
  const [locked, setLocked] = useState(props.task.name !== "");
  const [tt, setTT] = useState(props.task.timed.isTimed);
  const [ct, setCT] = useState(props.task.checkpoint);
  const [taskName, setTaskName] = useState(props.task.name);
  const [timeVal, setTimeVal] = useState(
    props.task.timed.isTimed ? props.task.timed.timeVal : null
  );
  const [timeUnit, setTimeUnit] = useState(
    props.task.timed.isTimed ? props.task.timed.timeUnit : null
  );
  const [timeAct, setTimeAct] = useState(
    props.task.timed.isTimed ? props.task.timed.timeAct : null
  );
  const [activityJson, setActivityJson] = useState(props.task.activities);
  const [task, setTask] = useState({
    name: taskName,
    timed: {
      isTimed: tt,
      timeVal: timeVal,
      timeUnit: timeUnit,
      timeAct: timeAct,
    },
    checkpoint: ct,
    activities: activityJson,
  });
  let userRole = JSON.parse(localStorage.getItem("user"))["role"][0];

  function updateTaskJson() {
    const newTaskJson = {
      name: taskName,
      timed: {
        isTimed: tt,
        timeVal: timeVal,
        timeUnit: timeUnit,
        timeAct: timeAct,
      },
      checkpoint: ct,
      activities: activityJson,
    };
    setTask((prev) => {
      return newTaskJson;
    });
    props.updateTask(props.number, newTaskJson);
    setLocked(true);
  }

  function removeCLActivity(id) {
    setActivities((prev) => {
      const updated = [...prev];
      updated.splice(id, 1, <div></div>);
      return updated;
    });
    setActivityJson((prev) => {
      const updated = [...prev];
      updated.splice(id, 1, null);
      return updated;
    });
  }

  function updateCL(id, value) {
    setActivityJson((prev) => {
      const updated = [...prev];
      updated.splice(id, 1, { type: "checklist", checklistData: value });
      return updated;
    });
  }

  function activityAdded(value) {
    if (value == 2) {
      const currentActivities = [...activities];
      currentActivities.push(
        <ChecklistActivity
          key={currentActivities.length}
          id={currentActivities.length}
          removeCLActivity={removeCLActivity}
          updateCL={updateCL}
          checklist={newCLActivity}
          inReview={props.inReview}
        ></ChecklistActivity>
      );
      setActivities((prev) => {
        return currentActivities;
      });
      setActivityJson((prev) => {
        const updated = [...prev];
        updated.push({ type: "checklist", checklistData: [] });
        return updated;
      });
    }
    setActivitySelected(0);
  }

  return (
    <div className="task-container">
      <div className="task-id">
        <div></div>
        {userRole !== "ROLE_OPERATOR" && !props.inReview && (
          <div>
            <i
              className="fa-solid fa-trash-can trash-task"
              onClick={() => props.removeTask(props.number)}
            ></i>
            {!locked && (
              <i
                className="fa-solid fa-unlock lock-task"
                onClick={() => updateTaskJson()}
              ></i>
            )}
            {locked && (
              <i
                className="fa-solid fa-lock unlock-task"
                onClick={() => setLocked(false)}
              ></i>
            )}
          </div>
        )}
      </div>
      <div
        className={
          "full-width task-nm " + (locked ? " disabled-task-part" : "")
        }
      >
        <input
          type="text"
          placeholder="Name of the task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        ></input>
      </div>
      <div
        className={
          "task-type-toolbar margin-btm " +
          (locked ? " disabled-task-part" : "")
        }
      >
        <div className={"task-type " + (tt ? "" : "hidden-t")}>
          <i
            className="fa-solid fa-hourglass-start hg"
            onClick={() => setTT(!tt)}
          ></i>{" "}
          <span className="tt-name" onClick={() => setTT(!tt)}>
            Timed Task
          </span>
          <input
            className={"tt-in " + (tt ? "" : "hidden")}
            type="number"
            size="2"
            maxLength="2"
            value={timeVal}
            onChange={(e) => setTimeVal(e.target.value)}
          ></input>
          <select
            className={"tt-unit " + (tt ? "" : "hidden")}
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <option value="---">---</option>
            <option value="seconds">Sec</option>
            <option value="mins">Min</option>
            <option value="hrs">Hr</option>
          </select>
          <select
            className={"tt-unit " + (tt ? "" : "hidden")}
            value={timeAct}
            onChange={(e) => setTimeAct(e.target.value)}
          >
            <option value="---">---</option>
            <option value="max">Max</option>
            <option value="min">Min</option>
          </select>
        </div>
        <div
          className={"task-type-1 " + (ct ? "" : "hidden-t")}
          onClick={() => setCT(!ct)}
        >
          <i className="fa-sharp fa-solid fa-check-double cp"></i>{" "}
          <span className="tt-name">Checkpoint Task</span>
        </div>
      </div>
      <div
        className={
          "activity-container " + (locked ? " disabled-task-part" : "")
        }
      >
        {activities.map((val, idx) => {
          return val;
        })}
      </div>
      {!locked && (
        <div className="full-width">
          <select
            onChange={(e) => activityAdded(e.target.value)}
            value={activitySelected}
          >
            <option value="0">Add an activity</option>
            <option value="2">Add a checklist</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default Task;
