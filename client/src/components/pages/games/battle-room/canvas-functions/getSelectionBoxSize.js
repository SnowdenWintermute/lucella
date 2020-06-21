const getSelectionBoxSize = ({ mouseData }) => {
  const width = mouseData.xPos - mouseData.leftPressedAtX;
  const height = mouseData.yPos - mouseData.leftPressedAtY;
  return {
    width,
    height,
  };
};

export default getSelectionBoxSize;
