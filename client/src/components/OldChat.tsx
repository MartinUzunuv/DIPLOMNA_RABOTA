import React from "react";
import "../styles/oldChat.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface OldChatProps {
  oldChat: { title: string; id: number };
  setMessages: (messages: any) => void;
  setChatId: (chatId: number) => void;
}

const OldChat: React.FC<OldChatProps> = ({
  oldChat,
  setMessages,
  setChatId,
}) => {
  const navigate = useNavigate();

  const onClick = () => {
    axios
      .post("http://localhost:9000/loadChat", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
        id: oldChat.id,
      })
      .then((response) => {
        const res = response.data;
        setMessages(res.messages);
        setChatId(oldChat.id);
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  };
  return (
    <p onClick={onClick} className="OldChat">
      {oldChat.title.slice(0, 30)}
    </p>
  );
};

export default OldChat;
