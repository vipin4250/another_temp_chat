import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <OverlayTrigger
                placement="bottom-start"
                overlay={
                  <Tooltip id={`tooltip-${m._id}`}>
                    {m.sender.name}
                  </Tooltip>
                }
              >
                <img
                  alt={m.sender.name}
                  src={m.sender.picture}
                  className="rounded-circle"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginTop: "7px",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                />
              </OverlayTrigger>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
