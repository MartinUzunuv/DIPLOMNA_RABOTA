import React from "react";
import "../styles/login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const [passwordInput, setPasswordInput] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(event.target.value);
  };

  const [status, setStatus] = useState("no status yet");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("http://localhost:9000/signup", {
        name: nameInput,
        password: passwordInput,
      })
      .then((response) => {
        const res = response.data;
        if (res.message === "created new account") {
          setTimeout(() => {
            navigate("../login");
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
        <h2>Sign up and create your account</h2>
        <form onSubmit={onSubmit}>
          <input
            value={nameInput}
            onChange={handleNameChange}
            placeholder="Username"
            required
            className="InputBox"
          />
          <br />
          <input
            value={passwordInput}
            onChange={handlePasswordChange}
            placeholder="Password"
            required
            className="InputBox"
          />
          {status === "this name has already been used" && (
            <div className="WarningMessage">
              ⚠️This name has already been used
            </div>
          )}
          {status === "created new account" && (
            <div
              className="WarningMessage"
              style={{ backgroundColor: "rgba(0, 255, 0, 0.4)" }}
            >
              ✅Succesfully created new account
            </div>
          )}
          <br />
          <input className="SubmitButton" type="submit" value="Submit" />
        </form>
        <br />
        Back to{" "}
        <a style={{ color: "white" }} href="./login">
          log in
        </a>
      </div>
    </div>
  );
};

export default Signup;
