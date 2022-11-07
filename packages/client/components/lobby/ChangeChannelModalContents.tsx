import React from "react";
import ButtonBasic from "../common-components/buttons/ButtonBasic";

interface Props {
  setJoinNewRoomInput: (roomName: string) => void;
  joinNewRoomInput: string;
  onJoinRoomSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  joinRoom: (roomName: string) => void;
}

const ChangeChannelModalContents = ({ setJoinNewRoomInput, joinNewRoomInput, onJoinRoomSubmit, joinRoom }: Props) => {
  const defaultChannelNames = ["Lindblum", "Alexandria", "Burmecia", "Battle Room Chat", "Treno", "Lurker Lounge"];
  return (
    <form onSubmit={(e) => onJoinRoomSubmit(e)}>
      <p>Type any channel name, or choose from a list of suggested channels:</p>
      <input
        autoFocus={true}
        className={"text-input-transparent mb-15"}
        onChange={(e) => {
          setJoinNewRoomInput(e.target.value);
        }}
        value={joinNewRoomInput}
        placeholder={"Channel to join..."}
      ></input>
      <div className="modal-option-buttons-grid">
        {defaultChannelNames.map((name) => (
          <ButtonBasic title={name} key={name} onClick={() => joinRoom(name.replace(/\s+/g, "-").toLowerCase())} />
        ))}
      </div>
    </form>
  );
};

export default ChangeChannelModalContents;
