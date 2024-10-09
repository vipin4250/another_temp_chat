import React from "react";
import { Dropdown } from "react-bootstrap";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div>
      <style>
        {`
          .user-list-item {
            cursor: pointer;
            display: flex;
            align-items: center;
            background-color: #e8e8e8;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            transition: background-color 0.2s;
          }

          .user-list-item:hover {
            background-color: #38b2ac;
            color: white;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .user-email {
            font-size: 12px;
            color: #6c757d; /* Bootstrap muted text color */
          }
        `}
      </style>
      <Dropdown.Item
        as="div"
        onClick={handleFunction}
        className="user-list-item"
      >
        <img
          src={user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
          alt={user.name}
          className="user-avatar"
        />
        <div>
          <strong>{user.name}</strong>
          <div className="user-email">
            <b>Email: </b>
            {user.email}
          </div>
        </div>
      </Dropdown.Item>
    </div>
  );
};

export default UserListItem;
