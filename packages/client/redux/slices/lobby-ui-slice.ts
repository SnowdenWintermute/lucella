/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { EloUpdates, GameRoom, BattleRoomGame, GameStatus, PlayerRole } from "../../../common";

export interface IGameScoreScreen {
  gameRoom: GameRoom;
  game: BattleRoomGame;
  eloUpdates: EloUpdates;
}

export interface ILobbyUIState {
  gameList: {
    games: {
      [roomName: string]: GameRoom;
    };
    isOpen: boolean;
  };
  scoreScreenData: IGameScoreScreen | null;
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

const initialState: ILobbyUIState = {
  gameList: {
    games: {},
    isOpen: false,
  },
  scoreScreenData: null,
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

const ladderSlice = createSlice({
  name: "lobbyUi",
  initialState,
  reducers: {
    clearLobbyUi() {
      return initialState;
    },
    setPreGameScreenDisplayed(state, action: PayloadAction<boolean>) {
      state.preGameScreen.isOpen = action.payload;
    },
    setCurrentGameRoom(state, action: PayloadAction<GameRoom | null>) {
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
      console.log("player role received: ", action.payload);
      state.playerRole = action.payload;
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
    setViewingGamesList(state, action: PayloadAction<boolean>) {
      state.gameList.isOpen = action.payload;
    },
    updateGameList(
      state,
      action: PayloadAction<{
        [roomName: string]: GameRoom;
      }>
    ) {
      state.gameList.games = action.payload;
    },
    setScoreScreenData(state, action: PayloadAction<IGameScoreScreen>) {
      // @ts-ignore
      state.scoreScreenData = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log("HYDRATE", state, action.payload);
      return {
        ...state,
        ...action.payload.subject,
      };
    },
  },
});

export const {
  clearLobbyUi,
  setPreGameScreenDisplayed,
  setCurrentGameRoom,
  updatePlayersReady,
  updateGameCountdown,
  updateGameStatus,
  updatePlayerRole,
  setGameWinner,
  setMatchmakingWindowVisible,
  setMatchmakingData,
  setViewingGamesList,
  updateGameList,
  setScoreScreenData,
} = ladderSlice.actions;

export default ladderSlice.reducer;
