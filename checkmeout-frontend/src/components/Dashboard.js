import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Dashboard.css";
import RoundStat from "./RoundStat";
import { config } from "./config.js";
import ChecklistContext from "../context/ChecklistContext";

function Dashboard() {
  const clCtx = useContext(ChecklistContext);
  // const [checklists, setChecklists] = useState([]);
  useEffect(() => {
    getChecklists();
    getEquipmentTypes();
  }, []);
  let history = useHistory();

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
        clCtx.setContextChecklists(actualData);
      });
  }

  function getEquipmentTypes() {
    fetch(config.apiUrl + "master/equipment/types/", {
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
        clCtx.updateTypes(actualData);
      });
  }

  return (
    <div className="dashboard-container">
      <RoundStat
        color="#00BCB7"
        label="Total Checklists"
        value={clCtx.checklists.length}
        link="/created-checklists"
      ></RoundStat>
      <RoundStat
        color="#008EC5"
        label="Initiated by you"
        value="10"
        link="/jobs"
      ></RoundStat>
      <RoundStat
        color="#4A5B9C"
        label="Assigned to you"
        value="9"
        link="/jobs"
      ></RoundStat>
      <RoundStat
        color="#2F4858"
        label="Completed by you"
        value="39"
        link="/jobs"
      ></RoundStat>
    </div>
  );
}

export default Dashboard;
