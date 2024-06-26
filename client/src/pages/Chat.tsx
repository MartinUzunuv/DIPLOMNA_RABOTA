import React, { useState, useRef, useEffect } from "react";
import "../styles/chat.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Message from "../components/Message";
import Prompt from "../components/Prompt";

const Chat = () => {
  const navigate = useNavigate();

  const divRef = useRef(null);

  const [state, setState] = useState(Math.random());

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
        model: localStorage.getItem("mygptModel") || "gpt-4",
      })
      .then((response) => {
        const newMessage = response.data.messages;
        const newId = response.data.id;
        setMessages([
          ...messages,
          { content: inputValue, role: "user" },
          { content: newMessage, role: "assistant" },
        ]);
        setChatId(newId);
        if (divRef.current) {
          (divRef.current as HTMLElement).scrollTop = (
            divRef.current as HTMLElement
          ).scrollHeight;
        }
        setLoading(false);
        setState(Math.random());
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 1) {
        axios
          .post("http://localhost:9000/loadChat", {
            name: localStorage.getItem("mygptName"),
            password: localStorage.getItem("mygptPassword"),
            id: chatId,
          })
          .then((response) => {
            const res = response.data;
            setMessages(res.messages);
          })
          .catch((error) => {
            console.error("no account");
            navigate("../login");
          });
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [chatId]);

  return (
    <div className="Chat">
      <Sidebar
        chatId={chatId}
        setChatId={setChatId}
        setMessages={setMessages}
        state={state}
        setState={setState}
      />
      <div className="ChatAndForm">
        <div ref={divRef} className="MessagesField">
          {messages
            .map((message, i) => {
              return <Message key={i} message={message} />;
            })
            .reverse()}
          <h5 style={{ height: "100px" }}> </h5>
          <h5 style={{ height: "100px" }}> </h5>
        </div>
        <form className="SendMessageForm" onSubmit={sendChat}>
          <Prompt
            loading={loading}
            handleInputChange={handleInputChange}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
