export const draw = (context, mouseData) => {
  console.log(mouseData);
  // clear it out
  //   context.clearRect(0, 0, 450, 750);
  context.beginPath();
  context.fillStyle = "rgb(0,0,0)";
  context.fillRect(mouseData.leftPressedAtX, mouseData.leftPressedAtY, 10, 10);
};
