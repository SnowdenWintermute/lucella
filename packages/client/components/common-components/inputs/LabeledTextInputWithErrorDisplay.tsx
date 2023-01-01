import React from "react";
import inputStyles from "./inputs.module.scss";

type Props = {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  disabled: boolean;
  error: string;
  autofocus: boolean;
};

function LabeledTextInputWithErrorDisplay({ name, type, label, placeholder, value, onChange, disabled, error, autofocus }: Props) {
  return (
    <label htmlFor={name}>
      <p className={error && inputStyles["red-text"]}>
        {label}
        {error && (
          <span id="error" role="alert" data-cy={`error-${name}`} className={inputStyles["red-text"]}>
            {` - ${error}`}
          </span>
        )}
      </p>
      <input
        className={`${inputStyles["simple-text-input"]} ${error && inputStyles["red-border"]}`}
        aria-label={name}
        type={type}
        placeholder={placeholder}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        disabled={disabled}
        autoFocus={autofocus}
        aria-invalid={!!error}
      />
    </label>
  );
}

export default LabeledTextInputWithErrorDisplay;
