import React from "react";
import OldChat from "./OldChat";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chats: React.FC<{
  mode: string;
  setMessages: (messages: any) => void;
  setChatId: (chatId: number) => void;
  setOpen: (open: any) => void;
  state: number;
  setState: (state: number) => void;
}> = ({ mode, setChatId, setMessages, setOpen, state, setState }) => {
  const navigate = useNavigate();

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
  }, [navigate, state, setState]);

  const newChat = () => {
    setChatId(0);
    setMessages([
      {
        role: "assistant",
        content: "Hi, how can I help you today?",
      },
    ]);
  };

  return (
    <div>
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
    </div>
  );
};

export default Chats;
