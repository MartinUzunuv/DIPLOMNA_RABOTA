import React, { useState, useEffect } from "react";
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

  const options = [
    "gpt-4",
    "gpt-3.5-turbo",
    "gpt-4-turbo",
    "gpt-4-turbo-preview",
    "gpt-3.5-turbo-16k-0613",
  ];

  const storedValue = localStorage.getItem("mygptModel");
  const [selectedOption, setSelectedOption] = useState<string>(
    storedValue ? storedValue : options[0]
  );

  useEffect(() => {
    localStorage.setItem("mygptModel", selectedOption);
  }, [selectedOption]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };


  return (
    <div>
      {mode === "Account" && (
        <div>
          <select className="modelSelect" value={selectedOption} onChange={handleOptionChange}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
