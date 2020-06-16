import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { setAlert } from "../../../../store/actions/alert";
import GameLobbyChat from "./GameLobbyChat";
import MainButtons from "./main-buttons/MainButtons";
import ChannelBar from "./channel-bar/ChannelBar";
import PreGameRoom from "./PreGameRoom";
import GameList from "./GameList";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import Modal from "../../../common/modal/Modal";
import io from "socket.io-client";
import { newChatMessage } from "../../../../store/actions/chat";
// import { serverIp } from "../../../../config/config";
let socket; // { transports: ["websocket"] } // some reason had to type this in directly, not use config file variable

const GameLobby = ({ auth: { loading, user }, defaultChatRoom }) => {
  const dispatch = useDispatch();
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(
    false
  );

  const [authenticating, setAuthenticating] = useState(true);
  const [currentGame, setCurrentGame] = useState("");

  const username = user ? user.name : "Anon";
  let authToken = null;

  // setup socket
  useEffect(() => {
    authToken = localStorage.token;
    let query = { token: null };
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

  // errors
  useEffect(() => {
    socket.on("errorMessage", (data) => {
      console.log(data);
    });
  });

  // join initial room
  useEffect(() => {
    if (!authenticating) {
      socket.emit("clientRequestsToJoinRoom", {
        roomToJoin: defaultChatRoom,
      });
    }
  }, [authenticating]);

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status) => {
    setDisplayChangeChannelModal(status);
  };
  const showChangeChannelModal = () => {
    setDisplayChangeChannelModal(true);
  };
  // joining new rooms
  const onJoinRoomSubmit = (e) => {
    e.preventDefault();
    joinRoom(joinNewRoomInput);
  };
  const joinRoom = (roomToJoin) => {
    // if (roomToJoin.toLowerCase() !== currentChatRoom) setNewRoomLoading(true);
    setDisplayChangeChannelModal(false);
    setJoinNewRoomInput("");
    socket.emit("clientRequestsToJoinRoom", { roomToJoin, username });
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
        <MainButtons
          socket={socket}
          showChangeChannelModal={showChangeChannelModal}
        />
        <ChannelBar socket={socket} defaultChatRoom={defaultChatRoom} />
        <div className="game-lobby-main-window">
          <PreGameRoom socket={socket} />
          <GameList socket={socket} />
          <GameLobbyChat socket={socket} username={username} />
        </div>
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
