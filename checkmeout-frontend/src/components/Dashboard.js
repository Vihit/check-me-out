import "./Dashboard.css";
import RoundStat from "./RoundStat";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <RoundStat
        color="#00BCB7"
        label="Created by you"
        value="12"
        link="/created-jobs"
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
