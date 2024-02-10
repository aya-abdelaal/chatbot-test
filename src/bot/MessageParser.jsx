import React from "react";

const MessageParser = ({ children, actions, state }) => {
  const parse = (message) => {
    console.log("MessageParser" + message);

    actions.handleChoice(0);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
