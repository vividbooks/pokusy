import { useState } from "react";
import type { VividbooksPanelData } from "../data/vividbooksResolve";
import type { VividbooksDocumentItem, VividbooksFlatLesson } from "../data/vividbooksTypes";
import "./vividbooks-panel.css";

type PanelProps = {
  data: VividbooksPanelData;
  variant?: "default" | "compact";
  id?: string;
};

function normName(s: string | null | undefined): string {
  return (s ?? "").replace(/\u00a0/g, " ").trim();
}

function isBadatelskyDocument(d: VividbooksDocumentItem): boolean {
  return /badatelsk/i.test(d.name ?? "");
}

/** Řešení / správné odpovědi — to není učební text. */
function isReseniOrKlicDocument(d: VividbooksDocumentItem): boolean {
  return /řešení|spr[aá]vn|odpov[eě]di/i.test(d.name ?? "");
}

function badatelskeDocuments(lesson: VividbooksFlatLesson): VividbooksDocumentItem[] {
  return lesson.documents.filter((d) => d.documentUrl && isBadatelskyDocument(d));
}

/**
 * Pracovní list „str. N …“ z manifestu (worksheet v documents) — ve Vividbooks má vlastní náhled (`previewUrl`).
 */
function pracovniListStrDocuments(lesson: VividbooksFlatLesson): VividbooksDocumentItem[] {
  return lesson.documents.filter(
    (d) =>
      d.documentUrl &&
      d.type === "worksheet" &&
      !isBadatelskyDocument(d) &&
      !isReseniOrKlicDocument(d) &&
      /^str\.\s*\d/i.test(normName(d.name)),
  );
}

function IconWorksheet() {
  return (
    <svg className="vividbooks-panel__blob-glyph" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2zm2-11H8v3h2V5z"
      />
    </svg>
  );
}

function BlobColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="vividbooks-panel__blob-col">
      <h4 className="vividbooks-panel__blob-col-title">{title}</h4>
      <div className="vividbooks-panel__blob-col-body">{children}</div>
    </div>
  );
}

/** Pracovní list s náhledem z `previewUrl` (stejně jako náhled lekce v adminu / manifestu). */
function BlobWorksheetWithPreview({
  href,
  label,
  previewUrl,
}: {
  href: string;
  label: string;
  previewUrl?: string | null;
}) {
  const left = previewUrl ? (
    <span className="vividbooks-panel__blob-icon vividbooks-panel__blob-icon--thumb">
      <img
        className="vividbooks-panel__blob-thumb-img"
        src={previewUrl}
        alt=""
        loading="lazy"
        width={48}
        height={48}
      />
    </span>
  ) : (
    <span className="vividbooks-panel__blob-icon vividbooks-panel__blob-icon--symbol">
      <IconWorksheet />
    </span>
  );

  return (
    <a className="vividbooks-panel__blob" href={href} target="_blank" rel="noopener noreferrer">
      {left}
      <span className="vividbooks-panel__blob-text">
        <span className="vividbooks-panel__blob-label">{label}</span>
      </span>
    </a>
  );
}

function BlobInteractive({ lesson }: { lesson: VividbooksFlatLesson }) {
  const thumb = lesson.previewImageUrl ? (
    <img
      className="vividbooks-panel__blob-thumb-img"
      src={lesson.previewImageUrl}
      alt=""
      loading="lazy"
      width={48}
      height={48}
    />
  ) : (
    <div className="vividbooks-panel__blob-thumb-fallback" aria-hidden />
  );

  return (
    <div className="vividbooks-panel__blob vividbooks-panel__blob--static">
      <span className="vividbooks-panel__blob-icon vividbooks-panel__blob-icon--thumb">{thumb}</span>
      <span className="vividbooks-panel__blob-text">
        <span className="vividbooks-panel__blob-label">{lesson.name}</span>
        <span className="vividbooks-panel__blob-sub">
          {lesson.bookName}
          <span className="vividbooks-panel__sep"> · </span>
          {lesson.chapterName}
        </span>
      </span>
    </div>
  );
}

