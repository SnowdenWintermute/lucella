import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GameLobbyTopBar from "./GameLobbyTopBar";
import GameLobbyChat from "./GameLobbyChat";
import io from "socket.io-client";
import { getCurrentProfile } from "../../../../actions/profile";
import { serverIp } from "../../../../config/config";
const socket = io.connect(serverIp);

const GameLobby = ({
  auth: { isAuthenticated, loading },
  getCurrentProfile,
  profile,
  defaultChatRoom
}) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(defaultChatRoom);
  const [currentRoomMessages, setCurrentRoomMessages] = useState([]);

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
  }, []);

  useEffect(() => {
    socket.on("newMessage", message => {
      // update redux store for messages in this channel
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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

export default connect(mapStateToProps, { getCurrentProfile })(GameLobby);
