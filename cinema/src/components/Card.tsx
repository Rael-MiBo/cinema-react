import React from "react";

export type CardProps = {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, footer, children, className }: CardProps) {
  return (
    <div className={`card ${className ?? ""}`}>
      {title && (
        <div className="card-header">
          <h5 className="card-title mb-0">{title}</h5>
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
