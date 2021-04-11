export default ({ e, commonEventHandlerProps }) => {
  const { canvasSize, currentGameData, mouseData } = commonEventHandlerProps
  const rect = e.target.getBoundingClientRect();
  const offsetX = e.targetTouches[0].pageX - rect.left;
  const offsetY = e.targetTouches[0].pageY - rect.top;
  mouseData.touchStartX = mouseData.leftPressedAtX =
    (offsetX / canvasSize.width) * currentGameData.current.width;
  mouseData.touchStartY = mouseData.leftPressedAtY =
    (offsetY / canvasSize.height) * currentGameData.current.height;
  mouseData.touchStartTime = Date.now();
};