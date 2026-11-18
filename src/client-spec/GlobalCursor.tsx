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

    // Les interactions des scènes 3D sont dans un document iframe same-origin.
    // Relayer les coordonnées du pointeur au curseur global, sans gêner WebGL.
    const frameListeners = new Map<HTMLIFrameElement, () => void>();
    const trackFrame = (iframe: HTMLIFrameElement) => {
      const child = iframe.contentDocument;
      if (!child || frameListeners.has(iframe)) return;
      const inlineStyle = child.createElement("style");
      inlineStyle.textContent = 'html.forma-frame-custom-cursor,html.forma-frame-custom-cursor *{cursor:none!important}html.forma-frame-custom-cursor :is(input,textarea,[contenteditable="true"]){cursor:text!important}';
      child.head?.append(inlineStyle);
      child.documentElement.classList.add("forma-frame-custom-cursor");

      const moveInFrame = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const rect = iframe.getBoundingClientRect();
        x = rect.left + event.clientX * (rect.width / Math.max(1, iframe.clientWidth));
        y = rect.top + event.clientY * (rect.height / Math.max(1, iframe.clientHeight));
        visible = true;
        cursor.classList.add("is-visible");
        if (!frame) {
          frame = requestAnimationFrame(() => {
            cursor.style.transform = "translate3d(" + x + "px, " + y + "px, 0) translate(-50%, -50%)";
            frame = 0;
          });
        }
        const hovered = event.target as Element | null;
        const interaction = hovered?.closest?.("button,a,[role='button']");
        cursor.classList.toggle("is-active", !!interaction);
        cursor.classList.toggle("is-text", !!hovered?.closest?.("input,textarea,[contenteditable='true']"));
      };
      const downInFrame = (event: PointerEvent) => {
        if (event.pointerType === "mouse") cursor.classList.add("is-down");
      };
      const upInFrame = () => cursor.classList.remove("is-down");
      const exitFrame = () => cursor.classList.remove("is-visible", "is-active", "is-down", "is-text");
      child.addEventListener("pointermove", moveInFrame, { passive: true });
      child.addEventListener("pointerdown", downInFrame, { passive: true });
      child.addEventListener("pointerup", upInFrame, { passive: true });
      child.addEventListener("pointerleave", exitFrame);
      frameListeners.set(iframe, () => {
        child.removeEventListener("pointermove", moveInFrame);
        child.removeEventListener("pointerdown", downInFrame);
        child.removeEventListener("pointerup", upInFrame);
        child.removeEventListener("pointerleave", exitFrame);
        child.documentElement.classList.remove("forma-frame-custom-cursor");
        inlineStyle.remove();
      });
    };
    const frameLoaded = (event: Event) => {
      if (!(event.target instanceof HTMLIFrameElement)) return;
      frameListeners.get(event.target)?.();
      frameListeners.delete(event.target);
      trackFrame(event.target);
    };
    document.addEventListener("load", frameLoaded, true);
    document.querySelectorAll("iframe").forEach(trackFrame);
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", up, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("load", frameLoaded, true);
      frameListeners.forEach(cleanup => cleanup());
      frameListeners.clear();
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
