import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./bot/config.js";
import MessageParser from "./bot/MessageParser.jsx";
import ActionProvider from "./bot/ActionProvider.jsx";
import BotAvatar from "./components/botAvatar.js";
import { useState } from "react";
import "./Chatbot.css";

function ChatbotComponent() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  return (
    <div>
      <div
        className={`chatbot-container ${isChatbotOpen ? "" : "hide-chatbot"}`}
      >
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
      <button onClick={toggleChatbot} className="chatbot-button">
        <BotAvatar />
      </button>
    </div>
  );
}

export default ChatbotComponent;
