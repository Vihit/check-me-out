import { useState } from "react";
import "./Login.css";
import { config } from "./config";

function Login(props) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");

  function loginHandler() {
    let user = { username, pwd };
    var formBody = [];
    formBody.push(
      encodeURIComponent("username") + "=" + encodeURIComponent(username)
    );
    formBody.push(
      encodeURIComponent("password") + "=" + encodeURIComponent(pwd)
    );
    formBody = formBody.join("&");
    fetch(config.apiUrl + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      body: formBody,
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Login Unsuccessful!");
      })
      .then((actualData) => {
        console.log(actualData);
        localStorage.setItem("access", JSON.stringify(actualData));
        props.onLogin();
      });
  }

  return (
    <div className="login-flex-container">
      <div className="scrum-svg"></div>
      <div className="login-screen">
        <div className="login-header">Login</div>
        <div className="form">
          <div className="control">
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          <div className="control">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPwd(e.target.value)}
            ></input>
          </div>
          <div className="submit" onClick={loginHandler}>
            Go
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
