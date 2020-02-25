import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const GameLobbyChat = ({ profile }) => {
  const [chatInput, setChatInput] = useState("");

  const onChange = e => {
    setChatInput(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    console.log("submat " + e);
    // emit message to the room
    // update redux store adding to this room's messages
  };
  console.log(profile);

  return (
    <div className="game-lobby-chat">
      <div className="game-lobby-chat-stream-holder">
        <div className="game-lobby-chat-stream"></div>
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
      <div className="game-lobby-players-list">{}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps)(GameLobbyChat);
