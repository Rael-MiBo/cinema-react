import React from "react";

export type Variant = "primary" | "secondary" | "danger" | "success" | "warning" | "light" | "dark" | "outline-primary" | "outline-secondary" | "outline-danger" | "outline-success" | "outline-warning" | "outline-light" | "outline-dark" | "outline-danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "lg";
  isLoading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size,
  className = "",
  isLoading,
  ...rest
}: ButtonProps) {
  const variantClass = variant ? `btn-${variant}` : "";
  const sizeClass = size ? `btn-${size}` : "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      {...rest}
      disabled={isLoading || rest.disabled}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
}