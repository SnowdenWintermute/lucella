import { Point } from "../Point";

export interface DebugValues {
  showDebug: boolean;
  general: {
    deltaT?: number;
    gameSpeedAdjustedForDeltaT?: number;
  };
  clientPrediction: {
    inputsToSimulate?: any[];
    ticksSinceLastClientTickConfirmedByServer?: number;
    simulatingBetweenInputs?: boolean;
    clientServerTickDifference?: number;
    lastProcessedClientInputNumber?: number;
    frameTime?: number;
    timeLastPacketSent?: number;
    roundTripTime?: number;
    entityPositionBuffer?: { position: Point; timestamp: number }[];
    lerpFrameTime?: number;
  };
}
