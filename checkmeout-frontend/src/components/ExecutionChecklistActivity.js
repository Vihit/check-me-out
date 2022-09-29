import "./ExecutionChecklistActivity.css";
import React from "react";

function ExecutionChecklistActivity(props) {
  return (
    <div className="exec-checklist-act-container">
      {props.checklist.checklistData.map((val, idx) => {
        return (
          <div key={idx} className="checklist-with-delete">
            <div className="checklist">
              <input type="checkbox" disabled></input>
              {val}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExecutionChecklistActivity;
