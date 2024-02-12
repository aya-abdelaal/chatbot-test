import "./App.css";
import Chatbot, { createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./customStyles.css";
import config from "./bot/config.js";
import MessageParser from "./bot/MessageParser.jsx";
import ActionProvider from "./bot/ActionProvider.jsx";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
