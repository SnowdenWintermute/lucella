import React, { useState, useEffect, useRef } from "react";
import ArrowShape from "../../../img/menu-icons/arrow-button-icon.svg";

function index({
  title,
  value,
  setValue,
  options,
  disabled,
  extraStyles,
}: {
  title: string;
  value: any;
  setValue: (value: any) => void;
  options: { title: string; value: any }[];
  disabled: boolean | undefined;
  extraStyles?: string;
}) {
  const selectInputRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [indexSelected, setIndexSelected] = useState<number>(options.reduce((accumulator, option, i) => (option.value === value ? i : accumulator), 0));

  useEffect(() => {
    setValue(options[indexSelected].value);
  }, [indexSelected]);

  useEffect(() => {
    function handleFocus() {
      if (!selectInputRef.current) return;
      if (selectInputRef.current.contains(document.activeElement)) {
        setIsFocused(true);
      } else setIsFocused(false);
    }
    document.addEventListener("focus", handleFocus, true);
    return () => {
      document.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  function handleUserKeyPress(e: KeyboardEvent) {
    const { key } = e;
    if (key === "Escape" || key === "Esc") setIsOpen(false);
    if (!selectInputRef.current) return;
    if (!isFocused) return;
    // if (key === "Enter" && isOpen) setIsOpen(false);
    if (key === " ") setIsOpen(!isOpen);
    if (key === "ArrowUp") {
      if (indexSelected === 0) {
        setIndexSelected(options.length - 1);
      } else {
        setIndexSelected(indexSelected - 1);
      }
    }
    if (key === "ArrowDown") {
      if (indexSelected === options.length - 1) {
        setIndexSelected(0);
      } else {
        setIndexSelected(indexSelected + 1);
      }
    }
  }

  function handleClick(e: MouseEvent) {
    const node = e.target as HTMLElement;
    if (node.id !== `select-${title}-selected-option`) setIsOpen(false);
    else setIsOpen(!isOpen);
  }

  useEffect(() => {
    window.addEventListener("keyup", handleUserKeyPress);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("keyup", handleUserKeyPress);
      window.removeEventListener("click", handleClick);
    };
  });

  const selectedOptionAsOpenButton = options.map(
    (option) =>
      option.value === value && (
        <button
          disabled={disabled}
          type="button"
          key={option.value}
          id={`select-${title}-selected-option`}
          className="select-dropdown__open-button select-dropdown__option-button"
        >
          {option.title} <ArrowShape className={`select-dropdown__open-button-arrow ${isOpen && "select-dropdown__open-button-arrow--open"}`} />
        </button>
      )
  );
  const optionButtons = options.map((option, i) => (
    <button
      disabled={disabled}
      type="button"
      key={option.value}
      onClick={() => {
        setIsOpen(false);
        setValue(option.value);
        setIndexSelected(i);
      }}
      className={`select-dropdown__option-button ${value === option.value && "select-dropdown__option-button--selected"}`}
    >
      {option.title}
    </button>
  ));

  return (
    <div ref={selectInputRef} aria-label={`select ${title}`} className={`select-dropdown ${extraStyles}`}>
      {selectedOptionAsOpenButton}
      <div className="select-dropdown__options-container">{isOpen && optionButtons}</div>
    </div>
  );
}

export default index;
