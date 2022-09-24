import { useHistory } from "react-router-dom";
import "./ChecklistCard.css";

function ChecklistCard(props) {
  let history = useHistory();

  function openChecklist(checkList) {
    history.push("checklist", checkList);
  }
  return (
    <div className="checklist-card" onClick={() => openChecklist(props)}>
      <div className="cl-details">
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
        <div>
          <i className="fa-solid fa-pen edit-btn"></i>
        </div>
        <div>
          <i className="fa-solid fa-box archive-btn"></i>
        </div>
      </div>
    </div>
  );
}

export default ChecklistCard;
