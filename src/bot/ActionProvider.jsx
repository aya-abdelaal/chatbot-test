import React from "react";
import { createClientMessage } from "react-chatbot-kit";
import config from "./config.js";
import ChatbotChoices from "../components/ChatbotChoices";

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
  state,
  createCustomMessage,
  rest,
}) => {
  //creates a user message with selected choice
  const handleChoice = (index, row) => {
    if (state.chatEnded) return;
    const currRow = row;

    const nextRow = state.flowData[currRow + 1][index + 1];

    //createUserMessage
    const message = createClientMessage(state.flowData[currRow][index + 1]);

    updateState(message);

    handleFlow(nextRow);
  };

  //creates next bot message according to data
  const handleFlow = (nextRow) => {
    // -1 for 0-indexed, and another -1 because first row of excel sheet is headers
    nextRow -= 2;

    if (state.chatEnded) return;

    if (!isRowValid(state.flowData, nextRow)) {
      let message = createChatBotMessage("حدث خطأ في النظام");
      updateState(message);
      setState((state) => ({ ...state, chatEnded: true }));
    } else {
      //update state so we are currently at the correct row
      setState((state) => ({ ...state, currRow: nextRow }));

      switch (state.flowData[nextRow]["Type"]) {
        case "Choices":
          cretaeNewMessageChoices(nextRow);
          break;
        case "User input":
          //if user input just show the message
          let message = createChatBotMessage(state.flowData[nextRow][0]);
          updateState(message);
          break;
        default:
          //if type is statement, display message and check if the chat ended
          let statement = createChatBotMessage(state.flowData[nextRow][0]);
          updateState(statement);
          if (state.flowData[nextRow][1] === "END") {
            setState((state) => ({ ...state, chatEnded: true }));
          }
          break;
      }
    }

    if (state.chatEnded) {
      //TODO:handle end user query
      let message = createChatBotMessage("شكرا لك");
      updateState(message);
    }
  };

  //Creates new bot message if the message type is choice bubbles
  const cretaeNewMessageChoices = (nextRow) => {
    let choices = [];

    //get choices

    for (const [key, value] of Object.entries(state.flowData[nextRow])) {
      if (key != "Type" && key != 0 && value != null) {
        choices.push(value);
      }
    }

    //createNewWidget

    config.widgets.push({
      widgetName: `Choices${nextRow}`,
      widgetFunc: (props) => <ChatbotChoices {...props} />,
      props: {
        choices: choices,
        row: nextRow,
      },
    });

    let text = state.flowData[nextRow][0];
    if (text === "") text = "الرجاء اختيار";
    let choicesMessage = createChatBotMessage(text, {
      widget: `Choices${nextRow}`,
    });
    updateState(choicesMessage);
  };

  //updates state to add message
  const updateState = (message) => {
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  //check's next row's validity in case there's a problem in the flowData sheet
  const isRowValid = (array, rowIndex) => {
    // Check if the rowIndex is within the bounds of the array and checks if message exists
    return (
      rowIndex >= 0 && rowIndex < array.length && array[rowIndex]["Type"] !== ""
    );
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleChoice, handleFlow },
        });
      })}
    </div>
  );
};

export default ActionProvider;
