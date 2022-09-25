import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BattleRoomGame } from "../../../common/classes/BattleRoomGame";
import { GameRoom } from "../../../common/classes/BattleRoomGame/GameRoom";
import { EloUpdates } from "../../../common/types";

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
  scoreScreenDisplayed: boolean;
}
const initialState: ILobbyUIState = {
  gameList: {
    games: {},
    isOpen: false,
  },
  scoreScreenData: null,
  scoreScreenDisplayed: false,
};

const ladderSlice = createSlice({
  name: "lobbyUi",
  initialState,
  reducers: {
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
      state.scoreScreenData = action.payload;
      state.scoreScreenDisplayed = true;
    },
    closeScoreScreen(state) {
      state.scoreScreenDisplayed = false;
    },
  },
});

export const { setScoreScreenData, closeScoreScreen } = ladderSlice.actions;
export default ladderSlice.reducer;
