import { useEffect, useRef, useState } from 'react';

/**
 * Temporary, local-only fidelity shell for the public FORMA distribution.
 * The archived application remains self-contained under /archive and its
 * original hashed assets are served from this Vite app's public directory.
 * Reconstructed React views should replace this frame incrementally, not by
 * altering the public-build archive.
 */
export default function App() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncOuterHash = () => {
      const child = frame.current?.contentWindow;
      if (!child) return;
      try {
        if (child.location.hash !== window.location.hash) {
          child.location.hash = window.location.hash;
        }
      } catch {
        // The captured frame is expected to be same-origin; no-op if not.
      }
    };

    const mirrorInnerHash = () => {
      const child = frame.current?.contentWindow;
      if (!child) return;
      try {
        const hash = child.location.hash;
        if (hash !== window.location.hash) {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
        }
      } catch {
        // Keep the parent route stable if browser security blocks frame access.
      }
    };

    window.addEventListener('hashchange', syncOuterHash);
    const interval = window.setInterval(mirrorInnerHash, 200);
    return () => {
      window.removeEventListener('hashchange', syncOuterHash);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main className="forma-shell" aria-label="FORMA">
      {!ready && <p className="loading-note" role="status">FORMA — chargement de la copie publique…</p>}
      <iframe
        ref={frame}
        className="forma-frame"
        src={`/archive/index.html${window.location.hash}`}
        title="Site FORMA — copie publique locale"
        onLoad={() => setReady(true)}
        allow="autoplay; fullscreen"
      />
    </main>
  );
}
