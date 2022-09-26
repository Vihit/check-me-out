import { useEffect, useState } from "react";
import "./ChecklistActivity.css";

function ChecklistActivity(props) {
  const [newCLItem, setNewCLItem] = useState("");
  const [checklist, setChecklist] = useState(props.checklist.checklistData);
  const [locked, setLocked] = useState(true);

  function addToChecklist() {
    setChecklist((prev) => {
      const updated = [...prev];
      updated.push(newCLItem);
      props.updateCL(props.id, updated);
      return updated;
    });
    setNewCLItem("");
  }

  function deleteCLItem(idx) {
    setChecklist((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      props.updateCL(props.id, updated);
      return updated;
    });
  }

  return (
    <div className="checklist-act-container">
      <div className="checklist-delete">
        <i
          className="fa-solid fa-trash-can trash-cl"
          onClick={() => props.removeCLActivity(props.id)}
        ></i>
        {!locked && (
          <i
            className="fa-solid fa-unlock lock-cl"
            onClick={() => setLocked(true)}
          ></i>
        )}
        {locked && (
          <i
            className="fa-solid fa-lock unlock-cl"
            onClick={() => setLocked(false)}
          ></i>
        )}
      </div>
      {checklist.map((val, idx) => {
        return (
          <div className="checklist-with-delete">
            <div className="checklist">
              <input type="checkbox" disabled></input>
              {val}
            </div>
            {!locked && (
              <i
                className="fa-sharp fa-solid fa-xmark cancel-cl"
                onClick={() => deleteCLItem(idx)}
              ></i>
            )}
          </div>
        );
      })}
      {!locked && (
        <div className="checklist-add">
          <input
            type="text"
            placeholder="Checklist item"
            value={newCLItem}
            onChange={(e) => setNewCLItem(e.target.value)}
          ></input>
          <div className="add-btn-cl" onClick={() => addToChecklist()}>
            Add
          </div>
        </div>
      )}
    </div>
  );
}

export default ChecklistActivity;
