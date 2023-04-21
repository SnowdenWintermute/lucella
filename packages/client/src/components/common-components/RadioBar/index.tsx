import React, { useEffect, useState } from "react";

function RadioButton({
  title,
  index,
  setSelectedIndex,
  selectedValue,
  value,
  disabled,
}: {
  title: string;
  index: number;
  setSelectedIndex: (newIndex: number) => void;
  selectedValue: any;
  value: any;
  disabled: boolean;
}) {
  return (
    <button
      className={`radio-bar__button ${selectedValue === value && "radio-bar__button--selected"}`}
      type="button"
      aria-label={title}
      onClick={() => {
        setSelectedIndex(index);
      }}
      disabled={disabled}
    />
  );
}

function RadioBar({
  title,
  options,
  value,
  setValue,
  disabled,
  extraStyles,
}: {
  title: string;
  options: { title: string; value: any }[];
  value: any;
  setValue: (newValue: any) => void;
  disabled: boolean;
  extraStyles?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(options.reduce((accumulator, option, i) => (option.value === value ? i : accumulator), 0));

  useEffect(() => {
    if (options[selectedIndex].value === value) return;
    setValue(options[selectedIndex].value);
  }, [selectedIndex]);

  const displayedOptions = options.map((option, i) => {
    return (
      <RadioButton
        title={option.title}
        setSelectedIndex={setSelectedIndex}
        index={i}
        selectedValue={value}
        value={option.value}
        key={option.value}
        disabled={disabled}
      />
    );
  });

  return (
    <menu className={`radio-bar ${extraStyles}`} data-disabled={disabled ? "true" : "false"}>
      <p className="radio-bar__title">{title}</p>
      <div className="radio-bar__options">{displayedOptions}</div>
      <p className="radio-bar__value">{options.reduce((acc, option) => (option.value === value ? option.title : acc), "")}</p>
    </menu>
  );
}

export default RadioBar;
