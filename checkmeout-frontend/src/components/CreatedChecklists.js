import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ChecklistCard from "./ChecklistCard";
import "./CreatedChecklists.css";
import { config } from "./config";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import ChecklistContext from "../context/ChecklistContext";

function CreatedChecklists() {
  let history = useHistory();
  const clCtx = useContext(ChecklistContext);
  const [pubToggleVal, setPubToggleVal] = useState(false);
  const [reviewToggleVal, setReviewToggleVal] = useState(false);
  const [draftToggleVal, setDraftToggleVal] = useState(false);
  const [archiveToggleVal, setArchiveToggleVal] = useState(false);
  let userRole = JSON.parse(localStorage.getItem("user"))["role"][0];

  function toggle(what) {
    if (what === "Pub") {
      setPubToggleVal(!pubToggleVal);
    } else if (what === "Draft") {
      setDraftToggleVal(!draftToggleVal);
    } else if (what === "Archive") {
      setArchiveToggleVal(!archiveToggleVal);
    } else {
      setReviewToggleVal(!reviewToggleVal);
    }
  }

  function createNew() {
    history.push("/checklist", {
      checklist: {
        name: "",
        sopNumber: "",
        equipmentType: "",
        changeControlReferece: "",
        description: "",
        template: '{"stages":[]}',
      },
    });
  }

  return (
    <div className="created-checklists">
      <div className="page-header">
        <div>Checklists</div>
        {userRole !== "ROLE_OPERATOR" && (
          <div className="create-checklist-btn" onClick={() => createNew()}>
            Create
          </div>
        )}
      </div>
      <div className="stage-header header-bg margin-top">
        <div className="clr-white">Published</div>
        <div>
          <i
            className={
              "fa-solid fa-circle-chevron-down toggler clr-white " +
              (pubToggleVal ? "animate-drawer" : "")
            }
            onClick={() => toggle("Pub")}
          ></i>
        </div>
      </div>
      <div
        className={
          "stage-task-container-cl cont-bg " + (pubToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {clCtx.checklists
            .filter((val) => val.state === "Published")
            .map((val, idx) => {
              return <ChecklistCard checklist={val} key={idx}></ChecklistCard>;
            })}
        </div>
      </div>
      <div className="stage-header header-bg margin-top">
        <div className="clr-white">In Review</div>
        <div>
          <i
            className={
              "fa-solid fa-circle-chevron-down toggler clr-white " +
              (reviewToggleVal ? "animate-drawer" : "")
            }
            onClick={() => toggle("Review")}
          ></i>
        </div>
      </div>
      <div
        className={
          "stage-task-container-cl  cont-bg-review " +
          (reviewToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {clCtx.checklists
            .filter((val) => val.state === "In Review")
            .map((val, idx) => {
              return <ChecklistCard checklist={val} key={idx}></ChecklistCard>;
            })}
        </div>
      </div>
      <div className="stage-header header-bg margin-top">
        <div className="clr-white">Draft</div>
        <div>
          <i
            className={
              "fa-solid fa-circle-chevron-down toggler clr-white " +
              (draftToggleVal ? "animate-drawer" : "")
            }
            onClick={() => toggle("Draft")}
          ></i>
        </div>
      </div>
      <div
        className={
          "stage-task-container-cl  cont-bg-draft " +
          (draftToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {clCtx.checklists
            .filter((val) => val.state === "Draft")
            .map((val, idx) => {
              return <ChecklistCard checklist={val} key={idx}></ChecklistCard>;
            })}
        </div>
      </div>
      <div className="stage-header header-bg margin-top">
        <div className="clr-white">Archive</div>
        <div>
          <i
            className={
              "fa-solid fa-circle-chevron-down toggler clr-white " +
              (archiveToggleVal ? "animate-drawer" : "")
            }
            onClick={() => toggle("Archive")}
          ></i>
        </div>
      </div>
      <div
        className={
          "stage-task-container-cl cont-bg-archive margin-btm " +
          (archiveToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {clCtx.checklists
            .filter((val) => val.state === "Archive")
            .map((val, idx) => {
              return <ChecklistCard checklist={val} key={idx}></ChecklistCard>;
            })}
        </div>
      </div>
    </div>
  );
}

export default CreatedChecklists;
