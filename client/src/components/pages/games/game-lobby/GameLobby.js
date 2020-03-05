import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../../../actions/alert";
import GameLobbyChat from "./GameLobbyChat";
import GameLobbyTopButtons from "./GameLobbyTopButtons";
import GameLobbyTopInfoBox from "./GameLobbyTopInfoBox";
import GameLobbySideBar from "./GameLobbySideBar";
import PreGameRoom from "./PreGameRoom";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import Modal from "../../../common/modal/Modal";
import io from "socket.io-client";
import { newChatMessage } from "../../../../actions/chat";
// import { serverIp } from "../../../../config/config";
let socket; // { transports: ["websocket"] } // some reason had to type this in directly, not use config file variable

const GameLobby = ({
  auth: { loading, user },
  setAlert,
  defaultChatRoom,
  newChatMessage,
}) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(defaultChatRoom);
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(
    false,
  );
  const [currentChatRoomUsers, setCurrentChatRoomUsers] = useState({});
  const [newRoomLoading, setNewRoomLoading] = useState(true);
  const [chatClass, setChatClass] = useState("");
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState(
    "height-0-hidden",
  );
  const [preGameButtonDisplayClass, setPreGameButtonDisplayClass] = useState(
    "chat-button-hidden",
  );
  const [chatButtonDisplayClass, setChatButtonDisplayClass] = useState("");
  const [chatButtonsDisplayClass, setChatButtonsDisplayClass] = useState("");

  const username = user ? user.name : "Anon";
  // setup socket
  useEffect(() => {
    socket = io("localhost:5000");
    return () => {
      socket.disconnect();
    };
  }, []);
  // once profile is loaded (or found to be null), join default room (passed from parent)
  useEffect(() => {
    if (!loading) {
      socket.emit("clientRequestsToJoinRoom", {
        roomToJoin: currentChatRoom,
        username,
      });
    }
  }, [loading, username]);
  // handle new messages from io
  useEffect(() => {
    socket.on("newMessage", async message => {
      const msgForReduxStore = { message, room: currentChatRoom };
      newChatMessage(msgForReduxStore);
    });
    return () => {
      socket.off("newMessage");
    };
  }, [currentChatRoom]);
  // handle new room data
  useEffect(() => {
    socket.on("updateRoomUserList", data => {
      setNewRoomLoading(false);
      const { roomName, currentUsers } = data;
      setCurrentChatRoomUsers(currentUsers);
      setCurrentChatRoom(roomName);
    });
    return () => {
      socket.off("updateRoomUserList");
    };
  }, [currentChatRoom]);
  // sending a message
  const sendNewMessage = message => {
    if (message === "") return;
    const author = username;
    const messageToSend = {
      currentChatRoom,
      author,
      style: "normal",
      message,
    };
    socket.emit("clientSendsNewChat", messageToSend);
  };
  // joining new rooms
  const onJoinRoomSubmit = e => {
    e.preventDefault();
    joinRoom(joinNewRoomInput);
  };
  const joinRoom = roomToJoin => {
    if (roomToJoin.toLowerCase() !== currentChatRoom) setNewRoomLoading(true);
    setDisplayChangeChannelModal(false);
    setJoinNewRoomInput("");
    socket.emit("clientRequestsToJoinRoom", { roomToJoin, username });
  };
  // host game
  const onHostGameClick = () => {
    setChatClass("game-setup");
    setPreGameRoomDisplayClass("");
    setChatButtonDisplayClass("chat-button-hidden");
    setChatButtonsDisplayClass("chat-buttons-hidden");
    setPreGameButtonDisplayClass("");
  };
  const hostNewGame = ({ gameName }) => {
    if (gameName) {
      socket.emit("clientHostsNewGame", { gameName });
    } else {
      setAlert("Please enter a game name", "danger");
    }
  };
  // leave game
  const onLeaveGameClick = () => {
    setChatClass("");
    setPreGameRoomDisplayClass("height-0-hidden");
    setChatButtonDisplayClass("");
    setChatButtonsDisplayClass("");
    setPreGameButtonDisplayClass("chat-button-hidden");
  };
  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = status => {
    setDisplayChangeChannelModal(status);
  };
  const showChangeChannelModal = () => {
    setDisplayChangeChannelModal(true);
  };

  return (
    <Fragment>
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={displayChangeChannelModal}
        setParentDisplay={setParentDisplay}
        title={"Join Channel"}
      >
        <ChangeChannelModalContents
          setJoinNewRoomInput={setJoinNewRoomInput}
          joinNewRoomInput={joinNewRoomInput}
          onJoinRoomSubmit={onJoinRoomSubmit}
          joinRoom={joinRoom}
        />
      </Modal>
      <div className={`game-lobby`}>
        <GameLobbyTopButtons
          showChangeChannelModal={showChangeChannelModal}
          onHostGameClick={onHostGameClick}
          onLeaveGameClick={onLeaveGameClick}
          chatButtonDisplayClass={chatButtonDisplayClass}
          chatButtonsDisplayClass={chatButtonsDisplayClass}
          preGameButtonDisplayClass={preGameButtonDisplayClass}
        />
        <GameLobbyTopInfoBox
          newRoomLoading={newRoomLoading}
          channelName={currentChatRoom}
          currentChatRoomUsers={currentChatRoomUsers}
        />
        <div className="game-lobby-main-window">
          <PreGameRoom
            hostNewGame={hostNewGame}
            preGameRoomDisplayClass={preGameRoomDisplayClass}
            socket={socket}
          />
          <GameLobbyChat
            currentChatRoom={currentChatRoom}
            currentChatRoomUsers={currentChatRoomUsers}
            sendNewMessage={sendNewMessage}
            chatClass={chatClass}
          />
        </div>
        <GameLobbySideBar currentChatRoomUsers={currentChatRoomUsers} />
      </div>
    </Fragment>
  );
};

GameLobby.propTypes = {
  newChatMessage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat,
});

export default connect(mapStateToProps, { newChatMessage, setAlert })(
  GameLobby,
);
