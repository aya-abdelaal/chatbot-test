import React from "react";
import { createClientMessage } from "react-chatbot-kit";

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
  state,
  createCustomMessage,
  rest,
}) => {
  const handleChoice = (index) => {
    const currRow = state.currRow;

    const nextRow = state.flowData[currRow + 1][index + 1];

    //createUserMessage
    const message = createClientMessage(state.flowData[currRow][index + 1]);

    updateState(message);

    handleFlow(nextRow);
  };

  const configureChoices = (obj) => {
    console.log(obj);
    let choices = [];
    for (const [key, value] of Object.entries(obj)) {
      console.log(value);
      if (key != "Type" && key != 0 && value != null) {
        choices.push(value);
      }
      console.log(choices);
      return choices;
    }
  };

  const handleFlow = (nextRow) => {
    nextRow -= 1;

    if (state.chatEnded) return;

    setState((state) => ({ ...state, currRow: nextRow }));

    switch (state.flowData[nextRow]["Type"]) {
      case "Choices":
        let choices = [];

        for (const [key, value] of Object.entries(state.flowData[nextRow])) {
          if (key != "Type" && key != 0 && value != null) {
            choices.push(value);
          }
        }

        console.log(choices);

        setState((state) => ({ ...state, choices: choices }));
        let choicesMessage = createChatBotMessage(state.flowData[nextRow][0], {
          widget: "ChatbotChoices",
        });
        updateState(choicesMessage);
        break;
      case "User input":
        let message = createChatBotMessage(state.flowData[nextRow][0]);
        updateState(message);
        break;
      default:
        let statement = createChatBotMessage(state.flowData[nextRow][0]);
        updateState(statement);
        if (state.flowData[nextRow][1] == "END") {
          setState((state) => ({ ...state, chatEnded: true }));
        }
        break;
    }
  };

  const updateState = (message) => {
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleChoice },
        });
      })}
    </div>
  );
};

export default ActionProvider;
