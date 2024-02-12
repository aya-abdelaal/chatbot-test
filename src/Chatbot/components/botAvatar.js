import React from "react";
import "./botAvatar.css"; // Import a CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

const BotAvatar = () => {
  return (
    <div className="bot-avatar-box">
      <div className="bot-avatar">
        <FontAwesomeIcon icon={faRobot} className="bot-icon" />
      </div>
    </div>
  );
};

export default BotAvatar;
