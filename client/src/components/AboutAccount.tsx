import React from "react";
import "../styles/sidebar.css";
import { useNavigate } from "react-router-dom";

const AboutAccount: React.FC<{
  mode: string;
}> = ({ mode }) => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("mygptName");
    localStorage.removeItem("mygptPassword");
    navigate("../login");
  };

  return (
    <div>
      {mode === "Account" && (
        <div>
          <h4>Name: {localStorage.getItem("mygptName")}</h4>
          <button className="LogOutButton" onClick={logOut}>
            👋Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutAccount;
