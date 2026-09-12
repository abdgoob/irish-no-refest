import type { ReactNode } from "react";

export function ButtonCircle({
  href,
  onClick,
  children,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const cls = `sd-btn-circle ${className}`.trim();
  const label = <span className="sd-btn-circle__label">{children}</span>;
  if (href) {
    return (
      <a href={href} className={cls}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
    </button>
  );
}
