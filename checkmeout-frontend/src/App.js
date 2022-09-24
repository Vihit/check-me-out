import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { Route, useHistory } from "react-router-dom";
import CreatedChecklists from "./components/CreatedChecklists";
import CreateChecklist from "./components/CreateChecklist";
import React from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  function loginHandler() {
    setLoggedIn(true);
    history.push("/");
  }

  function logoutHandler() {
    localStorage.clear();
    setLoggedIn(false);
  }

  return (
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
            path="/created-jobs"
            component={CreatedChecklists}
          ></Route>
        </div>
      )}
    </div>
  );
}

export default App;
