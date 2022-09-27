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

function App() {
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
      <div>
        <Navbar isLoggedIn={loggedIn} onLogout={logoutHandler}></Navbar>
        {!loggedIn ? <Login onLogin={loginHandler}></Login> : null}
        {loggedIn && (
          <div>
            <Route exact path="/" component={Dashboard}></Route>
            <Route exact path="/jobs" component={Dashboard}></Route>
            <Route exact path="/checklist" component={CreateChecklist}></Route>
            <Route
              exact
              path="/created-checklists"
              component={CreatedChecklists}
            ></Route>
          </div>
        )}
      </div>
    </ChecklistContext.Provider>
  );
}

export default App;
