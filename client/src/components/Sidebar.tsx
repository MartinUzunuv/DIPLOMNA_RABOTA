import React, { useState, useEffect } from "react";
import "../styles/sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OldChat from "./OldChat";

const Sidebar: React.FC<{
  setMessages: (messages: any) => void;
  setChatId: (chatId: number) => void;
}> = ({ setMessages, setChatId }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const openSidebar = () => {
    setOpen(!open);
  };

  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:9000/oldChats", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
      })
      .then((response) => {
        const resChats = response.data.chats;
        setChats(resChats);
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  }, [open, navigate]);

  return (
    <div className="Sidebar">
      {open ? (
        <div className="SidebarOpened">
          <div className="HeaderChatSidebar">
            <h3>Chats</h3>
            <button
              style={{ margin: "10px" }}
              className="OpenButton"
              onClick={openSidebar}
            >
              📂
            </button>
          </div>
          <div className="ChatsList">
            {chats.map((chat: { title: string; id: number }, i) => {
              return (
                <OldChat setChatId={setChatId} setMessages={setMessages} oldChat={chat} key={i} />
              );
            })}
          </div>
        </div>
      ) : (
        <button className="OpenButton" onClick={openSidebar}>
          📁
        </button>
      )}
    </div>
  );
};

export default Sidebar;
