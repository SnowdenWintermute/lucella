import { Point } from "../Point";

export interface DebugValues {
  showDebug: boolean;
  general: {
    deltaT?: number;
  };
  clientPrediction: {
    inputsToSimulate?: any[];
    simulatingBetweenInputs?: boolean;
    lastProcessedClientInputNumber?: number;
    frameTime?: number;
    timeLastPacketSent?: number;
    roundTripTime?: number;
    // entityPositionBuffer?: { position: Point; timestamp: number }[];
    // lerpFrameTime?: number;
  };
}
