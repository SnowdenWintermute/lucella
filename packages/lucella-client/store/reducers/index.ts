import { combineReducers } from "@reduxjs/toolkit";
import alert from "./alert";
import auth from "./auth";
import chat from "./chat";
import gameUi from "./game-ui";
import lobbyUi from "./lobby-ui";
import ladder from "./ladder";

export const rootReducer = combineReducers({
  alert,
  auth,
  chat,
  gameUi,
  lobbyUi,
  ladder,
});

export type RootState = ReturnType<typeof rootReducer>;
