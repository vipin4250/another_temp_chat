import React, { useEffect, useState } from "react";
import { Form, InputGroup, Button, Spinner, Toast } from "react-bootstrap";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ProfileModal from "./Miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import axios from "axios";
import { ENDPOINT } from "../config/variable";  // Adjust the path if necessary


// const ENDPOINT = "http://localhost:3000"; // Your backend endpoint
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  axios.defaults.withCredentials = true;

  const [showToast, setShowToast] = useState(false); // State for Toast
  const [toastMessage, setToastMessage] = useState("");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`${ENDPOINT}/api/message/${selectedChat._id}`, config);
      console.log("=============", data, "=============");
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setToastMessage("Failed to Load the Messages vipin", error.response.data.message);
      setShowToast(true); // Show Toast on error
    }
  };

  const sendMessage = async (event) => {
    if (event.key && event.key !== "Enter") return;

    event.preventDefault();

    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${ENDPOINT}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        setToastMessage("Failed to send the Message");
        setShowToast(true); // Show Toast on error
      }
    }
  };

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.some((n) => n._id === newMessageReceived._id)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="link"
              className="d-md-none"
              onClick={() => setSelectedChat("")}
            >
              <AiOutlineArrowLeft />
            </Button>
            <h2 className="mb-0">
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="flex-grow-1 text-center">
                      <h2 className="mb-0">{selectedChat.chatName.toUpperCase()}</h2>
                    </div>
                    <div className="d-flex justify-content-end" style={{ minWidth: '100px' }}>
                      <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    </div>
                  </div>
                </>
              )}
            </h2>
          </div>

          <div
            className="d-flex flex-column justify-content-end"
            style={{
              backgroundColor: "#E8E8E8",
              height: "80vh", 
              width: "100%", 
              overflowY: "auto", 
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", 
              marginTop: "15px",
              maxWidth: "100%", 
            }}
          >
            {loading ? (
              <Spinner animation="border" style={{ width: "70px", height: "70px", margin: "auto" }} />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <Form className="mt-3">
              {istyping && (
                <div>
                  <Lottie options={defaultOptions} width={70} />
                </div>
              )}
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                  style={{ backgroundColor: "#E0E0E0", borderRadius: "5px" }}
                />
                <Button variant="primary" onClick={sendMessage}>Send</Button>
              </InputGroup>
            </Form>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
          <h2 className="text-muted">Click on a user to start chatting</h2>
        </div>
      )}

      {showToast && (
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      )}
    </>
  );
};

export default SingleChat;
