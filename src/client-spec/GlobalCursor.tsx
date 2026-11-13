import { useEffect } from "react";

/** Shared mouse-only cursor. Native touch and text-editing cursors remain intact. */
export function GlobalCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const root = document.documentElement;
    const cursor = document.querySelector<HTMLElement>(".forma-cursor");
    if (!cursor) return;
    root.classList.add("forma-custom-cursor");

    let frame = 0;
    let x = -100;
    let y = -100;
    let visible = false;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      visible = true;
      cursor.classList.add("is-visible");
      if (frame) return;
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        frame = 0;
      });
    };
    const over = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, [role='button'], [data-cursor='interactive']");
      cursor.classList.toggle("is-active", !!interactive && !(interactive instanceof HTMLButtonElement && interactive.disabled));
      cursor.classList.toggle("is-text", !!target.closest("input, textarea, [contenteditable='true']"));
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse") cursor.classList.add("is-down");
    };
    const up = () => cursor.classList.remove("is-down");
    const leave = () => {
      visible = false;
      cursor.classList.remove("is-visible", "is-active", "is-text", "is-down");
    };
    const enter = () => {
      if (visible) cursor.classList.add("is-visible");
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", up, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("forma-custom-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);

  return <div className="forma-cursor" aria-hidden="true"><i /></div>;
}
