import React, { useEffect, useState } from "react";
import "../styles/sidebar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AcceptOrDeclineChatInvite from "./AcceptOrDeclineChatInvite";

const Social: React.FC<{
  mode: string;
  chatId: number;
  setChatId: (chatId: number) => void;
  setMode: (mode: any) => void;
  setState: (state: any) => void;
  setOpen: (open: any) => void;
}> = ({ mode, chatId, setChatId, setMode, setState, setOpen }) => {
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
  }, [navigate, setMode, mode, setState]);

  const addNewPerson = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false)
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

  const namesString = (names: string[]) => {
    let longStringOfNames = "From: ";
    names.forEach((name) => {
      if (localStorage.getItem("mygptName") !== name) {
        longStringOfNames += name + " ";
      }
    });
    return longStringOfNames.slice(0, 30);
  };

  return (
    <div>
      {mode === "Social" && (
        <div>
          <h4>Add someone to the current chat</h4>
          <form id="addPersonForm" onSubmit={addNewPerson}>
            <input
              onChange={handleAddPersonNameChange}
              value={addPersonName}
              id="addPersonInput"
              required
              placeholder="Name"
            />
            <input id="addPersonSubmit" type="submit" value="Add person" />
          </form>
          {waitingChats.length > 0 && <h4>Waiting invites</h4>}
          {waitingChats.map(
            (chat: { owners: string[]; name: any; id: number }, i) => (
              <div style={{ marginRight: "15px" }} className="Invite" key={i}>
                {/* {chat.id.toString()} */}
                {"Chat name: " + chat.name.content.slice(0, 29)}
                <br />
                {namesString(chat.owners || [])}
                <br />
                <div>
                  <AcceptOrDeclineChatInvite
                    setState={setState}
                    setMode={setMode}
                    id={chat.id}
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Social;
