import { AiOutlineClose } from "react-icons/ai"; // Import a close icon from react-icons
import React from "react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      className="badge-item d-inline-flex align-items-center bg-primary text-white rounded-pill px-3 py-2 m-1"
      style={{ cursor: "pointer" }}
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <AiOutlineClose className="ms-2" />
    </span>
  );
};

export default UserBadgeItem;

