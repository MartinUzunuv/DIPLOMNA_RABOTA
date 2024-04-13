import React, { useState, useRef } from "react";
import "../styles/chat.css";

const Prompt = ({ inputValue, handleInputChange, loading, setInputValue }) => {
  const [audioText, setAudioText] = useState("");
    const [isRecording,setIsRecording] = useState(false);
    const RecordButtonRef = useRef(null);

  const startRecording = () => {
    try {
      setIsRecording(true);
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAudioText(transcript);
        setInputValue(transcript);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.start();
    } catch (e) {
        RecordButtonRef.current.style.display = "none"
    }
  };

  return (
    <div className="Prompt">
      <div className="PromptAndRecord">
        <button
          className="RecordButton"
          onClick={startRecording}
          disabled={isRecording}
          ref={RecordButtonRef}
        >
          {isRecording ? "..." : "🎙️"}
        </button>
        <input
          required
          placeholder="Ask me anything"
          value={inputValue}
          onChange={handleInputChange}
          className="PromptField"
        />
      </div>

      <button
        className="SendButton"
        disabled={loading ? true : false}
        type="submit"
      >
        Send
      </button>
    </div>
  );
};

export default Prompt;
