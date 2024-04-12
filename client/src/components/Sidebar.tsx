import React, { useState } from "react";
import "../styles/sidebar.css";
import AboutAccount from "./AboutAccount";
import Chats from "./Chats";
import Social from "./Social";

const Sidebar: React.FC<{
  setMessages: (messages: any) => void;
  setChatId: (chatId: number) => void;
  chatId: number;
  state: number;
  setState: (state: number) => void;
}> = ({ setMessages, setChatId, chatId, state, setState }) => {
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState("Chats");

  const openSidebar = () => {
    setOpen(!open);
    setMode("Chats");
  };

  const setModeToChatHistory = () => {
    setMode("Chats");
  };

  const setModeToMyAccount = () => {
    setMode("Account");
  };

  const setModeAddPeople = async () => {
    setMode("Social");
  };

  return (
    <div
      className={
        open
          ? window.innerHeight > window.innerWidth
            ? "Sidebar"
            : ""
          : "Sidebar"
      }
    >
      {open ? (
        <div className="SidebarOpened">
          <div className="HeaderChatSidebar">
            <h3>{mode}</h3>
            {mode !== "Account" && (
              <button
                style={{ margin: "10px" }}
                className="OpenButton"
                onClick={setModeToMyAccount}
              >
                👤
              </button>
            )}
            {mode !== "Social" && (
              <button
                style={{ margin: "10px" }}
                className="OpenButton"
                onClick={setModeAddPeople}
              >
                👥
              </button>
            )}
            {mode !== "Chats" && (
              <button
                style={{ margin: "10px" }}
                className="OpenButton"
                onClick={setModeToChatHistory}
              >
                💬
              </button>
            )}
            <button
              style={{ margin: "10px" }}
              className="OpenButton"
              onClick={openSidebar}
            >
              ❌
            </button>
          </div>
          <Chats
            setOpen={setOpen}
            setMessages={setMessages}
            setChatId={setChatId}
            mode={mode}
            state={state}
            setState={setState}
          />
          <AboutAccount mode={mode} />
          <Social
            setChatId={setChatId}
            chatId={chatId}
            mode={mode}
            setMode={setMode}
            setState={setState}
            setOpen={setOpen}
          />
        </div>
      ) : (
        <button className="OpenButton" onClick={openSidebar}>
          📃
        </button>
      )}
    </div>
  );
};

export default Sidebar;
