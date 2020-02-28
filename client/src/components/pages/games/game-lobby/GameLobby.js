import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GameLobbyTopBar from "./GameLobbyTopBar";
import GameLobbyChat from "./GameLobbyChat";
import Modal from "../../../common/modal/Modal";
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
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(
    false
  );
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
    }
  }, [loading]);

  useEffect(() => {
    socket.on("updateRoomUserList", data => {
      setCurrentChatRoomUsers(data.currentUsers);
    });
  }, []);

  useEffect(() => {
    socket.on("newMessage", message => {
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
  const onJoinRoomSubmit = e => {
    e.preventDefault();
    setDisplayChangeChannelModal(false);
    console.log("join room " + joinNewRoomInput);
  };

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = status => {
    setDisplayChangeChannelModal(status);
  };
  const showChangeChannelModal = () => {
    setDisplayChangeChannelModal(true);
  };

  return (
    <div className="game-lobby">
      <Modal
        screenClass=""
        frameClass=""
        isOpen={displayChangeChannelModal}
        setParentDisplay={setParentDisplay}
        title={"Join Channel"}
      >
        <form onSubmit={e => onJoinRoomSubmit(e)}>
          <input
            className={"text-input-transparent"}
            onChange={e => setJoinNewRoomInput(e.target.value)}
          ></input>
        </form>
      </Modal>
      <GameLobbyTopBar
        channelName={currentChatRoom}
        currentChatRoomUsers={currentChatRoomUsers}
        showChangeChannelModal={showChangeChannelModal}
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
