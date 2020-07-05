import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";

const GameLobbyChat = ({ socket, username }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatClass, setChatClass] = useState("");
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const preGameScreenIsOpen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen,
  );
  const currentChatRoomName = useSelector(
    (state) => state.chat.currentChatRoomName,
  );
  const allMessages = useSelector((state) => state.chat.messages);

  useEffect(() => {
    if (gameListIsOpen) setChatClass("viewing-game-list");
    if (preGameScreenIsOpen) setChatClass("game-setup");
    if (!gameListIsOpen && !preGameScreenIsOpen) setChatClass("");
  }, [gameListIsOpen, preGameScreenIsOpen]);

  const onChange = (e) => {
    setChatInput(e.target.value);
  };

  // sending a message
  const sendNewMessage = (message) => {
    if (message === "") return;
    console.log("sending message in room " + currentChatRoomName);
    const author = username;
    const messageToSend = {
      currentChatRoomName,
      author,
      style: "normal",
      messageText: message,
    };
    socket.emit("clientSendsNewChat", messageToSend);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    sendNewMessage(chatInput);
    setChatInput("");
  };

  // create chat message display elements
  let messagesToDisplay;
  if (allMessages) {
    messagesToDisplay = allMessages.map((message) => {
      console.log(message);
      return (
        <li
          className={`chat-message chat-message-${message.style}`}
          key={message.timeStamp + " " + message.messageText}
        >
          {message.author} : {message.messageText}
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
