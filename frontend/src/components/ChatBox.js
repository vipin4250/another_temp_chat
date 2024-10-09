import React from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState(); // Get selectedChat from context

  return (
    <div
      className={`chatbox-container p-3 bg-white rounded-3 border`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%", // Ensure it takes full width of its container
        height: "100%", // Ensure it takes full height of its container
        flexGrow: 1, // Allow it to expand and take available space
        margin: "0", // Remove extra margin
        transition: "all 0.3s ease-in-out",
        overflowY: "auto", // Scroll if content overflows
      }}
    >
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <div className="text-center">Please select a chat to start messaging.</div>
      )}
    </div>
  );
};

export default Chatbox;
