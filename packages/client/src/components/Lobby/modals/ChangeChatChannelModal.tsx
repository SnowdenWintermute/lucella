import React, { useState } from "react";
import { Socket } from "socket.io-client";
import Modal from "../../common-components/Modal";
import { defaultChatChannelNames, SocketEventsFromClient } from "../../../../../common";
import { setNewChatChannelLoading } from "../../../redux/slices/chat-slice";
import { useAppDispatch } from "../../../redux/hooks";
import { ARIA_LABELS } from "../../../consts/aria-labels";
import { APP_TEXT } from "../../../consts/app-text";

export default function ChangeChatChannelModal({ socket, setParentDisplay }: { socket: Socket; setParentDisplay: (modalDisplayed: boolean) => void }) {
  const dispatch = useAppDispatch();
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");

  // this is a separate function because it is also called by the buttons, not only the form
  const joinRoom = (chatChannelToJoin: string) => {
    setParentDisplay(false);
    setJoinNewRoomInput("");
    dispatch(setNewChatChannelLoading(true));
    if (socket) socket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, chatChannelToJoin);
  };

  const onJoinRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!joinNewRoomInput) return;
    joinRoom(joinNewRoomInput);
  };

  return (
    <Modal title="Change chat channel" backdropStyle="" setParentDisplay={setParentDisplay} ariaLabel={ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL}>
      <form onSubmit={(e) => onJoinRoomSubmit(e)}>
        <p className="change-chat-channel-modal__description">Type any channel name, or choose from a list of suggested channels:</p>
        <label htmlFor="change-chat-channel-input">
          {APP_TEXT.MAIN_MENU.CHANNEL_MODAL_INPUT_LABEL}
          <input
            autoFocus
            className="input input--transparent change-chat-channel-modal__input"
            onChange={(e) => {
              setJoinNewRoomInput(e.target.value);
            }}
            aria-label={ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL_INPUT}
            value={joinNewRoomInput}
            type="text"
            id="change-chat-channel-input"
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
