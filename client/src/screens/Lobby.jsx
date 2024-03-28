import React, { useState, useCallback, useEffect } from "react";
import textChat from "../images/text-chat.jpg";
import videoChat from "../images/video-chat.png";
import "../styling/lobby.css";

import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  // const [email, setEmail] = useState("");
  // const [room, setRoom] = useState("");
  const [interest, setInterest] = useState("");
  const [area, setArea] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      //  socket.emit("room:join", { email, room });
      socket.emit("room:join", { interest, area });
    },
    [interest, area, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      // const { email, room } = data;
      navigate(`/room/${data}`);
    },
    [navigate]
  );

  const handleTextChatClick = () => {
    // Handle click event for text chat button
    console.log("Text chat button clicked");
  };

  const handleVideoChatClick = () => {
    // Handle click event for video chat button
    console.log("Video chat button clicked");
  };

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <div>
        <h1>Lobby</h1>

        <form onSubmit={handleSubmitForm}>
          <label htmlFor="email">Interest</label>
          <input
            type="text"
            id="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          />
          <br />
          <label htmlFor="Area">Area</label>
          <input
            type="text"
            id="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <br />
          <div className="homepage">
            <h1>Welcome to Randomly</h1>
            <div className="button-container">
              <button className="text-chat-button" type="submit">
                <img
                  src={textChat}
                  alt="Text Chat"
                  height="80px"
                  width="120px"
                />
                Text Chat
              </button>
              <button className="video-chat-button" type="submit">
                <img
                  src={videoChat}
                  alt="Video Chat"
                  height="80px"
                  width="120px"
                />
                Video Chat
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LobbyScreen;
