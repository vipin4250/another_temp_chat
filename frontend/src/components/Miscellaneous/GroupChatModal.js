import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { ENDPOINT } from "../../config/variable";  // Adjust the path if necessary


// const ENDPOINT = "http://localhost:3000"; // Updated backend endpoint

const GroupChatModal = ({ children }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;


  const { user, chats, setChats } = ChatState();

  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      alert("Error occurred! Failed to load the search results.");
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${ENDPOINT}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      alert("New Group Chat Created!");
    } catch (error) {
      alert("Failed to create the chat!");
    }
  };

  return (
    <>
      <span onClick={handleOpen}>{children}</span>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="fade modal-custom"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="groupChatName">
              <Form.Label>Chat Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter chat name"
                onChange={(e) => setGroupChatName(e.target.value)}
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group controlId="addUsers" className="mt-3">
              <Form.Label>Add Users</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add Users (e.g., John, Piyush, Jane)"
                onChange={(e) => handleSearch(e.target.value)}
                className="form-control-custom"
              />
            </Form.Group>
          </Form>

          <div className="d-flex flex-wrap mt-3">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </div>

          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" />
            </div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="btn-custom">
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="btn-custom">
            Create Chat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Custom Styling */}
      <style jsx="true">{`
        .modal-custom .modal-content {
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.5s ease-in-out;
        }

        .modal-header-custom {
          background-color: #f8f9fa;
          border-bottom: none;
        }

        .form-control-custom {
          border-radius: 8px;
          border: 1px solid #ced4da;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          border-color: #80bdff;
        }

        .btn-custom {
          border-radius: 8px;
          padding: 10px 20px;
          transition: background-color 0.3s ease;
        }

        .btn-custom:hover {
          background-color: #0056b3;
          color: white;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default GroupChatModal;
