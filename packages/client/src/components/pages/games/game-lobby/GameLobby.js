import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { setAlert } from "../../../../store/actions/alert";
import GameLobbyChat from "./GameLobbyChat";
import MainButtons from "./main-buttons/MainButtons";
import ChannelBar from "./channel-bar/ChannelBar";
import PreGameRoom from "./PreGameRoom";
import MatchmakingQueueDisplay from "./MatchmakingQueueDisplay";
import GameList from "./GameList";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import ScoreScreenModalContents from "./ScoreScreenModalContents";
import Modal from "../../../common/modal/Modal";
import io from "socket.io-client";
import SocketManager from "../socket-manager/SocketManager";
import BattleRoomGameInstance from "../battle-room/BattleRoomGameInstance";
import * as gameUiActions from "../../../../store/actions/game-ui";
import * as lobbyUiActions from "../../../../store/actions/lobby-ui";
// import { serverIp } from "../../../../config/config";
let socket; // { transports: ["websocket"] } // some reason had to type this in directly, not use config file variable
// const socketAddress = process.env.REACT_APP_DEV_MODE ? process.env.REACT_APP_SOCKET_API_DEV : process.env.REACT_APP_SOCKET_API
const socketAddress = "http://45.77.203.192"

const GameLobby = ({ auth: { loading, user }, defaultChatRoom }) => {
  const dispatch = useDispatch();
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(
    false,
  );
  const scoreScreenDisplayed = useSelector(
    (state) => state.lobbyUi.scoreScreenDisplayed,
  );
  const [authenticating, setAuthenticating] = useState(true);
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);
  const username = user ? user.name : "Anon";
  let authToken = null;

  // setup socket
  useEffect(() => {
    authToken = localStorage.token;
    let query = { token: null };
    if (authToken) {
      query.token = authToken;
    }
    socket = io.connect(socketAddress, { query });
    console.log(socket)
    return () => {
      socket.disconnect();
      dispatch(gameUiActions.setCurrentGame(null));
      dispatch(gameUiActions.closePreGameScreen());
    };
  }, [localStorage.token]);

  useEffect(() => {
    console.log("authenticating")
    socket.on("authenticationFinished", () => {
      console.log("auth finished")
      setAuthenticating(false);
    });
  });

  // join initial room
  useEffect(() => {
    if (!authenticating) {
      socket.emit("clientRequestsToJoinRoom", {
        roomToJoin: defaultChatRoom,
      });
    }
  }, [authenticating, defaultChatRoom]);

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setChannelModalParentDisplay = (status) => {
    setDisplayChangeChannelModal(status);
  };
  const setScoreScreenModalParentDisplay = () => {
    dispatch(lobbyUiActions.closeScoreScreen());
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
    setDisplayChangeChannelModal(false);
    setJoinNewRoomInput("");
    socket.emit("clientRequestsToJoinRoom", { roomToJoin, username });
  };

  return (
    <Fragment>
      <SocketManager socket={socket} />
      <Modal
        frameClass="modal-frame-dark"
        isOpen={displayChangeChannelModal}
        setParentDisplay={setChannelModalParentDisplay}
        title={"Join Channel"}
      >
        <ChangeChannelModalContents
          setJoinNewRoomInput={setJoinNewRoomInput}
          joinNewRoomInput={joinNewRoomInput}
          onJoinRoomSubmit={onJoinRoomSubmit}
          joinRoom={joinRoom}
        />
      </Modal>
      <Modal
        frameClass="modal-frame-dark"
        isOpen={scoreScreenDisplayed}
        setParentDisplay={setScoreScreenModalParentDisplay}
        title={"Score Screen"}
      >
        <ScoreScreenModalContents />
      </Modal>
      {gameStatus !== "inProgress" && gameStatus !== "ending" ? (
        <Fragment>
          <div className={`game-lobby`}>
            <MainButtons
              socket={socket}
              showChangeChannelModal={showChangeChannelModal}
            />
            <ChannelBar socket={socket} defaultChatRoom={defaultChatRoom} />
            <div className="game-lobby-main-window">
              <PreGameRoom socket={socket} />
              <MatchmakingQueueDisplay />
              <GameList socket={socket} />
              <GameLobbyChat socket={socket} username={username} />
            </div>
          </div>
        </Fragment>
      ) : (
        <BattleRoomGameInstance socket={socket} />
      )}
    </Fragment>
  );
};

GameLobby.propTypes = {
  defaultChatRoom: PropTypes.string,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  chat: state.chat,
});

export default connect(mapStateToProps, { setAlert })(GameLobby);
