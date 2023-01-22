import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CreateChecklist.css";
import Stage from "./Stage";
import { config } from "./config";
import ChecklistContext from "../context/ChecklistContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CreateChecklist(props) {
  let location = useLocation();
  let history = useHistory();
  const clCtx = useContext(ChecklistContext);
  const inReview = location.state.checklist.state === "In Review";
  const [stages, setStages] = useState(
    JSON.parse(location.state.checklist.template)["stages"].map((val, idx) => {
      if (val !== null)
        return (
          <Stage
            key={idx + 1}
            number={idx + 1}
            removeStage={removeStage}
            updateStage={updateStage}
            stage={val}
            inReview={inReview}
          ></Stage>
        );
    })
  );
  const [clName, setClName] = useState(location.state.checklist.name);
  const [tOE, setTOE] = useState(location.state.checklist.equipmentType);
  const [tOC, setTOC] = useState(location.state.checklist.type);
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
  const [alertType, setAlertType] = useState("green");
  const [reviewer, setReviewer] = useState("Cancel");
  const [reviewers, setReviewers] = useState([]);
  const [finalReview, setFinalReview] = useState(false);
  const [editable, setEditable] = useState(false);
  let userRole = JSON.parse(localStorage.getItem("user"))["role"][0];
  let username = JSON.parse(localStorage.getItem("user"))["sub"];
  const [eqTypes, setEqTypes] = useState([]);

  useEffect(() => {
    getEquipmentTypes();
    if (location.state.checklist.created_by === null) setEditable(true);
    else if (
      JSON.parse(localStorage.getItem("user"))["sub"] ===
      location.state.checklist.createdBy
    ) {
      setEditable(true);
    } else {
    }
  }, []);

  function updateChecklistJson(state) {
    const newCLJson = {
      name: clName,
      typeOfEquipment: tOE,
      type: tOC,
      sopNumber: sop,
      changeControlReference: ccr,
      description: description,
      stages: stageJson,
      originalId: location.state.checklist.originalId,
      version: location.state.checklist.version,
    };
    setCLJson((prev) => {
      return newCLJson;
    });
    const newCLReq = {
      name: newCLJson["name"],
      type: newCLJson["type"],
      equipmentType: newCLJson["typeOfEquipment"],
      sopNumber: newCLJson["sopNumber"],
      changeControlReference: newCLJson["changeControlReference"],
      description: newCLJson["description"],
      state: state,
      template: JSON.stringify(newCLJson),
      originalId: newCLJson["originalId"],
      version: newCLJson["version"],
    };
    setclReq((prev) => {
      return newCLReq;
    });
    return newCLReq;
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
        setEqTypes(actualData);
      });
  }

  function updateStage(id, value) {
    console.log(value);
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
          stage={{ name: "", type: "", tasks: [] }}
          inReview={props.inReview}
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
      updated.splice(id - 1, 1, null);
      return updated;
    });
  }

  function sendToDraft() {
    if (verifyRequiredFields()) {
      const newClReq = updateChecklistJson("Draft");
      postPutChecklist(newClReq);
    }
  }

  function sendToReview() {
    if (verifyRequiredFields()) {
      if (!finalReview) {
        getReviewers();
        setReviewer("");
        setFinalReview(true);
      } else {
        if (reviewer !== "" && reviewer !== "Cancel") {
          const newClReq = updateChecklistJson("In Review");
          newClReq["reviewBy"] = reviewer;
          postPutChecklist(newClReq);
          setFinalReview(false);
          setReviewer("Cancel");
        }
      }
    }
  }

  function sendToPublish() {
    const newClReq = updateChecklistJson("Published");
    postPutChecklist(newClReq);
  }

  function reviewerChanged(reviewer) {
    if (reviewer === "Cancel") {
      setFinalReview(false);
    }
    setReviewer(reviewer);
  }
  function postPutChecklist(clReq) {
    const method = location.state.checklist.id !== undefined ? "PUT" : "POST";
    const newClReq = clReq;
    if (location.state.checklist.id !== undefined)
      newClReq["id"] = location.state.checklist.id;

    fetch(config.apiUrl + "checklist/", {
      method: method,
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
        if (method === "POST") clCtx.addCl(actualData);
        else clCtx.updateClAt(actualData);
        history.goBack();
      })
      .catch(function (error) {
        console.log("Some error occurred!", error);
      });
  }

  function getReviewers() {
    fetch(
      config.apiUrl +
        "users/roles/?roles=ROLE_SUPERVISOR,ROLE_PRODUCTION_MANAGER,ROLE_QA,ROLE_SYSTEM_ADMIN",
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
        setReviewers(
          actualData.filter(
            (usr) =>
              usr.username !== JSON.parse(localStorage.getItem("user"))["sub"]
          )
        );
      })
      .catch(function (error) {
        console.log("Some error occurred!", error);
      });
  }

  function verifyRequiredFields() {
    let flag = false;
    if (clName.replace(/ /g, "").length > 0) {
      if (tOE.replace(/ /g, "").length > 0) {
        console.log(tOE);
        if (stageJson.length > 0) {
          if (stageJson.filter((stg) => stg.tasks.length === 0).length === 0) {
          } else {
            setAlert(true);
            setAlertContent("Please add tasks under all stages!");
            flag = true;
          }
        } else {
          setAlert(true);
          setAlertContent("Please add a stage!");
          flag = true;
        }
      } else {
        setAlert(true);
        setAlertContent("Equipment type cannot be empty!");
        flag = true;
      }
    } else {
      setAlert(true);
      setAlertContent("Checklist name cannot be empty!");
      flag = true;
    }

    const timeId = setTimeout(() => {
      setAlert(false);
      setAlertContent("");
      setAlertType((prev) => "green");
    }, 2000);
    if (flag === true) {
      setAlertType("red");
      return false;
    } else {
      return true;
    }
  }
  return (
    <div className="checklist-detailed-container">
      <div
        className={
          "notification" +
          (alert ? "" : " notification-hidden") +
          (alertType === "red" ? " red-alert" : "")
        }
      >
        <div>{alertContent}</div>
      </div>
      <div
        className={
          "cl-detail-section " +
          (userRole === "ROLE_OPERATOR" ? "disabled-task-part" : "")
        }
      >
        <input
          className="full-width-control name-control"
          type="text"
          placeholder="Checklist Name"
          value={clName}
          onChange={(e) => setClName(e.target.value)}
        ></input>
      </div>
      <div
        className={
          "cl-detail-section " +
          (userRole === "ROLE_OPERATOR" ? "disabled-task-part" : "")
        }
      >
        <select
          className="beside-control"
          value={tOC}
          onChange={(e) => setTOC(e.target.value)}
        >
          <option value="">Checklist Type</option>
          <option value="Type A Cleaning">Type A Cleaning</option>
          <option value="Type B Cleaning">Type B Cleaning</option>
          <option value="Line Clearance">Line Clearance</option>
          <option value="Packing Line Setup">Packing Line Setup</option>
        </select>
      </div>
      <div
        className={
          "cl-detail-section " +
          (userRole === "ROLE_OPERATOR" ? "disabled-task-part" : "")
        }
      >
        <select
          className="beside-control"
          value={tOE}
          onChange={(e) => setTOE(e.target.value)}
        >
          <option value="">Equipment Type</option>
          {eqTypes.map((val, idx) => {
            return (
              <option key={idx} value={val.data.equipment_type}>
                {val.data.equipment_type}
              </option>
            );
          })}
        </select>
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
      <div
        className={
          "cl-detail-section " +
          +(userRole === "ROLE_OPERATOR" ? "disabled-task-part" : "")
        }
      >
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
      {userRole !== "ROLE_OPERATOR" && !inReview && (
        <div className="add-a-stage" onClick={() => addStage()}>
          Add a Stage
        </div>
      )}
      {userRole !== "ROLE_OPERATOR" && !inReview && (
        <div className="btns">
          <div className="draft-btn" onClick={sendToDraft}>
            Save to Draft
          </div>
          <div
            className={"reviewers " + (reviewer !== "Cancel" ? " " : "hidden")}
          >
            <div>
              <select
                value={reviewer}
                onChange={(e) => reviewerChanged(e.target.value)}
                className={reviewer !== "Cancel" ? " " : "hidden"}
                placeholder="Choose Reviewer"
              >
                <option value="">Choose Reviewer</option>
                <option value="Cancel">Cancel</option>
                {reviewers.map((val, idx) => {
                  return (
                    <option value={val.username} key={idx}>
                      {val.first_name + " " + val.last_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="review-btn" onClick={sendToReview}>
            {finalReview ? "Submit" : "Send to Review"}
          </div>
        </div>
      )}
      {inReview && location.state.checklist.reviewBy === username && (
        <div className="btns">
          <div className="review-btn" onClick={sendToPublish}>
            Publish
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateChecklist;
