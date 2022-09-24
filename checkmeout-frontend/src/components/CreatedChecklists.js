import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ChecklistCard from "./ChecklistCard";
import "./CreatedChecklists.css";
import { config } from "./config";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function CreatedChecklists() {
  let history = useHistory();
  let location = useLocation();
  const [checklists, setChecklists] = useState(location.state.checklists);
  const [pubToggleVal, setPubToggleVal] = useState(false);
  const [reviewToggleVal, setReviewToggleVal] = useState(false);
  const [draftToggleVal, setDraftToggleVal] = useState(false);
  const [archiveToggleVal, setArchiveToggleVal] = useState(false);

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

  function getChecklists() {
    fetch(config.apiUrl + "checklist/", {
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
        setChecklists(actualData);
      });
  }
  return (
    <div className="created-checklists">
      <div className="page-header">
        <div>Checklists</div>
        <div className="create-checklist-btn" onClick={() => createNew()}>
          Create
        </div>
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
          "stage-task-container cont-bg " + (pubToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {checklists
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
          "stage-task-container  cont-bg-review " +
          (reviewToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {checklists
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
          "stage-task-container  cont-bg-draft " +
          (draftToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {checklists
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
          "stage-task-container cont-bg-archive margin-btm " +
          (archiveToggleVal ? "closed" : "")
        }
      >
        <div className="checklist-card-container">
          {checklists
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
