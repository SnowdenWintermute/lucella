class MouseData {
  constructor() {
    this.leftPressedAtX = null;
    this.leftPressedAtY = null;
    this.leftReleasedAtX = null;
    this.leftReleasedAtY = null;
    this.leftCurrentlyPressed = false;
    this.rightReleasedAtX = null;
    this.rightReleasedAtY = null;
    this.touchStartX = null;
    this.touchStartY = null;
    this.xPos = 0;
    this.yPos = 0;
    this.mouseOnScreen = true;
  }
}

export default MouseData