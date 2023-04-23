import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { GameRoom, BattleRoomGame, GameStatus, PlayerRole, IBattleRoomGameRecord } from "../../../../common";
import { BattleRoomGameConfig } from "../../../../common/src/classes/BattleRoomGame/BattleRoomGameConfig";

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
  gameRoom: GameRoom | null;
  gameRoomLoading: boolean | string;
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
  gameRoom: null,
  gameRoomLoading: false,
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
    setGameRoomLoading(state, action: PayloadAction<boolean | string>) {
      state.gameRoomLoading = action.payload;
    },
    setGameRoom(state, action: PayloadAction<GameRoom | null>) {
      state.gameRoom = action.payload;
      state.gameRoomLoading = false;
    },
    setPlayerReadyLoading(state, action: PayloadAction<boolean>) {
      state.playerReadyLoading = action.payload;
    },
    updatePlayersReady(state, action: PayloadAction<{ host: boolean; challenger: boolean }>) {
      if (state.gameRoom) {
        if (state.playerRole === PlayerRole.HOST && action.payload.host !== state.gameRoom.playersReady.host) state.playerReadyLoading = false;
        if (state.playerRole === PlayerRole.CHALLENGER && action.payload.challenger !== state.gameRoom.playersReady.challenger)
          state.playerReadyLoading = false;
        state.gameRoom.playersReady = action.payload;
      }
    },
    updateGameCountdown(state, action: PayloadAction<number>) {
      if (state.gameRoom) state.gameRoom.countdown.current = action.payload;
    },
    updateGameStatus(state, action: PayloadAction<GameStatus>) {
      if (state.gameRoom) state.gameRoom.gameStatus = action.payload;
      if (action.payload !== GameStatus.IN_WAITING_LIST) state.gameCreationWaitingList.currentPosition = null;
    },
    updategameRoomConfig(state, action: PayloadAction<BattleRoomGameConfig>) {
      if (state.gameRoom) state.gameRoom.battleRoomGameConfigOptionIndices = action.payload;
    },
    updatePlayerRole(state, action: PayloadAction<PlayerRole>) {
      state.playerRole = action.payload;
    },
    setGameWinner(state, action: PayloadAction<string>) {
      if (state.gameRoom) state.gameRoom.winner = action.payload;
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
  setGameRoomLoading,
  setGameRoom,
  setPlayerReadyLoading,
  updatePlayersReady,
  updateGameCountdown,
  updateGameStatus,
  updategameRoomConfig,
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
