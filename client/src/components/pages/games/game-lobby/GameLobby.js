import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../../../actions/alert";
import GameLobbyChat from "./GameLobbyChat";
import GameLobbyTopButtons from "./GameLobbyTopButtons";
import GameLobbyTopInfoBox from "./GameLobbyTopInfoBox";
import GameLobbySideBar from "./GameLobbySideBar";
import PreGameRoom from "./PreGameRoom";
import GameList from "./GameList";
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
    false
  );
  const [currentChatRoomUsers, setCurrentChatRoomUsers] = useState({});
  const [newRoomLoading, setNewRoomLoading] = useState(true);
  const [chatClass, setChatClass] = useState("");
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState(
    "height-0-hidden"
  );
  const [gameListDisplayClass, setGameListDisplayClass] = useState(
    "height-0-hidden"
  );
  const [gameListButtonDisplayClass, setGameListButtonDisplayClass] = useState(
    "chat-button-hidden"
  );
  const [preGameButtonDisplayClass, setPreGameButtonDisplayClass] = useState(
    "chat-button-hidden"
  );
  const [chatButtonDisplayClass, setChatButtonDisplayClass] = useState("");
  const [chatButtonsDisplayClass, setChatButtonsDisplayClass] = useState("");
  const [authenticating, setAuthenticating] = useState(true);
  const [gameList, setGameList] = useState({});
  const [currentGame, setCurrentGame] = useState("");

  const username = user ? user.name : "Anon";
  let authToken = null;

  // setup socket
  useEffect(() => {
    authToken = localStorage.token;
    let query = { token: null };
    console.log(authToken);
    if (authToken) {
      query.token = authToken;
    }
    socket = io("localhost:5000", { query });
    return () => {
      socket.disconnect();
    };
  }, [localStorage.token]);
  useEffect(() => {
    socket.on("authenticationFinished", (data) => {
      console.log("authenticationFinished");
      setAuthenticating(false);
    });
  });
  useEffect(() => {
    console.log("requested join room");
    if (!authenticating) {
      socket.emit("clientRequestsToJoinRoom", {
        roomToJoin: currentChatRoom,
      });
    }
  }, [authenticating]);
  // handle new messages from io
  useEffect(() => {
    socket.on("newMessage", async (message) => {
      const msgForReduxStore = { message, room: currentChatRoom };
      newChatMessage(msgForReduxStore);
    });
    return () => {
      socket.off("newMessage");
    };
  }, [currentChatRoom]);
  // handle new room data
  useEffect(() => {
    socket.on("updateRoomUserList", (data) => {
      console.log("room updated");
      setNewRoomLoading(false);
      const { roomName, currentUsers } = data;
      setCurrentChatRoomUsers(currentUsers);
      setCurrentChatRoom(roomName);
    });
    return () => {
      socket.off("updateRoomUserList");
    };
  }, [currentChatRoom]);
  useEffect(() => {
    socket.on("gameListUpdate", (data) => {
      console.log(data);
      setGameList(data);
    });
    return () => {
      socket.off("gameListUpdate");
    };
  }, []);
  // sending a message
  const sendNewMessage = (message) => {
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
  const onJoinRoomSubmit = (e) => {
    e.preventDefault();
    joinRoom(joinNewRoomInput);
  };
  const joinRoom = (roomToJoin) => {
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
      setCurrentGame(gameName);
      socket.emit("clientHostsNewGame", { gameName });
    } else {
      setAlert("Please enter a game name", "danger");
    }
  };
  // join games
  const onViewGamesListClick = () => {
    setChatClass("viewing-game-list");
    setGameListDisplayClass("");
    setChatButtonDisplayClass("chat-button-hidden");
    setChatButtonsDisplayClass("chat-buttons-hidden");
    setGameListButtonDisplayClass("");
  };
  const onJoinGameClick = (gameName) => {
    console.log("clicked to join game " + gameName);
    if (gameName) {
      setCurrentGame(gameName);
      socket.emit("clientJoinsGame", { gameName });
    } else {
      setAlert("No game by that name exists", "danger");
    }
  };
  const onJoinGameBackClick = () => {
    setChatClass("");
    setGameListDisplayClass("height-0-hidden");
    setChatButtonDisplayClass("");
    setChatButtonsDisplayClass("");
    setGameListButtonDisplayClass("chat-button-hidden");
  };
  // leave game
  const onLeaveGameClick = () => {
    setChatClass("");
    setPreGameRoomDisplayClass("height-0-hidden");
    setChatButtonDisplayClass("");
    setChatButtonsDisplayClass("");
    setPreGameButtonDisplayClass("chat-button-hidden");
    console.log("client leaving game " + currentGame);
    socket.emit("clientLeavesGame", currentGame);
  };
  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status) => {
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
          onViewGamesListClick={onViewGamesListClick}
          onJoinGameBackClick={onJoinGameBackClick}
          chatButtonDisplayClass={chatButtonDisplayClass}
          chatButtonsDisplayClass={chatButtonsDisplayClass}
          preGameButtonDisplayClass={preGameButtonDisplayClass}
          gameListButtonDisplayClass={gameListButtonDisplayClass}
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
          <GameList
            gameList={gameList}
            gameListDisplayClass={gameListDisplayClass}
            onJoinGameClick={onJoinGameClick}
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

const mapStateToProps = (state) => ({
  auth: state.auth,
  chat: state.chat,
});

export default connect(mapStateToProps, { newChatMessage, setAlert })(
  GameLobby
);
