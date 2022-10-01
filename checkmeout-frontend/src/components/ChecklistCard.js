import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import ChecklistContext from "../context/ChecklistContext";
import "./ChecklistCard.css";
import { config } from "./config";
import CreateJobForm from "./CreateJobForm";

function ChecklistCard(props) {
  let history = useHistory();
  const clCtx = useContext(ChecklistContext);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  let userRole = JSON.parse(localStorage.getItem("user"))["role"][0];

  function openChecklist(checkList) {
    history.push("checklist", checkList);
  }

  function createJobBtn() {
    setShowCreateJob(true);
  }

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
        <div className="cl-card-sub-detail">
          {props.checklist.sopNumber === "" ? "NA" : props.checklist.sopNumber}
        </div>
        <div className="cl-card-sub-detail">
          {props.checklist.changeControlReference === null
            ? "NA"
            : props.checklist.changeControlReference}
        </div>
      </div>
      {userRole != "ROLE_OPERATOR" && (
        <div className="cl-actions">
          {props.checklist.state === "Published" &&
          userRole != "ROLE_OPERATOR" ? (
            <div className="span-title-div" onClick={() => createJobBtn()}>
              <span data-title="Create a Job">
                <i className="fa-solid fa-square-plus edit-btn"></i>
              </span>
            </div>
          ) : null}
          <div className="span-title-div">
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
      )}
      {showCreateJob && (
        <CreateJobForm
          clId={props.checklist.id}
          setShowCreateJob={setShowCreateJob}
        ></CreateJobForm>
      )}
      <div className={"notification" + (alert ? "" : " notification-hidden")}>
        <div>{alertContent}</div>
      </div>
    </div>
  );
}

export default ChecklistCard;
