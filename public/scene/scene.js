import { FormaScene, React, JSX, ReactDOM, ScrollTrigger } from './engine.js';

// The production FormaScene renderer is preserved. Only its transient background
// grid layer is omitted at composition; the F, materials, lighting, camera,
// interactions and scroll-driven motion are unchanged inside engine.js.
function Scene() {
  const [progress, setProgress] = React.useState(0);
  const section = React.useRef(null);
  React.useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 0.64)}`,
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: false,
      onUpdate: ({ progress }) => setProgress(Math.min(1, Math.max(0, progress))),
    });
    ScrollTrigger.refresh();
    return () => trigger.kill();
  }, []);
  return JSX.jsxs('main', {
    className: 'main--ready',
    children: [
      JSX.jsx('div', { className: 'scene-spacer' }),
      JSX.jsx('section', {
        className: 'build-section',
        ref: section,
        children: JSX.jsx('div', {
          className: 'build-sticky',
          children: JSX.jsx('div', {
            className: 'build-scene-wrap',
            style: { opacity: 1 },
            children: JSX.jsx(FormaScene, { progress, pointer: { x: 0, y: 0 } }),
          }),
        }),
      }),
    ],
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  JSX.jsx(React.StrictMode, { children: JSX.jsx(Scene, {}) }),
);
