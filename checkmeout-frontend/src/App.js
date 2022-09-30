import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { Route, useHistory } from "react-router-dom";
import CreatedChecklists from "./components/CreatedChecklists";
import CreateChecklist from "./components/CreateChecklist";
import ChecklistContext from "./context/ChecklistContext";
import { type } from "@testing-library/user-event/dist/type";
import InitiatedJobs from "./components/InitiatedJobs";
import JobExecution from "./components/JobExecution";
import JobContext from "./context/JobContext";

function App() {
  const [job, setJob] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    JSON.parse(localStorage.getItem("user")) === null
      ? false
      : JSON.parse(localStorage.getItem("user"))["exp"] > Date.now() / 1000
      ? true
      : false
  );
  const history = useHistory();
  const [cls, setCls] = useState([]);
  const [types, setTypes] = useState([]);
  function setContextChecklists(checklists) {
    setCls((prev) => checklists);
  }
  function addCl(checklist) {
    setCls((prev) => [...prev, checklist]);
  }
  function updateClAt(checklist) {
    setCls((prev) => {
      let idx = 0;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].id === checklist.id) idx = i;
      }
      const updated = [...prev];
      updated.splice(idx, 1, checklist);
      return updated;
    });
  }

  function updateTypes(types) {
    setTypes((prev) => types);
  }

  function loginHandler() {
    setLoggedIn(true);
    history.push("/");
  }

  function logoutHandler() {
    localStorage.clear();
    setLoggedIn(false);
  }

  function replaceJob(newJob) {
    setJob((prev) => newJob);
  }

  function replaceJobs(id, job) {
    console.log("updating job " + id + " with " + job);

    setJobs((prev) => {
      const updated = [...prev];
      let idx = 0;
      jobs.forEach((job, index) => {
        if (job.id === id) idx = index;
      });
      updated.splice(idx, 1, job);
      return updated;
    });
  }

  function setAllJobs(jobs) {
    setJobs((prev) => jobs);
  }

  return (
    <ChecklistContext.Provider
      value={{
        checklists: cls,
        setContextChecklists: setContextChecklists,
        updateClAt: updateClAt,
        types: types,
        updateTypes: updateTypes,
        addCl: addCl,
      }}
    >
      <JobContext.Provider
        value={{
          job: job,
          setJob: replaceJob,
          jobs: jobs,
          setJobs: replaceJobs,
          setAllJobs: setAllJobs,
        }}
      >
        <div>
          <Navbar isLoggedIn={loggedIn} onLogout={logoutHandler}></Navbar>
          {!loggedIn ? <Login onLogin={loginHandler}></Login> : null}
          {loggedIn && (
            <div>
              <Route exact path="/" component={Dashboard}></Route>
              <Route exact path="/jobs" component={InitiatedJobs}></Route>
              <Route
                exact
                path="/checklist"
                component={CreateChecklist}
              ></Route>
              <Route
                exact
                path="/created-checklists"
                component={CreatedChecklists}
              ></Route>
              <Route
                exact
                path="/job-execution"
                component={JobExecution}
              ></Route>
            </div>
          )}
        </div>
      </JobContext.Provider>
    </ChecklistContext.Provider>
  );
}

export default App;
