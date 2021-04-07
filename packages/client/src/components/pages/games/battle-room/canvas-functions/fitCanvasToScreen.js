module.exports = ({ window, setCanvasSize, gameWidthRatio }) => {
  setCanvasSize({
    height: window.innerHeight,
    width:
      gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
  });
}