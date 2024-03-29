import React from "react";
import { createClientMessage } from "react-chatbot-kit";
import config from "./config.js";
import ChatbotChoices from "../components/ChatbotChoices.js";
import axios from "axios";

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

    state["lastChoice"] = state.flowData[currRow][index + 1];

    updateState(message);

    handleFlow(nextRow);
  };

  const isValidEgyptianPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned number starts with '01' and has a total length of 11 digits
    const isValid = /^01\d{9}$/.test(cleanNumber);

    return isValid;
  };
  //handles user input
  const handleInput = (message) => {
    const currRow = state.currRow;

    if (state.flowData[currRow]["Type"] == "User input") {
      //get variable name to save from row[0]
      //phoneNumber has variable name phoneNumber
      const variableName = state.flowData[currRow][1].trim();

      let nextRow = state.flowData[currRow][2];

      if (variableName === "phoneNumber") {
        if (isValidEgyptianPhoneNumber(message)) {
          setState((state) => ({ ...state, phoneNumber: message }));
        } else {
          //if not go to false validation row message
          nextRow = state.flowData[currRow][3];
        }
      } else {
        state[variableName] = message;
        setState(state);
      }

      handleFlow(nextRow);
    }
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
      state.currRow = nextRow;

      //Todo: add logic for export
      if (state.flowData[nextRow]["Action"] === "EMAIL") sendEmail();

      switch (state.flowData[nextRow]["Type"]) {
        case "Choices":
          cretaeNewMessageChoices(nextRow);
          break;
        case "User input":
          //if user input just show the message
          let message = createChatBotMessage(state.flowData[nextRow][0]);
          updateState(message);
          break;
        case "Search":
          handleSearch();
          break;
        default:
          //if type is statement, display message and check if the chat ended
          let statement = createChatBotMessage(state.flowData[nextRow][0]);
          updateState(statement);
          if (
            typeof state.flowData[nextRow][1] === "string" &&
            state.flowData[nextRow][1].trim() === "END"
          ) {
            setState((state) => ({ ...state, chatEnded: true }));
          } else {
            handleFlow(state.flowData[nextRow][1]);
          }
          break;
      }
    }
  };

  const handleSearch = () => {
    //TODO: add search logic from backend
    const sheetName = state.flowData[state.currRow][0];

    const columnNames = state.flowData[state.currRow][1];

    const nextRow = state.flowData[state.currRow][2];

    const searchKey = state.flowData[state.currRow][3];

    const searchVariable = state.flowData[state.currRow][4];

    let responseData = "";

    if (searchKey !== null && searchVariable !== null) {
      const searchValue = state[searchVariable];

      axios
        .get("http://localhost:8000/search-google-sheet", {
          params: {
            sheetName,
            searchKey,
            searchValue,
            columns: columnNames,
          },
        })
        .then((response) => {
          const searchResults = response.data;
          if (searchResults.length === 0) {
            const message = createChatBotMessage("لم يتم العثور على نتائج");
            updateState(message);
          } else {
            responseData = searchResults.map((result) => {
              return Object.values(result).join(" ");
            });

            //once you have your data go to next row and replace data placeholder

            handleSearchNextRow(nextRow, responseData);
          }
        });
    } else {
      axios
        .get("http://localhost:8000/column-from-sheet", {
          params: {
            sheetName,
            columnNames,
          },
        })
        .then((response) => {
          console.log(response.data);
          responseData = response.data.map((result) => {
            return Object.values(result).join(" ");
          });

          //once you have your data go to next row and replace data placeholder

          console.log(responseData);

          handleSearchNextRow(nextRow, responseData);
        });
    }
  };

  const handleSearchNextRow = (nextRow, responseData) => {
    nextRow -= 2;

    if (!isRowValid(state.flowData, nextRow)) {
      let message = createChatBotMessage("حدث خطأ في النظام");
      updateState(message);
      setState((state) => ({ ...state, chatEnded: true }));
    } else {
      //update state so we are currently at the correct row
      setState((state) => ({ ...state, currRow: nextRow }));

      const textData = responseData.join("\n , ");

      console.log("textData", textData);

      switch (state.flowData[nextRow]["Type"]) {
        case "Choices":
          cretaeNewMessageChoices(nextRow, textData);
          break;
        case "User input":
          //if user input just show the message
          let message = createChatBotMessage(
            state.flowData[nextRow][0].replace("data", textData)
          );
          updateState(message);
          break;
        default:
          //if type is statement, display message and check if the chat ended
          let statement = createChatBotMessage(
            state.flowData[nextRow][0].replace("data", textData)
          );
          updateState(statement);
          if (
            typeof state.flowData[nextRow][1] === "string" &&
            state.flowData[nextRow][1].trim() === "END"
          ) {
            setState((state) => ({ ...state, chatEnded: true }));
          } else {
            handleFlow(state.flowData[nextRow][1]);
          }
          break;
      }
    }
  };

  //Creates new bot message if the message type is choice bubbles
  const cretaeNewMessageChoices = (nextRow, searchData) => {
    let choices = [];

    //get choices

    for (const [key, value] of Object.entries(state.flowData[nextRow])) {
      if (key != "Type" && key != "ID" && key != 0 && value != null) {
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
    if (searchData) text = text.replace("data", searchData);
    if (text === null) text = "الرجاء اختيار";
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

  //email function
  const sendEmail = async () => {
    const emailData = {
      to: "abdelaal.aya@hotmail.com", //TODO: replace with user's email
      subject: "Chatbot Customer Inquiry",
      text: `Customer with phone number ${
        state.phoneNumber
      } submitted a customer service request with message :\n 
      ${state.message ? state.message : state.lastChoice}`,
    };

    try {
      // Make a POST request to your backend
      const response = await axios.post(
        "http://localhost:8000/send-email",
        emailData
      );

      console.log("Email sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending email:", error.response.data);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleChoice, handleFlow, handleInput },
        });
      })}
    </div>
  );
};

export default ActionProvider;
