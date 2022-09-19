import React, { ReactNode, useState } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
}

const FlashingClickableText = ({ onClick, children }: Props) => {
  const [blinkClass, setBlink] = useState("link-simple");
  const linkClicked = () => {
    onClick && onClick();
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
      {children}
    </div>
  );
};

export default FlashingClickableText;
