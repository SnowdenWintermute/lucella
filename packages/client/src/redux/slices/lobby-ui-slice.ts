/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { GameRoom, BattleRoomGame, GameStatus, PlayerRole, IBattleRoomGameRecord } from "../../../../common";

export enum LobbyMenu {
  MAIN = "main",
  GAME_SETUP = "gameSetup",
  GAME_ROOM = "gameRoom",
  GAME_LIST = "gameList",
  MATCHMAKING_QUEUE = "matchmakingQueue",
}

export interface IGameScoreScreen {
  gameRoom: GameRoom;
  game: BattleRoomGame;
  gameRecord: IBattleRoomGameRecord | null;
}

export interface ILobbyUIState {
  authenticating: boolean;
  activeMenu: LobbyMenu | null;
  gameList: {
    games: {
      [roomName: string]: GameRoom;
    };
    isFetching: boolean;
  };
  scoreScreenData: IGameScoreScreen | null;
  gameCreationWaitingList: {
    currentPosition: number | null;
  };
  matchmakingMenu: {
    isLoading: boolean;
    currentData: {
      currentEloDiffThreshold: number | null;
      queueSize: number | null;
    };
  };
  currentGameRoom: GameRoom | null;
  currentGameRoomLoading: boolean | string;
  playerReadyLoading: boolean;
  playerRole: PlayerRole | null;
  guestUsername: string | null;
}

const initialState: ILobbyUIState = {
  authenticating: true,
  activeMenu: LobbyMenu.MAIN,
  gameList: {
    games: {},
    isFetching: true,
  },
  scoreScreenData: null,
  gameCreationWaitingList: {
    currentPosition: null,
  },
  matchmakingMenu: {
    isLoading: false,
    currentData: {
      queueSize: null,
      currentEloDiffThreshold: null,
    },
  },
  currentGameRoom: null,
  currentGameRoomLoading: false,
  playerReadyLoading: false,
  playerRole: null,
  guestUsername: null,
};

const ladderSlice = createSlice({
  name: "lobbyUi",
  initialState,
  reducers: {
    clearLobbyUi() {
      return initialState;
    },
    setAuthenticating(state, action: PayloadAction<boolean>) {
      state.authenticating = action.payload;
    },
    setGuestUsername(state, action: PayloadAction<string>) {
      state.guestUsername = action.payload;
    },
    setActiveMenu(state, action: PayloadAction<LobbyMenu>) {
      state.activeMenu = action.payload;
      if (action.payload === LobbyMenu.MATCHMAKING_QUEUE) state.matchmakingMenu = initialState.matchmakingMenu;
    },
    setCurrentGameRoomLoading(state, action: PayloadAction<boolean | string>) {
      state.currentGameRoomLoading = action.payload;
    },
    setCurrentGameRoom(state, action: PayloadAction<GameRoom | null>) {
      state.currentGameRoom = action.payload;
      state.currentGameRoomLoading = false;
    },
    setPlayerReadyLoading(state, action: PayloadAction<boolean>) {
      state.playerReadyLoading = action.payload;
    },
    updatePlayersReady(state, action: PayloadAction<{ host: boolean; challenger: boolean }>) {
      if (state.currentGameRoom) {
        if (state.playerRole === PlayerRole.HOST && action.payload.host !== state.currentGameRoom.playersReady.host) state.playerReadyLoading = false;
        if (state.playerRole === PlayerRole.CHALLENGER && action.payload.challenger !== state.currentGameRoom.playersReady.challenger)
          state.playerReadyLoading = false;
        state.currentGameRoom.playersReady = action.payload;
      }
    },
    updateGameCountdown(state, action: PayloadAction<number>) {
      if (state.currentGameRoom) state.currentGameRoom.countdown.current = action.payload;
    },
    updateGameStatus(state, action: PayloadAction<GameStatus>) {
      if (state.currentGameRoom) state.currentGameRoom.gameStatus = action.payload;
      if (action.payload !== GameStatus.IN_WAITING_LIST) state.gameCreationWaitingList.currentPosition = null;
    },
    updatePlayerRole(state, action: PayloadAction<PlayerRole>) {
      state.playerRole = action.payload;
    },
    setGameWinner(state, action: PayloadAction<string>) {
      if (state.currentGameRoom) state.currentGameRoom.winner = action.payload;
    },
    setMatchmakingLoading(state, action: PayloadAction<boolean>) {
      state.matchmakingMenu.isLoading = action.payload;
    },
    setMatchmakingData(state, action: PayloadAction<{ queueSize: number; currentEloDiffThreshold: number }>) {
      state.matchmakingMenu.currentData = action.payload;
    },
    setGameCreationWaitingListPosition(state, action: PayloadAction<number>) {
      state.gameCreationWaitingList.currentPosition = action.payload;
    },
    setGameListFetching(state, action: PayloadAction<boolean>) {
      state.gameList.isFetching = action.payload;
    },
    updateGameList(
      state,
      action: PayloadAction<{
        [roomName: string]: GameRoom;
      }>
    ) {
      state.gameList.games = action.payload;
      state.gameList.isFetching = false;
    },
    setScoreScreenData(state, action: PayloadAction<IGameScoreScreen>) {
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
  setAuthenticating,
  setGuestUsername,
  setActiveMenu,
  setCurrentGameRoomLoading,
  setCurrentGameRoom,
  setPlayerReadyLoading,
  updatePlayersReady,
  updateGameCountdown,
  updateGameStatus,
  updatePlayerRole,
  setGameWinner,
  setMatchmakingLoading,
  setMatchmakingData,
  setGameCreationWaitingListPosition,
  setGameListFetching,
  updateGameList,
  setScoreScreenData,
} = ladderSlice.actions;

export default ladderSlice.reducer;
