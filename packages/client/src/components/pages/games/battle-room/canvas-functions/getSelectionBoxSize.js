const getSelectionBoxSize = ({
  mouseData,
  canvasXDrawFraction,
  canvasYDrawFraction,
}) => {
  const width =
    mouseData.xPos * canvasXDrawFraction -
    mouseData.leftPressedAtX * canvasXDrawFraction;
  const height =
    mouseData.yPos * canvasYDrawFraction -
    mouseData.leftPressedAtY * canvasYDrawFraction;
  return {
    width,
    height,
  };
};

export default getSelectionBoxSize;
