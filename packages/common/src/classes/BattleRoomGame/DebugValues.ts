export enum DebugModes {
  HIDDEN,
  SHAPES,
  SHAPES_AND_TEXT,
}

export interface DebugValues {
  mode: DebugModes;
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
    clientOrbNumInputsApplied?: number;
    // entityPositionBuffer?: { position: Point; timestamp: number }[];
    // lerpFrameTime?: number;
  };
}
