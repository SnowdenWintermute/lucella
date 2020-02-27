import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GameLobbyTopBar from "./GameLobbyTopBar";
import GameLobbyChat from "./GameLobbyChat";
import io from "socket.io-client";
import { getCurrentProfile } from "../../../../actions/profile";
import { newChatMessage } from "../../../../actions/chat";
// import { serverIp } from "../../../../config/config";
let socket; // { transports: ["websocket"] } // some reason had to type this in directly, not use config file variable

const GameLobby = ({
  auth: { loading, user },
  defaultChatRoom,
  newChatMessage
}) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(defaultChatRoom);
  const [currentChatRoomUsers, setCurrentChatRoomUsers] = useState({});

  const username = user ? user.name : "Anon";

  useEffect(() => {
    socket = io("localhost:5000");
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      socket.emit("clientRequestsToJoinRoom", { currentChatRoom, username });
      console.log({ currentChatRoom, username });
    }
  }, [loading]);

  useEffect(() => {}, []);

  useEffect(() => {
    socket.on("updateRoomUserList", data => {
      console.log(data.currentUsers);
      setCurrentChatRoomUsers(data.currentUsers);
    });
  }, []);

  useEffect(() => {
    socket.on("newMessage", message => {
      console.log(message);
      const msgForReduxStore = { message, room: currentChatRoom };
      newChatMessage(msgForReduxStore);
    });
  }, [currentChatRoom, newChatMessage]);

  const sendNewMessage = message => {
    const author = username;
    const messageToSend = {
      currentChatRoom,
      author,
      style: "normal",
      message
    };
    socket.emit("clientSendsNewChat", messageToSend);
  };

  const joinRoom = roomName => {
    socket.emit("clientRequestsToJoinRoom", roomName);
  };

  return (
    <div className="game-lobby">
      <GameLobbyTopBar
        channelName={currentChatRoom}
        currentChatRoomUsers={currentChatRoomUsers}
        joinRoom={joinRoom}
      />
      <GameLobbyChat
        currentChatRoom={currentChatRoom}
        currentChatRoomUsers={currentChatRoomUsers}
        sendNewMessage={sendNewMessage}
      />
    </div>
  );
};

GameLobby.propTypes = {
  newChatMessage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { newChatMessage })(GameLobby);
