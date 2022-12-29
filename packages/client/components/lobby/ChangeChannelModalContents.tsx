import React from "react";
import { defaultChatChannelNames } from "../../../common";
import ButtonBasic from "../common-components/buttons/ButtonBasic";

interface Props {
  setJoinNewRoomInput: (roomName: string) => void;
  joinNewRoomInput: string;
  onJoinRoomSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  joinRoom: (roomName: string) => void;
}

function ChangeChannelModalContents({ setJoinNewRoomInput, joinNewRoomInput, onJoinRoomSubmit, joinRoom }: Props) {
  return (
    <form onSubmit={(e) => onJoinRoomSubmit(e)}>
      <p>Type any channel name, or choose from a list of suggested channels:</p>
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        className="text-input-transparent mb-15"
        onChange={(e) => {
          setJoinNewRoomInput(e.target.value);
        }}
        value={joinNewRoomInput}
        type="text"
        aria-label="channel to join"
        placeholder="Channel to join..."
      />
      <div className="modal-option-buttons-grid">
        {Object.values(defaultChatChannelNames).map((name) => (
          <ButtonBasic title={name} key={name} onClick={() => joinRoom(name)} />
        ))}
      </div>
    </form>
  );
}

export default ChangeChannelModalContents;
