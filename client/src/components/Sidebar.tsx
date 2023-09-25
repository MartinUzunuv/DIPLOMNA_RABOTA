import React, { useState, useEffect } from "react";
import "../styles/sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OldChat from "./OldChat";

const Sidebar: React.FC<{
  setMessages: (messages: any) => void;
  setChatId: (chatId: number) => void;
  chatId: number;
}> = ({ setMessages, setChatId, chatId }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState("Chats");

  const openSidebar = () => {
    setOpen(!open);
    setMode("Chats");
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

  const setModeToChatHistory = () => {
    setMode("Chats");
  };

  const setModeToMyAccount = () => {
    setMode("Account");
  };

  const [waitingChats, setWaitingChats] = useState([])

  const setModeAddPeople = async () => {
    setMode("Social");
    axios
    .post("http://localhost:9000/getWaitingChats", {
      name: localStorage.getItem("mygptName"),
      password: localStorage.getItem("mygptPassword"),
    })
    .then((response) => {
      const responseData = response.data
      setWaitingChats(responseData.chats)
    })
    .catch((error) => {
      console.error("no account");
      navigate("../login");
    });
  };

  const logOut = () => {
    localStorage.removeItem("mygptName");
    localStorage.removeItem("mygptPassword");
    navigate("../login");
  };

  const newChat = () => {
    setChatId(0);
    setMessages([
      {
        role: "assistant",
        content: "Hi, how can I help you today?",
      },
    ]);
  };

  const [addPersonName, setAddPersonName] = useState("");

  const handleAddPersonNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddPersonName(event.target.value);
  };

  const addNewPerson = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("http://localhost:9000/addPerson", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
        newPerson: addPersonName,
        chatId: chatId,
      })
      .then((response) => {
        const responseData = response.data
        setChatId(responseData.id)
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
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
          {mode === "Chats" && (
            <div className="ChatsList">
              <p onClick={newChat} className="NewChat">
                ➕New chat
              </p>
              {chats
                .map((chat: { title: string; id: number }, i) => {
                  return (
                    <OldChat
                      setOpen={setOpen}
                      setChatId={setChatId}
                      setMessages={setMessages}
                      oldChat={chat}
                      key={i}
                    />
                  );
                })
                .reverse()}
            </div>
          )}
          {mode === "Account" && (
            <div>
              <h4>Name: {localStorage.getItem("mygptName")}</h4>
              <button className="LogOutButton" onClick={logOut}>
                👋Log out
              </button>
            </div>
          )}
          {mode === "Social" && (
            <div>
                <h4>Add someone to the current chat</h4>
                <form onSubmit={addNewPerson}>
                  <input
                    onChange={handleAddPersonNameChange}
                    value={addPersonName}
                    required
                    placeholder="Name"
                  />
                  <input type="submit" value="Add person" />
              </form>
              {waitingChats.map((chat ,i) => {
                return <h6 key={i}>{ chat }</h6>
              })}
            </div>
          )}
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
