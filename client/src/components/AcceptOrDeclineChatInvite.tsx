import React from "react";
import "../styles/sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AcceptOrDeclineChatInvite: React.FC<{
  id: number;
  setMode: (mode: any) => void;
  setState: (state: any) => void;
}> = ({ id, setMode, setState }) => {
  const navigate = useNavigate();

  const acceptChat = () => {
    axios
      .post("http://localhost:9000/acceptChatInvitation", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
        chatId: id,
      })
      .then((response) => {
        setMode("Chats");
        setState(Math.random());
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  };

  const declineChat = () => {
    axios
      .post("http://localhost:9000/declineChatInvitation", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
        chatId: id,
      })
      .then((response) => {
        setMode("Chats");
        setState(Math.random());
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  };

  return (
    <div>
      <button
        onClick={acceptChat}
        style={{ color: "green" }}
        className="ChatInviteAcceptDecline"
      >
        Accept
      </button>
      <button
        onClick={declineChat}
        style={{ color: "red" }}
        className="ChatInviteAcceptDecline"
      >
        Decline
      </button>
    </div>
  );
};

export default AcceptOrDeclineChatInvite;
