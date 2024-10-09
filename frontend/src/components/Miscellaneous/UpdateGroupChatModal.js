import { FaEye } from "react-icons/fa"; // FontAwesome Eye icon
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { ENDPOINT } from "../../config/variable";  // Adjust the path if necessary


// const ENDPOINT = "http://localhost:3000"; // Updated backend endpoint


const styles = {
  fadeIn: {
    animation: "fadeInAnimation 0.5s ease-in-out",
  },
  fadeInAnimation: `
    @keyframes fadeInAnimation {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  modalHeader: {
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
  },
  buttonPrimary: {
    backgroundColor: "#007bff",
    border: "none",
    transition: "background-color 0.3s ease",
  },
  buttonPrimaryHover: {
    backgroundColor: "#0056b3",
  },
  renameButton: {
    backgroundColor: "#28a745",
    transition: "background-color 0.3s ease",
  },
  renameButtonHover: {
    backgroundColor: "#218838",
  },
  formControl: {
    borderRadius: "0.25rem",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem 0",
  },
  leaveButton: {
    backgroundColor: "#dc3545",
    border: "none",
    transition: "background-color 0.3s ease",
  },
  leaveButtonHover: {
    backgroundColor: "#c82333",
  },
};

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  axios.defaults.withCredentials = true;

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

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
      alert("Error Occurred! Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${ENDPOINT}/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert(`Error Occurred! ${error.response.data.message}`);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${ENDPOINT}/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      alert(`Error Occurred! ${error.response.data.message}`);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${ENDPOINT}/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert(`Error Occurred! ${error.response.data.message}`);
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <style>{styles.fadeInAnimation}</style>
      <Button
        variant="primary"
        onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor)}
        style={styles.buttonPrimary}
        onClick={handleShow}
      >
        <FaEye className="me-2" />
      </Button>

      <Modal show={show} onHide={handleClose} centered style={styles.fadeIn}>
        <ModalHeader closeButton style={styles.modalHeader}>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap pb-3">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>
          <Form className="mb-3">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Rename Group"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                style={styles.formControl}
              />
            </Form.Group>
            <Button
              variant="success"
              onMouseEnter={(e) => (e.target.style.backgroundColor = styles.renameButtonHover.backgroundColor)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = styles.renameButton.backgroundColor)}
              style={styles.renameButton}
              onClick={handleRename}
              disabled={renameLoading}
            >
              {renameLoading ? <Spinner animation="border" size="sm" /> : "Update"}
            </Button>
          </Form>
          <Form>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
                style={styles.formControl}
              />
            </Form.Group>
          </Form>

          {loading ? (
            <div style={styles.spinnerContainer}>
              <Spinner animation="border" />
            </div>
          ) : (
            searchResult?.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.leaveButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.leaveButton.backgroundColor)}
            style={styles.leaveButton}
            onClick={() => handleRemove(user)}
          >
            Leave Group
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