function LessonBlobs({ lesson }: { lesson: VividbooksFlatLesson }) {
  const badatelske = badatelskeDocuments(lesson);
  const pracovniStr = pracovniListStrDocuments(lesson);

  return (
    <div className="vividbooks-panel__lesson-pack">
      <div className="vividbooks-panel__blob-grid">
        <BlobColumn title="Interaktivní lekce">
          <BlobInteractive lesson={lesson} />
        </BlobColumn>

        {pracovniStr.length > 0 ? (
          <BlobColumn title="Pracovní list">
            {pracovniStr.map((d, i) => (
              <BlobWorksheetWithPreview
                key={d.id ?? `${lesson.knowledgeId}-pl-${i}`}
                href={d.documentUrl!}
                label={normName(d.name)}
                previewUrl={d.previewUrl}
              />
            ))}
          </BlobColumn>
        ) : null}

        {badatelske.length > 0 ? (
          <BlobColumn title="Badatelský list">
            {badatelske.map((d, i) => (
              <BlobWorksheetWithPreview
                key={d.id ?? `${lesson.knowledgeId}-bad-${i}`}
                href={d.documentUrl!}
                label={d.name ?? "Badatelský list"}
                previewUrl={d.previewUrl}
              />
            ))}
          </BlobColumn>
        ) : null}
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`vividbooks-panel__chevron${open ? " vividbooks-panel__chevron--open" : ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
      />
    </svg>
  );
}

export function VividbooksLessonsPanel({ data, variant = "default", id }: PanelProps) {
  const { lessons, note, missingKnowledgeIds } = data;
  const compact = variant === "compact";
  const [open, setOpen] = useState(false);
  const titleText = compact ? "Související lekce Vividbooks" : "Vividbooks — související lekce";

  return (
    <section
      className={`vividbooks-panel${compact ? " vividbooks-panel--compact" : ""}${
        open ? " vividbooks-panel--open" : ""
      }`}
      id={id}
      aria-labelledby="vividbooks-panel-title"
    >
      <h2 id="vividbooks-panel-title" className="vividbooks-panel__title vividbooks-panel__title--accordion">
        <button
          type="button"
          className="vividbooks-panel__toggle"
          aria-expanded={open}
          aria-controls="vividbooks-panel-body"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="vividbooks-panel__toggle-label">{titleText}</span>
          <Chevron open={open} />
        </button>
      </h2>

      <div id="vividbooks-panel-body" className="vividbooks-panel__body" hidden={!open}>
        {!compact ? (
          <p className="vividbooks-panel__intro">
            Materiály z offline manifestů projektu (živé API se v aplikaci nevolá). Odkazy vedou na{" "}
            <code className="vividbooks-panel__code">api.vividbooks.com</code>; dostupnost závisí na licenci školy /
            účtu Vividbooks.
          </p>
        ) : (
          <p className="vividbooks-panel__intro vividbooks-panel__intro--compact">
            Vybrané lekce z chemických učebnic (offline manifesty). Odkaz podle licence školy.
          </p>
        )}
        {note && !compact ? <p className="vividbooks-panel__note">{note}</p> : null}

        {missingKnowledgeIds.length > 0 ? (
          <p className="vividbooks-panel__warn" role="status">
            V manifestu chybí lekce s ID: {missingKnowledgeIds.join(", ")} — zkuste{" "}
            <code className="vividbooks-panel__code">npm run data:vividbooks</code> nebo upravte mapování v{" "}
            <code className="vividbooks-panel__code">vividbooksLessonMappings.ts</code> nebo heuristiku v{" "}
            <code className="vividbooks-panel__code">vividbooksExperimentMatch.ts</code>.
          </p>
        ) : null}

        <ul className="vividbooks-panel__lessons">
          {lessons.map((lesson) => (
            <li key={lesson.knowledgeId} className="vividbooks-panel__lesson-wrap">
              <LessonBlobs lesson={lesson} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
