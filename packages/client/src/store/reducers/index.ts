import { combineReducers } from "redux";
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
