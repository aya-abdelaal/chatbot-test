import "./App.css";
import Chatbot, { createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./customStyles.css";
import config from "./bot/config.js";
import MessageParser from "./bot/MessageParser.jsx";
import ActionProvider from "./bot/ActionProvider.jsx";
import BotAvatar from "./components/botAvatar";
import { useState } from "react";

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <div>
          {
            <div className={isChatbotOpen ? "" : "hideChatbot"}>
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          }
          <button onClick={toggleChatbot} className="chatbotButton">
            <BotAvatar />
          </button>
        </div>
      </header> */}
      <div className="app-container">
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
    </div>
  );
}

export default App;
