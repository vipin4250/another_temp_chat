import { Button, Dropdown, Modal, Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./SideDrawer.css"; // Importing custom CSS for modal
import { ENDPOINT } from "../../config/variable";  // Adjust the path if necessary


// const ENDPOINT = "http://localhost:3000"; // Updated backend endpoint

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [show, setShow] = useState(false);
  axios.defaults.withCredentials = true;


  const {
    setSelectedChat,
    user,
    notification = [], // Default to an empty array
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter something in the search");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${ENDPOINT}/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Error occurred! Failed to load the search results");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${ENDPOINT}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setShow(false);
    } catch (error) {
      alert("Error fetching the chat: " + error.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center bg-white w-100 p-2 border border-5">
        <Button variant="light" onClick={() => setShow(true)}>
          <i className="fas fa-search"></i>
          <span className="d-none d-md-inline px-2">Search User</span>
        </Button>
        <h2 className="font-family-work">Let's Chat</h2>
        <div className="d-flex align-items-center">
          {/* Dropdown for Notifications */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="notification-dropdown">
              <i className="fas fa-bell"></i>
              {notification.length > 0 && (
                <span className="badge bg-danger">{notification.length}</span>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {notification.length === 0 ? (
                <Dropdown.Item>No New Messages</Dropdown.Item>
              ) : (
                notification.map((notif) => (
                  <Dropdown.Item
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Dropdown for Profile */}
          <Dropdown align="end" className="ms-2">
            <Dropdown.Toggle variant="light" id="profile-dropdown" className="d-flex align-items-center">
              <img
                src={user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt = "Profile"
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <span>{user.name}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <ProfileModal user={user}>
                  My Profile
                </ProfileModal>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

        {/* Modal for Searching Users */}
        <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="side-drawer-modal"
        backdrop={false} // Disable the backdrop for a side panel effect
        keyboard={true}
        scrollable={true} // Allows scrolling if content exceeds panel height
        >
        <Modal.Header closeButton>
            <Modal.Title>Search Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex pb-2">
            <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="me-2"
            />
            <Button onClick={handleSearch}>Go</Button>
            </div>
            {loading ? (
            <ChatLoading />
            ) : (
            searchResult?.map((user) => (
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
                />
            ))
            )}
            {loadingChat && <Spinner animation="border" className="ms-auto d-flex" />}
        </Modal.Body>
        </Modal>


    </>
  );
}

export default SideDrawer;
