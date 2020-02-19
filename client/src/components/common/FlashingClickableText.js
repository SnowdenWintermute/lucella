import React, { useState } from "react";

const FlashingClickableText = props => {
  const [blinkClass, setBlink] = useState("link-simple");
  const linkClicked = () => {
    props.onClick && props.onClick();
    setTimeout(() => {
      setBlink("link-simple-blink");
    }, 100);
    setTimeout(() => {
      setBlink("link-simple-unblinked");
    }, 200);
    setTimeout(() => {
      setBlink("link-simple-blink");
    }, 300);
    setTimeout(() => {
      setBlink("link-simple-unblinked");
    }, 400);
    setTimeout(() => {
      setBlink("link-simple");
    }, 500);
  };

  return (
    <div className={blinkClass} onClick={linkClicked}>
      {props.children}
    </div>
  );
};

export default FlashingClickableText;
