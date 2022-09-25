import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./ChecklistCard.css";
import { config } from "./config";

function ChecklistCard(props) {
  let history = useHistory();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobCLId, setJobCLId] = useState(0);
  const [equipment, setEquipment] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  function openChecklist(checkList) {
    history.push("checklist", checkList);
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
      .then((actualData) => {})
      .catch(function (error) {
        console.log("Some error occurred!", error);
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
          <div onClick={() => setShowCreateJob(true)}>
            <span data-title="Create a Job">
              <i class="fa-solid fa-square-plus edit-btn"></i>
            </span>
          </div>
        ) : null}
        <div>
          {props.checklist.state === "Archive" ? (
            <span data-title="Unarchive" onClick={unarchive}>
              <i className="fa-solid fa-box-open archive-btn"></i>
            </span>
          ) : (
            <span data-title="Archive" onClick={unarchive}>
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
                <option>Sample 1</option>
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
