import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { VividbooksLessonsSection } from "../../components/VividbooksLessonsSection";
import { ExperimentPageTitle } from "../../components/ExperimentPageTitle";
import { Accordion } from "../../components/experiment/Accordion";
import { ExperimentQuickFactsInfographic, type QuickFact } from "../../components/experiment/ExperimentQuickFactsInfographic";
import { YouTubeEmbed } from "../../components/experiment/YouTubeEmbed";
import { ebedoxRichContent } from "../../data/ebedox-rich-content.generated";
import { getExperiment } from "../../data/catalog";
import "../experiment-rich-ux.css";

const U = "https://ebedox.cz/wp-content/uploads";
/** Obecné piktogramy — vizuální návaznost na ostatní pokusy, detail v PDF. */
const DEFAULT_GHS: string[] = [
  `${U}/2021/06/Drazdive-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
  `${U}/2021/06/Horlave-150x150.png`,
];

/**
 * Automaticky generovaná stránka z dat WordPress/eBedox (PDF, video, postup).
 * Ručně psané komponenty v ExperimentDetail mají přednost.
 */
export default function EbedoxExperimentRichPage() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();

  const resolved = useMemo(() => {
    if (!categorySlug || !experimentSlug) return null;
    return getExperiment(categorySlug, experimentSlug) ?? null;
  }, [categorySlug, experimentSlug]);

  const data = experimentSlug ? ebedoxRichContent[experimentSlug] : undefined;

  const experimentTitle = resolved?.experiment.title ?? "Pokus";
  const sourceUrl = resolved?.experiment.sourceUrl ?? "https://ebedox.cz/";

  const pdfHref = data?.pdfHref ?? sourceUrl;
  const quick = data?.quick ?? {
    time: "—",
    risk: "—",
    kind: "—",
    hazards: "—",
  };

  const facts: QuickFact[] = [
    { label: "Čas", value: quick.time, tone: "time" },
    { label: "Míra rizika", value: quick.risk.replace(/^-\s*/, ""), tone: "risk" },
    { label: "Druh pokusu", value: quick.kind.replace(/^-\s*/, ""), tone: "type" },
    { label: "Možná nebezpečí", value: quick.hazards.replace(/^-\s*/, ""), tone: "hazard" },
  ];

  const steps = data?.procedureSteps?.length
    ? data.procedureSteps
    : [{ title: "Postup", body: "Podrobný pracovní postup je v metodickém listu (PDF) na eBedox." }];

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>{experimentTitle}</ExperimentPageTitle>

      <aside className="exp-ux__aside" aria-label="Navigace a souhrn pokusu">
        <nav className="exp-ux__toc exp-ux__toc--aside" aria-label="Skok na sekci">
          <a href="#prehled">Přehled</a>
          <a href="#vividbooks">Vividbooks</a>
          <a href="#video">Video</a>
          <a href="#vybaveni">Vybavení a postup</a>
          <a href="#didaktika">Didaktika</a>
          <a href="#bezpecnost">Bezpečnost</a>
        </nav>

        <ExperimentQuickFactsInfographic facts={facts} pdfHref={pdfHref} />
      </aside>

      <div className="exp-ux__main">
        <header id="prehled" className="exp-ux__hero exp-ux__section">
          {experimentSlug ? (
            <VividbooksLessonsSection
              experimentSlug={experimentSlug}
              experimentTitle={experimentTitle}
              variant="compact"
            />
          ) : null}

          <div className="exp-ux__facts">
            <h2>Shrnutí</h2>
            <p className="exp-ux-prose">
              Text a postup níže pocházejí z veřejného obsahu eBedox (automaticky staženého). Kompletní metodiku,
              tabulky chemikálií a bezpečnostní pokyny vždy ověřte v aktuálním PDF metodického listu.
            </p>
          </div>

          <div className="exp-ux__ghs">
            <p className="exp-ux__ghs-caption">Obvyklé kategorie rizik (detail v PDF).</p>
            <div className="exp-ux-ghs-row" aria-label="Piktogramy nebezpečí">
              {DEFAULT_GHS.map((src) => (
                <div key={src} className="exp-ux-ghs-item">
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </header>

        {data?.youtubeVideoId ? (
          <section id="video" className="exp-ux__section">
            <h2 className="exp-ux__section-title">Instruktážní materiály</h2>
            <div className="exp-ux-video-card">
              <p className="exp-ux-video-card__hint">Doporučujeme nejdřív přehrát instruktážní video z eBedox.</p>
              <YouTubeEmbed videoId={data.youtubeVideoId} title={`Instruktážní video — ${experimentTitle}`} />
            </div>
          </section>
        ) : (
          <section id="video" className="exp-ux__section">
            <h2 className="exp-ux__section-title">Instruktážní materiály</h2>
            <p className="exp-ux-prose">
              U tohoto pokusu nebylo ve zdrojové stránce nalezeno vložené video — použijte metodický list (PDF) a odkaz na
              eBedox.
            </p>
          </section>
        )}

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>
          <p className="exp-ux-prose">
            Seznam pomůcek, ochranných prostředků a přesný postup je v metodickém listu (PDF). Níže je zkrácený přepis
            pracovního postupu z webu eBedox.
          </p>

          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              {steps.map((step, i) => (
                <li key={`${step.title}-${i}`} className="exp-ux-procedure__step">
                  <span className="exp-ux-procedure__step-title">{step.title}</span>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="didaktika" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Didaktika a chemikálie</h2>
          <Accordion title="Vysvětlení a látky" defaultOpen>
            <p className="exp-ux-prose">
              Slovní vysvětlení reakcí, přehled chemikálií s piktogramy GHS a bezpečnostními listy najdete v metodickém
              listu (PDF) a na původní stránce projektu eBedox.
            </p>
            <p className="exp-ux-prose" style={{ marginTop: "1rem" }}>
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                Otevřít celý článek na eBedox.cz →
              </a>
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Bezpečnost</h2>
          <Accordion title="Pokyny pro bezpečné provedení" defaultOpen>
            <p className="exp-ux-prose">
              Kompletní kapitolu o BOZP, zakázaných činnostech a likvidaci odpadů najdete výhradně v oficiálním
              metodickém listu (PDF). Při práci v laboratoři dodržujte platné předpisy a pokyny školy.
            </p>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
