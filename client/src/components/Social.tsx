import React, { useEffect, useState } from "react";
import "../styles/sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Social: React.FC<{
  mode: string;
  chatId: number;
  setChatId: (chatId: number) => void;
}> = ({ mode, chatId, setChatId }) => {
  const navigate = useNavigate();

  const [waitingChats, setWaitingChats] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:9000/getWaitingChats", {
        name: localStorage.getItem("mygptName"),
        password: localStorage.getItem("mygptPassword"),
      })
      .then((response) => {
        const responseData = response.data;
        setWaitingChats(responseData.chats);
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  }, [ navigate ]);

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
        const responseData = response.data;
        setChatId(responseData.id);
      })
      .catch((error) => {
        console.error("no account");
        navigate("../login");
      });
  };

  const [addPersonName, setAddPersonName] = useState("");

  const handleAddPersonNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddPersonName(event.target.value);
  };
  return (
    <div>
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
          {waitingChats.map((chat, i) => {
            return <h6 key={i}>{chat}</h6>;
          })}
        </div>
      )}
    </div>
  );
};

export default Social;
