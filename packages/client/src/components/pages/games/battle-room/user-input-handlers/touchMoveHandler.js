import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(33, ({ e, commonEventHandlerProps }) => {
  const { canvasSize, currentGameData, mouseData } = commonEventHandlerProps
  e.preventDefault()
  const { touchStartX, touchStartY } = mouseData;
  const rect = e.target.getBoundingClientRect();
  const offsetX = e.targetTouches[0].pageX - rect.left;
  const offsetY = e.targetTouches[0].pageY - rect.top;
  mouseData.xPos = (offsetX / canvasSize.width) * currentGameData.current.width;
  mouseData.yPos = (offsetY / canvasSize.height) * currentGameData.current.height;
  const touchLength = Date.now() - mouseData.touchStartTime;
  if (
    touchLength > 500 ||
    Math.abs(offsetX - touchStartX) > 8 ||
    Math.abs(offsetY - touchStartY) > 8
  ) {
    mouseData.leftCurrentlyPressed = true;
  }
});