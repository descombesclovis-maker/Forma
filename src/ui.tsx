import type { ReactNode } from "react";
export const link = (page: string) => `#/${page}`;
export function Arrow({ direction = "up" }: { direction?: string }) {
  return (
    <svg
      className={`arrow arrow-${direction}`}
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
export function Logo() {
  return (
    <span
      className="forma-logo forma-logo--mini forma-logo--interactive"
      aria-label="Forma"
    >
      <span className="forma-logo__stem" />
      <span className="forma-logo__top" />
      <span className="forma-logo__mid" />
    </span>
  );
}
export function Action({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a className="action" href={link(to)}>
      {children}
      <span aria-hidden="true">
        <Arrow />
      </span>
    </a>
  );
}
export function Heading({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">FORMA / {num}</p>
      <h1>{title}</h1>
      <p className="premium-intro">{text}</p>
    </div>
  );
}
