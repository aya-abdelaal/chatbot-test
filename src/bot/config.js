// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import ChatbotChoices from ".././components/ChatbotChoices";
import BotAvatar from ".././components/botAvatar";

const marlboroRed = "#c60000";
const sheetEndpoint =
  "https://sheet.best/api/sheets/e9276d87-52bb-4e85-8840-aa38f8a64b20"; //TODO: move to env after demo

let flowData = await fetch(sheetEndpoint).then((response) => response.json());

console.log(flowData);

let initialChoices = [];
for (const [key, value] of Object.entries(flowData[0])) {
  if (!isNaN(key) && key != 0 && value != null) {
    initialChoices.push(value);
  }
}

const config = {
  initialMessages: [
    createChatBotMessage(flowData[0][0], {
      widget: "Choices0",
    }),
  ],
  botName: "Employment Bot",

  customComponents: {
    // Replaces the default header
    header: () => (
      <div
        style={{
          color: "white",
          fontSize: "20px",
          padding: "5px",
          backgroundColor: "#c60000",
          padding: "5px",
          borderRadius: "3px",
        }}
      >
        Employment Bot
      </div>
    ),
    // Replaces the default bot avatar
    botAvatar: (props) => <BotAvatar {...props} />,
  },

  customStyles: {
    // Overrides the chatbot message styles
    botMessageBox: {
      backgroundColor: marlboroRed,
    },
    // Overrides the chat button styles
    chatButton: {
      backgroundColor: marlboroRed,
    },
  },

  state: {
    currRow: 0,
    flowData: flowData,
    chatEnded: false,
  },

  widgets: [
    {
      // defines the name you will use to reference to this widget in "createChatBotMessage".
      widgetName: "Choices0",
      // Function that will be called internally to resolve the widget
      widgetFunc: (props) => <ChatbotChoices {...props} />,
      props: {
        // Any props you want to pass to your widget
        choices: flowData[0]["Type"] === "Choices" ? initialChoices : [],
        row: 0,
      },
      // Any props you want the widget to receive on render
    },
  ],
};

export default config;
