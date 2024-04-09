import React from "react";
import "../styles/sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AcceptOrDeclineChatInvite: React.FC<{
  id: number;
}> = ({ id }) => {
  const navigate = useNavigate();

  const acceptChat = () => {
    axios
      .post("http://localhost:9000/acceptChatInvitation", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
        chatId: id,
      })
      .then((response) => {})
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
      <button style={{ color: "red" }} className="ChatInviteAcceptDecline">
        Decline
      </button>
    </div>
  );
};

export default AcceptOrDeclineChatInvite;
