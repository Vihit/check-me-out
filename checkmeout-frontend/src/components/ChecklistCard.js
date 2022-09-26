import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import ChecklistContext from "../context/ChecklistContext";
import "./ChecklistCard.css";
import { config } from "./config";

function ChecklistCard(props) {
  let history = useHistory();
  const clCtx = useContext(ChecklistContext);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobCLId, setJobCLId] = useState(0);
  const [equipment, setEquipment] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [names, setNames] = useState([]);

  function openChecklist(checkList) {
    history.push("checklist", checkList);
  }

  function createJobBtn() {
    getEquipmentNamesFor(props.checklist.equipmentType);
    setShowCreateJob(true);
  }

  function cancelJobCreation() {
    setJobCLId(0);
    setEquipment("");
    setShowCreateJob(false);
  }

  function createJob() {}

  function archive() {
    updateChecklist("Archive");
  }

  function unarchive() {
    updateChecklist("Draft");
  }

  function updateChecklist(state) {
    const req = props.checklist;
    req["state"] = state;
    fetch(config.apiUrl + "checklist/", {
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
          setAlert(true);
          setAlertContent("Checklist submitted!");
          const timeId = setTimeout(() => {
            setAlert(false);
            setAlertContent("");
          }, 2000);
          return response.json();
        }
        throw new Error("Some error occurred!");
      })
      .then((actualData) => {
        clCtx.updateClAt(props.checklist);
      })
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

  return (
    <div className="checklist-card">
      <div className="cl-details" onClick={() => openChecklist(props)}>
        <div className="cl-card-id">
          #{props.checklist.id}
          <div
            className={
              props.checklist.state === "Published"
                ? "published-ind"
                : props.checklist.state === "In Review"
                ? "review-ind"
                : props.checklist.state === "Draft"
                ? "draft-ind"
                : "archive-ind"
            }
          ></div>
        </div>
        <div className="cl-card-name">{props.checklist.name}</div>
        <div className="cl-card-sub-detail">
          {props.checklist.equipmentType}
        </div>
        <div className="cl-card-sub-detail">{props.checklist.sopNumber}</div>
        <div className="cl-card-sub-detail">
          {props.checklist.changeControlReference}
        </div>
      </div>
      <div className="cl-actions">
        {props.checklist.state === "Published" ? (
          <div onClick={() => createJobBtn()}>
            <span data-title="Create a Job">
              <i className="fa-solid fa-square-plus edit-btn"></i>
            </span>
          </div>
        ) : null}
        <div>
          {props.checklist.state === "Archive" ? (
            <span data-title="Unarchive" onClick={unarchive}>
              <i className="fa-solid fa-box-open archive-btn"></i>
            </span>
          ) : (
            <span data-title="Archive" onClick={archive}>
              <i className="fa-solid fa-box archive-btn"></i>
            </span>
          )}
        </div>
      </div>
      <div className={"create-job " + (showCreateJob ? "" : "close-flex ")}>
        <div className="create-job-header">
          <div className="flex-row-title">
            <i className="fa-solid fa-table-list new-job-icon"></i>
            <div className="new-job-head">Job For : {props.checklist.name}</div>
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
          <div className="flex-row-title">
            <div className="btn-save" onClick={createJob}>
              Initiate Job
            </div>
            <div className="btn-cancel" onClick={cancelJobCreation}>
              Cancel
            </div>
          </div>
        </div>
      </div>
      <div className={"notification" + (alert ? "" : " notification-hidden")}>
        <div>{alertContent}</div>
      </div>
    </div>
  );
}

export default ChecklistCard;
