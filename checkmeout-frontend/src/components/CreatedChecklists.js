import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ChecklistCard from "./ChecklistCard";
import "./CreatedChecklists.css";
import { config } from "./config";

function CreatedChecklists() {
  const [checklists, setChecklists] = useState([]);
  let history = useHistory();

  useEffect(() => {
    getChecklists();
  }, []);
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
        <div>Created Checklists</div>
        <div className="create-checklist-btn" onClick={() => createNew()}>
          Create
        </div>
      </div>
      <div className="checklist-card-container">
        {checklists.map((val, idx) => {
          return <ChecklistCard checklist={val} key={idx}></ChecklistCard>;
        })}
      </div>
    </div>
  );
}

export default CreatedChecklists;
