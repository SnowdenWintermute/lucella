import { BattleRoomGame, WidthAndHeight, colors } from "@lucella/common";

export default function drawEndzones(context: CanvasRenderingContext2D, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) {
  let x = currentGame.endzones.host.origin.x;
  let y = currentGame.endzones.host.origin.y;
  let width = canvasSize.width;
  let height = (currentGame.endzones.host.height / BattleRoomGame.baseWindowDimensions.height) * canvasSize.height;
  context.beginPath();
  context.fillStyle = colors.hostEndZone;
  context.fillRect(x, y, width, height);
  x = currentGame.endzones.challenger.origin.x;
  y = (currentGame.endzones.challenger.origin.y / BattleRoomGame.baseWindowDimensions.height) * canvasSize.height;
  width = canvasSize.width;
  height = (currentGame.endzones.challenger.height / BattleRoomGame.baseWindowDimensions.height) * canvasSize.height;
  context.beginPath();
  context.fillStyle = colors.challengerEndZone;
  context.fillRect(x, y, width, height);
}
