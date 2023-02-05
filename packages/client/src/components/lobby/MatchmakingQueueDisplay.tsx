import React, { useState, useEffect } from "react";
import { MATCHMAKING_QUEUE } from "../../consts/lobby-text";
import { useAppSelector } from "../../redux/hooks";

function MatchmakingQueueDisplay() {
  const [hideClass, setHideClass] = useState("height-0-hidden");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const matchmakingQueueScreen = lobbyUiState.matchmakingScreen;
  useEffect(() => {
    if (matchmakingQueueScreen) {
      if (matchmakingQueueScreen.isOpen) setHideClass("");
      else setHideClass("height-0-hidden");
    }
  }, [matchmakingQueueScreen]);

  return (
    <div className={`matchmaking-queue-screen ${hideClass}`}>
      <div className="p-10">
        <div>{MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH}</div>
        <div>Players in Queue: {matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.queueSize : "..."}</div>
        <div>
          Current Elo difference threshold: {matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.currentEloDiffThreshold : "..."}
        </div>
      </div>
    </div>
  );
}

export default MatchmakingQueueDisplay;