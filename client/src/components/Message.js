import React,{ useState } from "react";
import "../styles/message.css"

const Message = ({ message }) => {
  const [speaking, setSpeaking] = useState(false);
  let utterance = null;

  const speak = () => {
    utterance = new SpeechSynthesisUtterance(message.content);
    speechSynthesis.speak(utterance);
    utterance.onend = () => {
      setSpeaking(false);
    };
    setSpeaking(true);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <h5
      style={
        message.role === "user"
          ? { backgroundColor: "#83858c" }
          : { backgroundColor: "#CFB1B7", color: "black" }
      }
      className="Message"
    >
      {message.role === "user"
        ? "👤" + message.content
        : "🤖" + message.content}
      {!speaking ? (
        <button className="voiceButton" onClick={speak}>
          🔊
        </button>
      ) : (
        <button className="voiceButton" onClick={stopSpeaking}>
          🔇
        </button>
      )}
    </h5>
  );
};

export default Message;
