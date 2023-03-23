import React, { useState } from "react";
import { Socket } from "socket.io-client";
import Modal from "../../common-components/Modal";
import { defaultChatChannelNames, SocketEventsFromClient } from "../../../../../common";

export default function ChangeChatChannelModal({ socket, setParentDisplay }: { socket: Socket; setParentDisplay: (modalDisplayed: boolean) => void }) {
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");

  // this is a separate function because it is also called by the buttons, not only the form
  const joinRoom = (chatChannelToJoin: string) => {
    setParentDisplay(false);
    setJoinNewRoomInput("");
    if (socket) socket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, chatChannelToJoin);
  };

  const onJoinRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinRoom(joinNewRoomInput);
  };

  return (
    <Modal title="Change chat channel" backdropStyle="" setParentDisplay={setParentDisplay}>
      <form onSubmit={(e) => onJoinRoomSubmit(e)}>
        <p className="change-chat-channel-modal__description">Type any channel name, or choose from a list of suggested channels:</p>
        <label htmlFor="change-chat-channel-input">
          Channel name:
          <input
            autoFocus
            className="input input--transparent change-chat-channel-modal__input"
            onChange={(e) => {
              setJoinNewRoomInput(e.target.value);
            }}
            value={joinNewRoomInput}
            type="text"
            id="change-chat-channel-input"
            aria-label="channel to join"
            placeholder="Channel to join..."
          />
        </label>
        <div className="change-chat-channel-modal__default-channel-buttons">
          {Object.values(defaultChatChannelNames).map((name) => (
            <button type="button" className="button " key={name} onClick={() => joinRoom(name)}>
              {name}
            </button>
          ))}
        </div>
      </form>
    </Modal>
  );
}
