import { BattleRoomGame } from "../../../../../common";

export default function keyUpHandler(e: KeyboardEvent, game: BattleRoomGame) {
  if (e.key === " ") game.waypointKeyIsPressed = false;
}
