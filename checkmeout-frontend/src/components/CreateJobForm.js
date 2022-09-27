import React, { useContext, useEffect, useState } from "react";
import "./CreateJobForm.css";
import { config } from "./config";
import ChecklistContext from "../context/ChecklistContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CreateJobForm(props) {
  let history = useHistory();
  const clCtx = useContext(ChecklistContext);
  const [equipment, setEquipment] = useState("");
  const [jobCLId, setJobCLId] = useState(props.clId);
  const [names, setNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [chosenUser, setChosenUser] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [cl, setCl] = useState(
    clCtx.checklists.filter((cl) => cl.id === props.clId).length > 0
      ? clCtx.checklists.filter((cl) => cl.id === props.clId)[0]
      : {}
  );
  const [clJson, setClJson] = useState(
    clCtx.checklists.filter((cl) => cl.id === props.clId).length > 0
      ? JSON.parse(
          clCtx.checklists.filter((cl) => cl.id === props.clId)[0].template
        )
      : {}
  );
  const [cbs, setCbs] = useState(
    clCtx.checklists.filter((cl) => cl.id === props.clId).length > 0
      ? JSON.parse(
          clCtx.checklists.filter((cl) => cl.id === props.clId)[0].template
        ).stages.map((stg) => stg.tasks.map((tsk) => false))
      : []
  );
  const [allChecked, setAllChecked] = useState(false);
  const [assignees, setAssignees] = useState(
    clCtx.checklists.filter((cl) => cl.id === props.clId).length > 0
      ? JSON.parse(
          clCtx.checklists.filter((cl) => cl.id === props.clId)[0].template
        ).stages.map((stg) => stg.tasks.map((tsk) => "- -"))
      : []
  );
  useEffect(() => {
    getEquipmentNamesFor(cl.equipmentType);
    getUsers();
  }, []);

  function checkAll(flag) {
    if (flag) {
      setCbs((prev) => cbs.map((subCb) => subCb.map((cb) => true)));
    } else {
      setCbs((prev) => cbs.map((subCb) => subCb.map((cb) => false)));
    }
    setAllChecked(flag);
  }

  function cancelJobCreation() {
    props.setShowCreateJob(false);
  }

  function createJob() {
    let createJobReq = clJson.stages.flatMap((stg, id) => {
      return stg.tasks.map((tsk, idx) => {
        return {
          stageId: id + 1,
          taskId: idx + 1,
          user: {
            id: assignees[id][idx],
          },
        };
      });
    });

    let jobJson = {
      equipmentName: equipment,
      checklist: {
        id: props.clId,
      },
      jobLogs: createJobReq,
    };

    fetch(config.apiUrl + "job/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
      body: JSON.stringify(jobJson),
    })
      .then((response) => {
        if (response.ok) {
          setAlert(true);
          setAlertContent("Job initiated!");
          const timeId = setTimeout(() => {
            setAlert(false);
            setAlertContent("");
            history.goBack();
          }, 1000);
          return response.json();
        }
        throw new Error("Some error occurred!");
      })
      .then((actualData) => {})
      .catch(function (error) {
        console.log("Some error occurred!", error);
      });
  }

  function getEquipmentNamesFor(type) {
    fetch(config.apiUrl + "master/equipment/names/" + type, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((actualData) => {
        setNames(actualData);
      });
  }

  function getUsers() {
    fetch(
      config.apiUrl +
        "users/roles/?roles=ROLE_OPERATOR,ROLE_SUPERVISOR,ROLE_PRODUCTION_MANAGER,ROLE_QA,ROLE_SYSTEM_ADMIN",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Some error occurred!");
      })
      .then((actualData) => {
        setUsers(actualData);
      })
      .catch(function (error) {
        console.log("Some error occurred!", error);
      });
  }

  function updateCB(row, col, value) {
    setCbs((prev) => {
      const updated = [...prev[row]];
      updated.splice(col, 1, value);
      const updatedAll = [...prev];
      updatedAll.splice(row, 1, updated);
      return updatedAll;
    });
  }

  function setAssignee() {
    console.log(chosenUser);
    cbs.forEach((element, id) => {
      element.forEach((cb, idx) => {
        if (cb) {
          setAssignees((prev) => {
            const updated = [...prev[id]];
            updated.splice(idx, 1, chosenUser);
            const updatedAll = [...prev];
            updatedAll.splice(id, 1, updated);
            return updatedAll;
          });
        }
      });
    });
  }
  return (
    <div className={"create-job "}>
      <div className="create-job-header">
        <div className="flex-row-title">
          <i className="fa-solid fa-table-list new-job-icon"></i>
          <div className="new-job-head">Job For : {cl.name}</div>
        </div>
        <div className="new-job-input">
          <div className="new-job-label">Equipment</div>
          <div className="new-job-ta">
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              rows="1"
            >
              <option>Equipment Name</option>
              {names.map((val, idx) => {
                return (
                  <option key={idx} value={val.data.equipment_name}>
                    {val.data.equipment_name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="task-assignment-container">
          <div className="assign-header">Task Assignment</div>
          <div className="assign-header">
            <select
              onChange={(e) => setChosenUser((prev) => e.target.value)}
              value={chosenUser}
            >
              <option value="--">Choose Assignee</option>
              {users.map((val, idx) => {
                return (
                  <option key={idx} value={val.id}>
                    {val.first_name + " " + val.last_name}
                  </option>
                );
              })}
            </select>
            <button className="set-btn" onClick={setAssignee}>
              Set Assignee
            </button>
          </div>
          <div className="assign-table">
            <div className="table-row-head">
              <div>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => checkAll(e.target.checked)}
                ></input>
              </div>
              <div className="stg-name">Stage</div>
              <div className="stg-name">Task</div>
              <div className="assignee-name">Assignee</div>
            </div>
            {clJson.stages.map((stg, idx) => {
              {
                return stg.tasks.map((tsk, id) => {
                  return (
                    <div className="table-row" key={idx + "_" + id}>
                      <div>
                        <input
                          type="checkbox"
                          checked={cbs[idx][id]}
                          onChange={(e) => updateCB(idx, id, e.target.checked)}
                        ></input>
                      </div>
                      <div className="stg-name">{stg.name}</div>
                      <div className="tsk-name">{tsk.name}</div>
                      <div className="assignee">
                        {users.filter((usr) => usr.id == assignees[idx][id])
                          .length > 0
                          ? users
                              .filter((usr) => usr.id == assignees[idx][id])[0]
                              ["first_name"].toUpperCase()
                              .charAt(0) +
                            "" +
                            users
                              .filter((usr) => usr.id == assignees[idx][id])[0]
                              ["last_name"].toUpperCase()
                              .charAt(0)
                          : "--"}
                      </div>
                    </div>
                  );
                });
              }
            })}
          </div>
        </div>
        <div className="flex-row-title">
          <div className="btn-save" onClick={createJob}>
            Initiate Job
          </div>
          <div className="btn-cancel" onClick={cancelJobCreation}>
            Cancel
          </div>
        </div>
      </div>
      <div className={"notification" + (alert ? "" : " notification-hidden")}>
        <div>{alertContent}</div>
      </div>
    </div>
  );
}

export default CreateJobForm;
