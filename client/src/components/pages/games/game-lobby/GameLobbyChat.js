import React, { useState } from "react";
import { connect } from "react-redux";

const GameLobbyChat = ({
  chat,
  currentChatRoom,
  sendNewMessage,
  chatClass
}) => {
  const [chatInput, setChatInput] = useState("");

  const onChange = e => {
    setChatInput(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    sendNewMessage(chatInput);
    setChatInput("");
  };

  let messagesToDisplay;

  if (chat[currentChatRoom]) {
    messagesToDisplay = chat[currentChatRoom].map(message => {
      return (
        <li
          className={`chat-message chat-message-${message.style}`}
          key={message.timeStamp}
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
        <form onSubmit={e => onSubmit(e)}>
          <input
            type="text"
            className="text-input-transparent"
            onChange={e => onChange(e)}
            value={chatInput}
            placeholder="Enter a message to chat..."
          ></input>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile,
  chat: state.chat
});

export default connect(mapStateToProps)(GameLobbyChat);
