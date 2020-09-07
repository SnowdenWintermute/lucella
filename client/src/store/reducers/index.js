// root reducer
import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import chat from "./chat";
import gameUi from "./game-ui";
import lobbyUi from "./lobby-ui";
import ladder from "./ladder";

export default combineReducers({
  alert,
  auth,
  profile,
  chat,
  gameUi,
  lobbyUi,
  ladder,
});
