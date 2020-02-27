import React, { useState } from "react";
import { connect } from "react-redux";

const GameLobbyChat = ({
  profile: { profile },
  chat,
  currentChatRoom,
  currentChatRoomUsers,
  sendNewMessage
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

  let usersInChannelToDisplay = [];
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

  Object.keys(currentChatRoomUsers).forEach(key => {
    usersInChannelToDisplay.push(<div key={key}>{key}</div>);
  });

  return (
    <div className="game-lobby-chat">
      <div className="game-lobby-chat-stream-holder">
        <div className="game-lobby-chat-stream">
          <ul>{messagesToDisplay}</ul>
        </div>
        <div className="game-lobby-chat-input-holder">
          <form onSubmit={e => onSubmit(e)}>
            <input
              type="text"
              className="chat-text-input"
              onChange={e => onChange(e)}
              value={chatInput}
              placeholder="Enter a message to chat..."
            ></input>
          </form>
        </div>
      </div>
      <div className="game-lobby-players-list">{usersInChannelToDisplay}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile,
  chat: state.chat
});

export default connect(mapStateToProps)(GameLobbyChat);
