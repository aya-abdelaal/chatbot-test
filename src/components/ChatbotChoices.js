import React from "react";
import "./ChatbotChoices.css";
import { createClientMessage } from "react-chatbot-kit";
import { act } from "react-dom/test-utils";

const ChatbotChoices = (props) => {
  const onChoiceClick = (index) => {
    props.actions.handleChoice(index);
  };
  return (
    <div>
      {props.choices.map((choice, index) => (
        <div
          key={index}
          className="chatbot-choice"
          onClick={() => onChoiceClick(index)}
        >
          {choice}
        </div>
      ))}
    </div>
  );
};

export default ChatbotChoices;
