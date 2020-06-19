import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GameLobbyChat = ({ socket, username }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatClass, setChatClass] = useState("");
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const preGameScreenIsOpen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen
  );
  const currentChatRoomName = useSelector(
    (state) => state.chat.currentChatRoomName
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
      message,
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
      return (
        <li
          className={`chat-message chat-message-${message.style}`}
          key={message.timeStamp + " " + message.message}
        >
          {message.author} : {message.message}
        </li>
      );
    });
  }

  return (
    <div className={`game-lobby-chat-stream-holder ${chatClass}`}>
      <div className="game-lobby-chat-stream">
        <ul>{messagesToDisplay}</ul>
      </div>
      <div className="game-lobby-chat-input-holder">
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type="text"
            className="text-input-transparent"
            onChange={(e) => onChange(e)}
            value={chatInput}
            placeholder="Enter a message to chat..."
          ></input>
        </form>
      </div>
    </div>
  );
};

export default GameLobbyChat;
