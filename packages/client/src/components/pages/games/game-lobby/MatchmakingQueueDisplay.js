import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const MatchmakingQueueDisplay = () => {
  const [hideClass, setHideClass] = useState("height-0-hidden");
  const matchmakingQueueScreen = useSelector(
    (state) => state.gameUi.matchmakingScreen
  );

  useEffect(() => {
    if (matchmakingQueueScreen) {
      if (matchmakingQueueScreen.isOpen) setHideClass("");
      else setHideClass("height-0-hidden");
    }
  }, [matchmakingQueueScreen]);

  return (
    <div className={`matchmaking-queue-screen ${hideClass}`}>
      <div className="p-10">
        <div>Seeking ranked match...</div>
        <div>
          Players in Queue:{" "}
          {matchmakingQueueScreen.currentData.queueSize
            ? matchmakingQueueScreen.currentData.queueSize
            : "..."}
        </div>
        <div>
          Current Elo difference threshold:{" "}
          {matchmakingQueueScreen.currentData.queueSize
            ? matchmakingQueueScreen.currentData.currentEloDiffThreshold
            : "..."}
        </div>
      </div>
    </div>
  );
};

export default MatchmakingQueueDisplay;
