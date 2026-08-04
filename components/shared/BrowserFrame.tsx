import { ReactNode } from "react";

export function BrowserFrame({
  children,
  label,
  className = "",
  address = "kaios.preview/site",
}: {
  children: ReactNode;
  label: string;
  className?: string;
  address?: string;
}) {
  return (
    <div className={`browser-frame ${className}`} aria-label={label}>
      <div className="browser-bar" aria-hidden="true">
        <div className="browser-lights">
          <span />
          <span />
          <span />
        </div>
        <div className="browser-address">{address}</div>
        <div className="browser-bar-spacer" />
      </div>
      <div className="browser-viewport">{children}</div>
    </div>
  );
}

