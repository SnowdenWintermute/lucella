import { GameRoom } from "../../../common/classes/BattleRoomGame/GameRoom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStatus, PlayerRole } from "@lucella/common/enums";

export interface IGameUIState {
  preGameScreen: {
    isOpen: boolean;
  };
  matchmakingScreen: {
    isOpen: boolean;
    currentData: {
      currentEloDiffThreshold: number | null;
      queueSize: number | null;
    };
  };
  currentGameRoom: GameRoom | null;
  playerRole: PlayerRole | null;
}

const initialState: IGameUIState = {
  preGameScreen: {
    isOpen: false,
  },
  matchmakingScreen: {
    isOpen: false,
    currentData: {
      queueSize: null,
      currentEloDiffThreshold: null,
    },
  },
  currentGameRoom: null,
  playerRole: null,
};

const gameUiSlice = createSlice({
  name: "gameUi",
  initialState,
  reducers: {
    clearGameUi(state) {
      state = initialState;
    },
    setPreGameScreenDisplayed(state, action: PayloadAction<boolean>) {
      state.preGameScreen.isOpen = action.payload;
    },
    setCurrentGameRoom(state, action: PayloadAction<GameRoom>) {
      state.currentGameRoom = action.payload;
    },
    updatePlayersReady(state, action: PayloadAction<{ host: boolean; challenger: boolean }>) {
      if (state.currentGameRoom) state.currentGameRoom.playersReady = action.payload;
    },
    updateGameCountdown(state, action: PayloadAction<number>) {
      if (state.currentGameRoom) state.currentGameRoom.countdown.current = action.payload;
    },
    updateGameStatus(state, action: PayloadAction<GameStatus>) {
      if (state.currentGameRoom) state.currentGameRoom.gameStatus = action.payload;
    },
    updatePlayerRole(state, action: PayloadAction<PlayerRole>) {
      if (state.currentGameRoom) state.playerRole = action.payload;
    },
    setGameWinner(state, action: PayloadAction<string>) {
      if (state.currentGameRoom) state.currentGameRoom.winner = action.payload;
    },
    setMatchmakingWindowVisible(state, action: PayloadAction<boolean>) {
      state.matchmakingScreen.isOpen = action.payload;
    },
    setMatchmakingData(state, action: PayloadAction<{ queueSize: number; currentEloDiffThreshold: number }>) {
      state.matchmakingScreen.currentData = action.payload;
    },
  },
});

export const { setPreGameScreenDisplayed } = gameUiSlice.actions;
export default gameUiSlice.reducer;
