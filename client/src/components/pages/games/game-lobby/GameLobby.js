import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GameLobbyTopBar from "./GameLobbyTopBar";
import GameLobbyChat from "./GameLobbyChat";
import io from "socket.io-client";
import { getCurrentProfile } from "../../../../actions/profile";
import { newChatMessage } from "../../../../actions/chat";
// import { serverIp } from "../../../../config/config";
const socket = io("localhost:5000"); // { transports: ["websocket"] } // some reason had to type this in directly, not use config file variable

const GameLobby = ({
  getCurrentProfile,
  loadProfile,
  profile: { profile },
  defaultChatRoom,
  newChatMessage
}) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(defaultChatRoom);

  // useEffect(() => {
  //   socket.connect();
  // }, [null]);

  useEffect(() => {
    if (!profile) {
      async function loadProfile() {
        await getCurrentProfile();
      }
      loadProfile();
    }
  }, [getCurrentProfile, loadProfile, profile]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Requesting to join room: " + currentChatRoom);
      socket.emit("clientRequestsToJoinRoom", { currentChatRoom });
    });
    return () => {
      console.log("disconnecting socket");
      socket.disconnect();
    };
  }, [currentChatRoom]);

  useEffect(() => {
    socket.on("newMessage", message => {
      const msgForReduxStore = { message, room: currentChatRoom };
      newChatMessage(msgForReduxStore);
    });
  }, [currentChatRoom, newChatMessage]);

  const sendNewMessage = message => {
    const author = profile ? profile.name : "Anon";
    const messageToSend = {
      currentChatRoom,
      author,
      style: "normal",
      message
    };
    socket.emit("clientSendsNewChat", messageToSend);
  };

  return (
    <div className="game-lobby">
      <GameLobbyTopBar />
      <GameLobbyChat
        currentChatRoom={currentChatRoom}
        sendNewMessage={sendNewMessage}
      />
    </div>
  );
};

GameLobby.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  newChatMessage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, newChatMessage })(
  GameLobby
);
