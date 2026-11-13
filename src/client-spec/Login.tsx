import { useRef, useState } from "react";
import type { PointerEvent, KeyboardEvent } from "react";
import { Prism } from "./Home";
import { Arrow } from "./Chrome";
function FloatingShape({ index }: { index: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number; pointer: number } | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  function move(x: number, y: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.parentElement!.getBoundingClientRect();
    offset.current = {
      x: Math.max(-rect.width * 0.25, Math.min(rect.width * 0.25, x)),
      y: Math.max(-rect.height * 0.3, Math.min(rect.height * 0.3, y)),
    };
    el.style.transform = `translate3d(${offset.current.x}px,${offset.current.y}px,0) rotate(${offset.current.x * 0.04}deg)`;
  }
  function start(e: PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.currentTarget.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
      pointer: e.pointerId,
    };
    e.currentTarget.dataset.dragging = "true";
    e.currentTarget.style.transition = "none";
  }
  function end() {
    if (!drag.current) return;
    drag.current = null;
    const el = ref.current!;
    el.dataset.dragging = "false";
    el.style.transition = "transform 1.1s cubic-bezier(.16,1,.3,1)";
    offset.current = { x: 0, y: 0 };
    el.style.transform = "translate3d(0,0,0) rotate(0deg)";
  }
  function key(e: KeyboardEvent<HTMLButtonElement>) {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-20, 0],
      ArrowRight: [20, 0],
      ArrowUp: [0, -20],
      ArrowDown: [0, 20],
    };
    if (directions[e.key]) {
      e.preventDefault();
      move(
        offset.current.x + directions[e.key][0],
        offset.current.y + directions[e.key][1],
      );
    }
    if (e.key === "Escape") {
      offset.current = { x: 0, y: 0 };
      move(0, 0);
    }
  }
  return (
    <button
      ref={ref}
      type="button"
      className={`spec-drag-shape drag-shape-${index}`}
      aria-label={`Déplacer la forme ${index} — glisser ou utiliser les touches fléchées`}
      onPointerDown={start}
      onPointerMove={(e) => {
        if (drag.current?.pointer === e.pointerId)
          move(e.clientX - drag.current.x, e.clientY - drag.current.y);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
      onKeyDown={key}
      onBlur={() => move(0, 0)}
    >
      <Prism className={`login-prism login-prism-${index}`} />
    </button>
  );
}
export function Login() {
  const [error, setError] = useState("");
  return (
    <section className="spec-login">
      <div
        className="spec-floating-stage"
        aria-label="Formes géométriques manipulables"
      >
        {[1, 2, 3].map((i) => (
          <FloatingShape key={i} index={i} />
        ))}
      </div>
      <div className="spec-login-panel">
        <h1>Vous connecter</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(
              "La connexion n’est pas encore disponible. Aucune donnée n’a été transmise.",
            );
          }}
        >
          <label htmlFor="login-email">Adresse email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            required
          />
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
          />
          <button className="spec-button">
            Vous connecter <Arrow />
          </button>
          <p className="spec-connection-note">
            L’authentification n’est pas encore connectée.
          </p>
          {error && (
            <p className="spec-feedback" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
