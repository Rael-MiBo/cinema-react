import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  containerClassName?: string;
};

export default function Input({
  label,
  error,
  containerClassName,
  ...rest
}: InputProps) {
  return (
    <div className={containerClassName ? containerClassName : "mb-3"}>
      {label && <label className="form-label">{label}</label>}
      <input
        {...rest}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
