import React, { useState, useRef } from "react";
import "../styles/chat.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  const navigate = useNavigate();

  const divRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, how can I help you today?",
    },
  ]);

  const [chatId, setChatId] = useState(0);

  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInputValue("");
    setLoading(true);
    if (divRef.current) {
      (divRef.current as HTMLElement).scrollTop = (
        divRef.current as HTMLElement
      ).scrollHeight;
    }
    setMessages([...messages, { content: inputValue, role: "user" }]);
    axios
      .post("http://localhost:9000/chat", {
        messages: [...messages, { content: inputValue, role: "user" }],
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
        chatId: chatId,
      })
      .then((response) => {
        const newMessage = response.data;
        setMessages([
          ...messages,
          { content: inputValue, role: "user" },
          { content: newMessage, role: "assistant" },
        ]);
        if (divRef.current) {
          (divRef.current as HTMLElement).scrollTop = (
            divRef.current as HTMLElement
          ).scrollHeight;
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="Chat">
      <Sidebar />
      <div className="ChatAndForm">
        <div ref={divRef} className="MessagesField">
          {messages
            .map((message, i) => {
              return (
                <h5
                  style={
                    message.role === "user"
                      ? { backgroundColor: "#83858c" }
                      : { backgroundColor: "#CFB1B7", color: "black" }
                  }
                  className="Message"
                  key={i}
                >
                  {message.role === "user"
                    ? "👤" + message.content
                    : "🤖" + message.content}
                </h5>
              );
            })
            .reverse()}
        </div>
        <form className="SendMessageForm" onSubmit={sendChat}>
          <div className="Prompt">
            <input
              required
              placeholder="Ask me anything"
              value={inputValue}
              onChange={handleInputChange}
              className="PromptField"
            />
            <button
              className="SendButton"
              disabled={loading ? true : false}
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
