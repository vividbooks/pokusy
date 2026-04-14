import type { ReactNode } from "react";

export type QuickFactTone = "time" | "risk" | "type" | "hazard";

export type QuickFact = {
  label: string;
  value: string;
  tone: QuickFactTone;
};

const icons: Record<QuickFactTone, ReactNode> = {
  time: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  risk: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3L4 20h16L12 3z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
    </svg>
  ),
  type: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 3h6v4H9V3zM7 7h10v14H7V7z" strokeLinejoin="round" />
      <path d="M10 11h4M10 15h2" strokeLinecap="round" />
    </svg>
  ),
  hazard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  ),
};

type Props = {
  facts: QuickFact[];
  pdfHref: string;
  pdfLabel?: string;
  heading?: string;
};

export function ExperimentQuickFactsInfographic({
  facts,
  pdfHref,
  pdfLabel = "Stáhnout metodický list (PDF)",
  heading = "Pokus v kostce",
}: Props) {
  return (
    <div className="exp-ux-infographic" role="group" aria-label="Klíčové údaje o pokusu">
      {heading ? <p className="exp-ux-infographic__kicker">{heading}</p> : null}
      <div className="exp-ux-infographic__grid">
        {facts.map((f) => (
          <div
            key={f.label}
            className={`exp-ux-infographic__tile exp-ux-infographic__tile--${f.tone}${
              f.tone === "hazard" || f.tone === "type" ? " exp-ux-infographic__tile--span" : ""
            }`}
          >
            <span className="exp-ux-infographic__icon-wrap">{icons[f.tone]}</span>
            <div className="exp-ux-infographic__text">
              <span className="exp-ux-infographic__label">{f.label}</span>
              <span className="exp-ux-infographic__value">{f.value}</span>
            </div>
          </div>
        ))}
      </div>
      <a className="exp-ux-infographic__pdf" href={pdfHref} target="_blank" rel="noopener noreferrer">
        <span className="exp-ux-infographic__pdf-icon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" />
            <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
          </svg>
        </span>
        <span className="exp-ux-infographic__pdf-text">{pdfLabel}</span>
      </a>
    </div>
  );
}
