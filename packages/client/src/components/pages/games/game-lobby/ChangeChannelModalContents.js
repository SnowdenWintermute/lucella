import React from "react";

const ChangeChannelModalContents = ({
  setJoinNewRoomInput,
  joinNewRoomInput,
  onJoinRoomSubmit,
  joinRoom,
}) => {
  return (
    <form onSubmit={(e) => onJoinRoomSubmit(e)}>
      <p>Type any channel name, or choose from a list of suggested channels:</p>
      <input
        autoFocus={true}
        className={"text-input-transparent mb-15"}
        onChange={(e) => setJoinNewRoomInput(e.target.value)}
        value={joinNewRoomInput}
        placeholder={"Channel to join..."}
      ></input>
      <div className="modal-option-buttons-grid">
        <button
          className="button button-standard-size button-basic"
          name="lindblum"
          type="button"
          onClick={(e) => joinRoom("lindblum")}
        >
          Lindblum
        </button>
        <button
          className="button button-standard-size button-basic"
          name="Alexandria"
          type="button"
          onClick={(e) => joinRoom("Alexandria")}
        >
          Alexandria
        </button>
        <button
          className="button button-standard-size button-basic"
          name="burmecia"
          type="button"
          onClick={(e) => joinRoom("burmecia")}
        >
          Burmecia
        </button>
        <button
          className="button button-standard-size button-basic"
          name="Battle Room Chat"
          type="button"
          onClick={(e) => joinRoom("Battle Room Chat")}
        >
          Battle Room Chat
        </button>
        <button
          className="button button-standard-size button-basic"
          name="Treno"
          type="button"
          onClick={(e) => joinRoom("Treno")}
        >
          Treno
        </button>
        <button
          className="button button-standard-size button-basic"
          name="lurker lounge"
          type="button"
          onClick={(e) => joinRoom("lurker lounge")}
        >
          Lurker Lounge
        </button>
      </div>
    </form>
  );
};

export default ChangeChannelModalContents;
