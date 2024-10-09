import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { AiOutlinePlus } from "react-icons/ai";
import io from "socket.io-client"; // Import socket.io client
import { ENDPOINT } from "../config/variable";  // Adjust the path if necessary


// const ENDPOINT = "http://localhost:3000"; // Replace with your backend URL
let socket;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  axios.defaults.withCredentials = true;
  

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
  }, [user]);

  // Fetch chats from the server
  const fetchChats = async () => {
    if (!user) return; // Ensure user is loaded before fetching chats
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${ENDPOINT}/api/chat`, config);
      console.log("------", data, "-----------");
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error.response ? error.response.data : error.message);
      alert("Error occurred! Failed to load the chats.");
    }
  };
  

  // Listen for new messages and refetch chats
  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        fetchChats(); // Re-fetch chats when a new message is received
      });
    }
    
    return () => {
      if (socket) {
        socket.off("message received"); // Cleanup the event listener on unmount
      }
    };
  }, []);

  // Fetch chats on component mount or when fetchAgain is updated
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="my-chats-container p-3 bg-white">
      <style>
        {`
          .my-chats-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            width: 100%;
            height: 100%;
          }

          @media (min-width: 768px) {
            .my-chats-container {
              width: 31%;
              display: flex;
            }
          }

          @media (max-width: 767px) {
            .my-chats-container {
              width: 100%;
              display: ${selectedChat ? "none" : "flex"};
            }
          }

          .chat-header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding-bottom: 10px;
            font-family: 'Work Sans', sans-serif;
            word-wrap: break-word;
          }

          .chat-title {
            font-size: 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 80%;
          }

          @media (min-width: 768px) {
            .chat-title {
              font-size: 28px;
            }
          }

          .chat-box {
            display: flex;
            flex-direction: column;
            padding: 15px;
            background-color: #f8f8f8;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            overflow-y: hidden;
          }

          .chat-box .chat-item {
            cursor: pointer;
            background-color: #e8e8e8;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            transition: background-color 0.2s;
          }

          .chat-box .chat-item:hover {
            background-color: #38b2ac;
            color: white;
          }

          .selected-chat {
            background-color: #38b2ac !important;
            color: white !important;
          }

          .latest-message {
            font-size: 12px;
            color: #6c757d;
          }

          .chat-name {
            font-weight: bold;
            font-size: 14px;
          }

          .chat-sender {
            font-weight: bold;
            font-size: 12px;
            color: #6c757d;
          }
        `}
      </style>

      <div className="chat-header d-flex justify-content-between align-items-center">
        <div className="fs-6 fw-bolder text-truncate" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
          My Chats
        </div>
        <GroupChatModal>
          <Button
            className="d-flex align-items-center btn-sm" // Using btn-sm for smaller button size
            style={{ padding: '5px 10px' }} // Optional: adjust padding if needed
          >
            <AiOutlinePlus style={{ marginRight: "5px" }} /> {/* Add the plus icon */}
            New Group Chat
          </Button>
        </GroupChatModal>
      </div>


      <div className="chat-box">
        {chats ? (
          <div className="overflow-auto">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`chat-item ${selectedChat === chat ? "selected-chat" : ""}`}
              >
                <div className="chat-name">
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </div>

                {chat.latestMessage && (
                  <div className="latest-message">
                    <span className="chat-sender">{chat.latestMessage.sender.name}:</span>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
