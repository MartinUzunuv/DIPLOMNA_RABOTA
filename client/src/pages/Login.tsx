import React from "react";
import "../styles/login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const [status, setStatus] = useState("no status yet");

  const [passwordInput, setPasswordInput] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("http://localhost:9000/login", {
        name: nameInput,
        password: passwordInput,
      })
      .then((response) => {
        const res = response.data;
        if (res.message === "successfully logged in") {
          localStorage.setItem("mygptName", nameInput);
          localStorage.setItem("mygptPassword", passwordInput);
          setTimeout(() => {
            navigate("../chat");
          }, 1000);
        }
        setStatus(res.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="Login">
      <div className="LoginBox">
        <h2>Log into your account</h2>
        <form onSubmit={onSubmit}>
          <div className="UnderlineOnHover">
            <input
              value={nameInput}
              onChange={handleNameChange}
              placeholder="Username"
              required
              className="InputBox"
            />
          </div>
          <br />
          <div className="UnderlineOnHover">
            <input
              value={passwordInput}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
              className="InputBox"
            />
          </div>
          {status === "account does not exist" && (
            <div className="WarningMessage">
              ⚠️Account with this name does't exists yet
            </div>
          )}
          {status === "wrong password" && (
            <div className="WarningMessage">⚠️Incorrect password</div>
          )}
          {status === "successfully logged in" && (
            <div
              className="WarningMessage"
              style={{ backgroundColor: "rgba(0, 255, 0, 0.4)" }}
            >
              ✅Successfully logged into your account
            </div>
          )}
          <br />
          <input className="SubmitButton" type="submit" value="Submit" />
        </form>
        <br />
        Don't have an account?{" "}
        <a style={{ color: "white" }} href="./signup">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default Login;
