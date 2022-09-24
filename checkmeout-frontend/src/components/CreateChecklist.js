import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CreateChecklist.css";
import Stage from "./Stage";
import { config } from "./config";

function CreateChecklist(props) {
  let location = useLocation();
  const [stages, setStages] = useState(
    JSON.parse(location.state.checklist.template)["stages"].map((val, idx) => {
      return (
        <Stage
          key={idx + 1}
          number={idx + 1}
          removeStage={removeStage}
          updateStage={updateStage}
          stage={val}
        ></Stage>
      );
    })
  );
  const [clName, setClName] = useState(location.state.checklist.name);
  const [tOE, setTOE] = useState(location.state.checklist.equipmentType);
  const [sop, setSOP] = useState(location.state.checklist.sopNumber);
  const [ccr, setCCR] = useState(
    location.state.checklist.changeControlReference
  );
  const [description, setDescription] = useState(
    location.state.checklist.description
  );
  const [stageJson, setStageJson] = useState(
    JSON.parse(location.state.checklist.template)["stages"]
  );
  const [clJson, setCLJson] = useState(
    JSON.parse(location.state.checklist.template)
  );
  const [clReq, setclReq] = useState({});
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  useEffect(() => {
    console.log(props);
  }, []);
  function updateChecklistJson(state) {
    const newCLJson = {
      name: clName,
      typeOfEquipment: tOE,
      sopNumber: sop,
      changeControlReference: ccr,
      description: description,
      stages: stageJson,
    };
    setCLJson((prev) => {
      return newCLJson;
    });
    const newCLReq = {
      name: newCLJson["name"],
      equipmentType: newCLJson["typeOfEquipment"],
      sopNumber: newCLJson["sopNumber"],
      changeControlReference: newCLJson["changeControlReference"],
      description: newCLJson["description"],
      state: state,
      template: JSON.stringify(newCLJson),
    };
    setclReq((prev) => {
      return newCLReq;
    });
    return newCLReq;
  }

  function updateStage(id, value) {
    setStageJson((prev) => {
      const updated = [...prev];
      updated.splice(id - 1, 1, value);
      return updated;
    });
  }

  function addStage() {
    setStages((prev) => {
      const updated = [...prev];
      updated.push(
        <Stage
          key={updated.length + 1}
          number={updated.length + 1}
          removeStage={removeStage}
          updateStage={updateStage}
          stage={{ name: "", tasks: [] }}
        ></Stage>
      );
      return updated;
    });
  }

  function removeStage(id) {
    setStages((prev) => {
      const updated = [...prev];
      updated.splice(id - 1, 1, <div key={id}></div>);
      return updated;
    });
    setStageJson((prev) => {
      const updated = [...prev];
      updated.splice(id - 1, 1, {});
      return updated;
    });
  }

  function sendToDraft() {
    const newClReq = updateChecklistJson("Draft");
    fetch(config.apiUrl + "checklist/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
      body: JSON.stringify(newClReq),
    })
      .then((response) => {
        if (response.ok) {
          setAlert(true);
          setAlertContent("Checklist added!");
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
    <div className="checklist-detailed-container">
      <div className={"notification" + (alert ? "" : " notification-hidden")}>
        <div>{alertContent}</div>
      </div>
      <div className="cl-detail-section">
        <input
          className="full-width-control name-control"
          type="text"
          placeholder="Checklist Name"
          value={clName}
          onChange={(e) => setClName(e.target.value)}
        ></input>
      </div>
      <div className="cl-detail-section">
        <input
          className="beside-control"
          type="text"
          placeholder="Type of Equipment"
          size="25"
          value={tOE}
          onChange={(e) => setTOE(e.target.value)}
        ></input>
        <input
          className="beside-control"
          type="text"
          placeholder="SOP Number"
          size="25"
          value={sop}
          onChange={(e) => setSOP(e.target.value)}
        ></input>
        <input
          className="beside-control"
          type="text"
          placeholder="Change Control Reference"
          size="35"
          value={ccr}
          onChange={(e) => setCCR(e.target.value)}
        ></input>
      </div>
      <div className="cl-detail-section">
        <textarea
          rows="3"
          className="full-width-control name-control"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>{" "}
      <div className="stg-area">
        {stages.map((val, idx) => {
          return val;
        })}{" "}
      </div>
      <div className="add-a-stage" onClick={() => addStage()}>
        Add a Stage
      </div>
      <div className="btns">
        <div className="draft-btn" onClick={sendToDraft}>
          Save to Draft
        </div>
        <div className="review-btn">Send to Review</div>
      </div>
    </div>
  );
}

export default CreateChecklist;
