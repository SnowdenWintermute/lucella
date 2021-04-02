import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(33, ({ e, commonEventHandlerProps }) => {
  const { mouseData, currentGameData, canvasInfo } = commonEventHandlerProps
  mouseData.xPos =
    (e.nativeEvent.offsetX / canvasInfo.width) * currentGameData.width;
  mouseData.yPos =
    (e.nativeEvent.offsetY / canvasInfo.height) * currentGameData.height;
}
);