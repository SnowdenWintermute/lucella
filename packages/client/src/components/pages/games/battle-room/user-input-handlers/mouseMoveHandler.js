import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(33, ({ e, commonEventHandlerProps }) => {
  const { mouseData, currentGameData, canvasSize } = commonEventHandlerProps
  if (!mouseData) return
  mouseData.xPos =
    (e.nativeEvent.offsetX / canvasSize.width) * currentGameData.current.width;
  mouseData.yPos =
    (e.nativeEvent.offsetY / canvasSize.height) * currentGameData.current.height;
}
);