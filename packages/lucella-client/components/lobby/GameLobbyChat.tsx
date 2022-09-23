import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../store";
import { ChatState } from "../../../../store/reducers/chat";
import { GameUIState } from "../../../../store/reducers/game-ui";

interface Props {
  socket: Socket;
  username: string;
}

const GameLobbyChat = ({ socket, username }: Props) => {
  const [chatInput, setChatInput] = useState("");
  const [chatClass, setChatClass] = useState("");
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const gameListIsOpen = gameUiState.gameList.isOpen;
  const preGameScreenIsOpen = gameUiState.preGameScreen.isOpen;
  const matchmakingScreenIsOpen = gameUiState.matchmakingScreen.isOpen;
  const chatState: ChatState = useSelector((state: RootState) => state.chat);
  const { currentChatRoomName, messages } = chatState;

  useEffect(() => {
    if (gameListIsOpen) setChatClass("chat-stream-top-border");
    if (preGameScreenIsOpen) setChatClass("chat-stream-top-border");
    if (matchmakingScreenIsOpen) setChatClass("chat-stream-top-border");
    if (!gameListIsOpen && !preGameScreenIsOpen && !matchmakingScreenIsOpen) setChatClass("");
  }, [gameListIsOpen, preGameScreenIsOpen, matchmakingScreenIsOpen]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const sendNewMessage = (message: string) => {
    if (message === "") return;
    const author = username;
    const messageToSend = {
      currentChatRoomName,
      author,
      style: "normal",
      messageText: message,
    };
    socket.emit("clientSendsNewChat", messageToSend);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendNewMessage(chatInput);
    setChatInput("");
  };

  let messagesToDisplay;
  if (messages) {
    messagesToDisplay = messages.map((message) => {
      return (
        <li className={`chat-message chat-message-${message.style}`} key={message.timeStamp + " " + message.text}>
          {message.author} : {message.text}
        </li>
      );
    });
  }

  return (
    <Fragment>
      <div className={`game-lobby-chat-stream ${chatClass}`}>
        <ul>{messagesToDisplay}</ul>
      </div>
      <div className="game-lobby-chat-input-holder">
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type="text"
            className="text-input-transparent game-lobby-chat-input"
            onChange={(e) => onChange(e)}
            value={chatInput}
            placeholder="Enter a message to chat..."
          ></input>
        </form>
      </div>
    </Fragment>
  );
};

export default GameLobbyChat;
