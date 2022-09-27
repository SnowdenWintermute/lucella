import { BattleRoomGame } from "../../../../common";

export default (currentGame: BattleRoomGame) => {
  const { mouseData } = currentGame;
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    const { leftPressedAt, position } = mouseData;
    // handleAndQueueNewGameEvent({
    //   type: GameEventTypes.ORB_SELECT,
    //   props: {
    //     startX: leftPressedAt.x,
    //     startY: leftPressedAt.y,
    //     currX: position.x,
    //     currY: position.y,
    //   },
    //   commonEventHandlerProps,
    // });
  }
};
