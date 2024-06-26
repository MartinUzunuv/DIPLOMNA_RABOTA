import React from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const goToChatPage = () => {
    navigate("/chat");
  };

  return (
    <div className="Home">
      <h1>Stronger ChatGPT Client</h1>
      <h2>
        Chat with ChatGPT with improved design, user-friendly experience and
        shared chats
      </h2>
      <button onClick={goToChatPage} className="GetStartedButton">
        Get Started
      </button>
    </div>
  );
};

export default Home;
