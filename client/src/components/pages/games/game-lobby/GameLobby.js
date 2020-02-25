import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GameLobbyTopBar from "./GameLobbyTopBar";
import GameLobbyChat from "./GameLobbyChat";
import io from "socket.io-client";
import { getCurrentProfile } from "../../../../actions/profile";
import { newChatMessage } from "../../../../actions/chat";
import { serverIp } from "../../../../config/config";
const socket = io.connect(serverIp);

const GameLobby = ({
  auth: { isAuthenticated, loading },
  getCurrentProfile,
  loadProfile,
  profile: { profile },
  defaultChatRoom
}) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(defaultChatRoom);

  useEffect(() => {
    if (!profile) {
      async function loadProfile() {
        await getCurrentProfile();
        socket.emit("clientRequestsToJoinRoom", { currentChatRoom });
      }
      loadProfile();
    } else {
      socket.emit("clientRequestsToJoinRoom", { currentChatRoom });
    }
  }, [getCurrentProfile, loadProfile, currentChatRoom, profile]);

  useEffect(() => {
    socket.on("newMessage", message => {
      console.log(message);
      const msgForReduxStore = { ...message, room: currentChatRoom };
      newChatMessage(msgForReduxStore);
    });

    return () => {
      socket.disconnect();
    };
  });

  return (
    <div className="game-lobby">
      <GameLobbyTopBar />
      <GameLobbyChat />
    </div>
  );
};

GameLobby.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, newChatMessage })(
  GameLobby
);
