import { useEffect, useRef, useState } from "react";
import { useProject } from "./ProjectState";
import { Arrow, href } from "./Chrome";
function PhotoPreview({ file }: { file: File }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const value = URL.createObjectURL(file);
    setUrl(value);
    return () => URL.revokeObjectURL(value);
  }, [file]);
  return <img src={url} alt={file.name} />;
}
export function FForm() {
  const { project, setProject } = useProject();
  const [error, setError] = useState("");
  const field = useRef<HTMLInputElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const step = project.step;
  const titles = [
    "Nom du site web",
    "Photos de la boutique / des bâtiments",
    "Informations complémentaires",
  ];
  useEffect(() => {
    if (!project.type) location.hash = href("choix-site");
  }, [project.type]);
  useEffect(() => {
    region.current
      ?.querySelector<HTMLElement>("input,textarea,button")
      ?.focus({ preventScroll: true });
  }, [step]);
  function next() {
    if (step === 0 && !project.name.trim()) {
      setError("Le nom du site web est obligatoire.");
      field.current?.focus();
      return;
    }
    setError("");
    if (step === 2) {
      location.hash = href("options");
      return;
    }
    setProject((p) => ({ ...p, step: step + 1 }));
  }
  function addPhotos(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files);
    if (
      next.some(
        (f) =>
          !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
            f.type,
          ),
      )
    ) {
      setError("Ajoutez des images JPEG, PNG, WebP ou AVIF.");
      return;
    }
    if (
      next.some((f) => f.size > 10 * 1024 * 1024) ||
      project.photos.length + next.length > 6
    ) {
      setError(
        "Vous pouvez ajouter jusqu’à 6 images, de 10 Mo maximum chacune.",
      );
      return;
    }
    setProject((p) => ({ ...p, photos: [...p.photos, ...next] }));
    setError("");
  }
  return (
    <section className="spec-page spec-form-page">
      <div className={`spec-f-form step-${step}`}>
        <div className="spec-f-stem" aria-hidden="true" />
        <div className="spec-f-top">
          <div className="spec-question" ref={step === 0 ? region : undefined}>
            {step === 0 ? (
              <>
                <label htmlFor="site-name">{titles[0]}</label>
                <div className="spec-field-line">
                  <input
                    id="site-name"
                    ref={field}
                    value={project.name}
                    onChange={(e) =>
                      setProject((p) => ({ ...p, name: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") next();
                    }}
                    required
                    maxLength={120}
                    autoComplete="organization"
                    aria-invalid={!!error}
                    aria-describedby={error ? "f-error" : undefined}
                  />
                  <button
                    onClick={next}
                    aria-label="Valider le nom du site web"
                  >
                    <Arrow />
                  </button>
                </div>
              </>
            ) : (
              <button
                className="spec-f-answer"
                onClick={() => {
                  setError("");
                  setProject((p) => ({ ...p, step: 0 }));
                }}
              >
                <span>{titles[0]}</span>
                <strong>{project.name}</strong>
                <span>Modifier</span>
              </button>
            )}
          </div>
        </div>
        <div className={`spec-f-middle ${step >= 1 ? "deployed" : ""}`}>
          <div className="spec-question" ref={step === 1 ? region : undefined}>
            {step === 1 ? (
              <>
                <label htmlFor="site-photos">{titles[1]}</label>
                <span className="spec-optional">Facultatif</span>
                <input
                  id="site-photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
                <div className="spec-photo-previews">
                  {project.photos.map((f, i) => (
                    <div key={`${f.name}-${i}`}>
                      <PhotoPreview file={f} />
                      <button
                        aria-label={`Retirer ${f.name}`}
                        onClick={() =>
                          setProject((p) => ({
                            ...p,
                            photos: p.photos.filter((_, index) => index !== i),
                          }))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button className="spec-f-next" onClick={next}>
                  {project.photos.length ? "Valider" : "Passer"}
                  <Arrow />
                </button>
              </>
            ) : step > 1 ? (
              <button
                className="spec-f-answer"
                onClick={() => {
                  setError("");
                  setProject((p) => ({ ...p, step: 1 }));
                }}
              >
                <span>{titles[1]}</span>
                <strong>
                  {project.photos.length
                    ? `${project.photos.length} photo(s)`
                    : "Aucune photo"}
                </strong>
                <span>Modifier</span>
              </button>
            ) : null}
          </div>
        </div>
        <div
          className={`spec-f-lower ${step === 2 ? "deployed" : ""}`}
          ref={step === 2 ? region : undefined}
        >
          {step === 2 && (
            <>
              <label htmlFor="site-notes">{titles[2]}</label>
              <span className="spec-optional">Facultatif</span>
              <textarea
                id="site-notes"
                value={project.notes}
                onChange={(e) =>
                  setProject((p) => ({ ...p, notes: e.target.value }))
                }
                rows={5}
                maxLength={5000}
              />
              <button className="spec-f-next" onClick={next}>
                {project.notes.trim() ? "Valider" : "Passer"}
                <Arrow />
              </button>
            </>
          )}
        </div>
        <p className="spec-f-progress" role="status">
          {step + 1} / 3
        </p>
        {error && (
          <p className="spec-form-error" id="f-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
