export default ({ e, commonEventHandlerProps }) => {
  const { canvasInfo, currentGameData, mouseData } = commonEventHandlerProps
  const rect = e.target.getBoundingClientRect();
  const offsetX = e.targetTouches[0].pageX - rect.left;
  const offsetY = e.targetTouches[0].pageY - rect.top;
  mouseData.touchStartX = mouseData.leftPressedAtX =
    (offsetX / canvasInfo.width) * currentGameData.width;
  mouseData.touchStartY = mouseData.leftPressedAtY =
    (offsetY / canvasInfo.height) * currentGameData.height;
  mouseData.touchStartTime = Date.now();
};