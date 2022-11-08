import React from "react";

interface Props {
  title: string;
  onClick: (e: any) => void;
}

const ButtonBasic = ({ title, onClick }: Props) => {
  return (
    <button className="button button-standard-size button-basic" type="button" onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonBasic;
