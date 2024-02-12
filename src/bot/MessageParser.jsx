import React from "react";

const MessageParser = ({ children, actions, state }) => {
  const isValidEgyptianPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned number starts with '01' and has a total length of 11 digits
    const isValid = /^01\d{9}$/.test(cleanNumber);

    return isValid;
  };

  const parse = (message) => {
    const currRow = state.currRow;

    if (state.flowData[currRow]["Type"] == "User input") {
      //get variable name to save from row[0]
      //phoneNumber has variable name phoneNumber
      const variableName = state.flowData[currRow][1].trim();

      let nextRow = state.flowData[currRow][2];

      if (variableName === "phoneNumber") {
        if (isValidEgyptianPhoneNumber(message)) state[variableName] = message;
        else {
          //if not go to false validation row message
          nextRow = state.flowData[currRow][3];
        }
      } else {
        state[variableName] = message;
      }

      actions.handleFlow(nextRow);
    }
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
