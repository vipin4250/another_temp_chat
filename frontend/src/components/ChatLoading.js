import React from "react";

const ChatLoading = () => {
  const skeletonStyle = {
    width: "100%",
    height: "45px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    animation: "pulse 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              background-color: #e0e0e0;
            }
            50% {
              background-color: #f0f0f0;
            }
            100% {
              background-color: #e0e0e0;
            }
          }
          .loading-stack {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        `}
      </style>

      <div className="loading-stack">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} style={skeletonStyle}></div>
        ))}
      </div>
    </>
  );
};

export default ChatLoading;
