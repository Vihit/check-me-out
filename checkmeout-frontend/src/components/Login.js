import { useState } from "react";
import "./Login.css";
import { config } from "./config";
import jwt from "jwt-decode";

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
        localStorage.setItem("access", JSON.stringify(actualData));
        localStorage.setItem(
          "user",
          JSON.stringify(jwt(actualData["access_token"]))
        );
        props.onLogin();
      });
  }

  function pressedKey(e) {
    console.log("key down");
    if (e.key === "Enter") {
      loginHandler();
    }
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
              onKeyDown={(e) => pressedKey(e)}
              onChange={(e) => setPwd(e.target.value)}
            ></input>
          </div>
          <button className="submit" onClick={loginHandler}>
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
