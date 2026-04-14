import type { ReactNode } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExperimentPageTitle } from "../../components/ExperimentPageTitle";
import { VividbooksLessonsSection } from "../../components/VividbooksLessonsSection";
import { Accordion } from "../../components/experiment/Accordion";
import {
  ExperimentQuickFactsInfographic,
  type QuickFact,
} from "../../components/experiment/ExperimentQuickFactsInfographic";
import { YouTubeEmbed } from "../../components/experiment/YouTubeEmbed";
import { getExperiment } from "../../data/catalog";
import "../experiment-rich-ux.css";

const U = "https://ebedox.cz/wp-content/uploads";
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/13_Haseni-horiciho-horciku-oxidem-uhlicitym.pdf";
const YT_VIDEO_ID = "5tQXwgDDjpI";

const ghsThumbs: string[] = [
  `${U}/2021/06/Horlave-150x150.png`,
  `${U}/2021/06/Drazdive-150x150.png`,
];

function stripLeadDash(s: string): string {
  return s.replace(/^-\s*/, "");
}

function BulletUl({ items }: { items: string[] }) {
  return (
    <ul className="exp-ux-ul">
      {items.map((t) => (
        <li key={t}>{stripLeadDash(t)}</li>
      ))}
    </ul>
  );
}

const QUICK_FACTS: QuickFact[] = [
  { label: "Čas", value: "15 min", tone: "time" },
  { label: "Míra rizika", value: "Významné (!!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Popálení / mechanické poranění",
    tone: "hazard",
  },
];

type Chem = {
  name: string;
  formula: ReactNode;
  hazards: string[];
  hazardText: string[];
  sds: string;
};

const CHEMICALS: Chem[] = [
  {
    name: "Hořčík",
    formula: <>Mg</>,
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé a samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Horcik.pdf",
  },
  {
    name: "Oxid uhličitý",
    formula: <>CO<sub>2</sub></>,
    hazards: [],
    hazardText: ["- Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-uhlicity.pdf",
  },
  {
    name: "Oxid hořečnatý",
    formula: <>MgO</>,
    hazards: [],
    hazardText: ["- Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-horecnaty.pdf",
  },
  {
    name: "Uhlík",
    formula: <>C</>,
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé a samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Drevene-uhli.pdf",
  },
];

function ChemCard({ name, formula, hazards, hazardText, sds }: Chem) {
  return (
    <article className="exp-ux-chem">
      <header className="exp-ux-chem__head">
        <h3 className="exp-ux-chem__name">{name}</h3>
        <div className="exp-ux-chem__formula">{formula}</div>
      </header>
      {hazards.length > 0 ? (
        <div className="exp-ux-chem__icons" aria-hidden>
          {hazards.map((src) => (
            <img key={src} src={src} alt="" width={40} height={40} loading="lazy" />
          ))}
        </div>
      ) : null}
      <ul className="exp-ux-chem__hazards">
        {hazardText.map((t) => (
          <li key={t}>{stripLeadDash(t)}</li>
        ))}
      </ul>
      <a className="exp-ux-chem__sds" href={sds} target="_blank" rel="noopener noreferrer">
        Bezpečnostní list (PDF)
      </a>
    </article>
  );
}

export default function HaseniHoricihoHorcikuOxidemUhlicitym() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Hašení hořícího hořčíku oxidem uhličitým";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Hašení hořícího hořčíku oxidem uhličitým";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Hašení hořícího hořčíku oxidem uhličitým</ExperimentPageTitle>

      <aside className="exp-ux__aside" aria-label="Navigace a souhrn pokusu">
        <nav className="exp-ux__toc exp-ux__toc--aside" aria-label="Skok na sekci">
          <a href="#prehled">Přehled</a>
          <a href="#vividbooks">Vividbooks</a>
          <a href="#video">Video</a>
          <a href="#vybaveni">Vybavení a postup</a>
          <a href="#chemie">Chemikálie</a>
          <a href="#didaktika">Didaktika</a>
          <a href="#bezpecnost">Bezpečnost</a>
        </nav>

        <ExperimentQuickFactsInfographic facts={QUICK_FACTS} pdfHref={PDF} />
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
            <dl className="exp-ux-dl">
              <dt>Vhodná cílová skupina</dt>
              <dd>Žáci 8.–9. ročníku, žáci středních škol, žáci gymnázií</dd>
              <dt>Tematické celky</dt>
              <dd>Chemické prvky, oxidy a peroxidy</dd>
            </dl>
          </div>

          <div className="exp-ux__ghs">
            <p className="exp-ux__ghs-caption">Piktogramy GHS u tohoto pokusu.</p>
            <div className="exp-ux-ghs-row" aria-label="Piktogramy nebezpečí">
              {ghsThumbs.map((src) => (
                <div key={src} className="exp-ux-ghs-item">
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </header>

        <section id="video" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Instruktážní materiály</h2>
          <div className="exp-ux-video-card">
            <p className="exp-ux-video-card__hint">Doporučujeme nejdřív přehrát instruktážní video.</p>
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Hašení hořícího hořčíku oxidem uhličitým" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl items={["- Laboratoř", "- Stabilní pracovní stůl"]} />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Varná baňka s rovným dnem (1000 ml)",
                "- Hodinové sklo k zakrytí baňky",
                "- Kahan",
                "- Chemické kleště",
                "- Zapalovač",
                "- Špejle",
              ]}
            />
          </Accordion>
          <Accordion title="Ochranné pomůcky">
            <BulletUl
              items={[
                "- Pracovní obuv chránící před chemickými látkami",
                "- Ochranný oděv (plášť / zástěra na ochranu před ch. l.)",
                "- Ochranné brýle",
                "- Rukavice z nitrilové pryže (vrstva 0,11 mm)",
              ]}
            />
          </Accordion>
          <Accordion title="Havarijní a sanační prostředky">
            <BulletUl
              items={[
                "- Lékárnička",
                "- Práškový nebo sněhový hasicí přístroj",
                "- Hasicí přikrývka",
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> oxid uhličitý, hořčík (páska)
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Naplňování baňky oxidem uhličitým</span>
                <p>
                  Ke dnu baňky trubičkou zavádíme oxid uhličitý z Kippova přístroje tak dlouho, až se baňka naplní. Že je
                  baňka plynem naplněna, ověříme hořící špejlí, která po vložení do ústí baňky zhasne.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Hoření hořčíku v CO₂</span>
                <p>
                  Baňku zakryjeme hodinovým sklem. Jeden konec hořčíkové pásky uchopíme do chemických kleští a druhý konec
                  vložíme do plamene kahanu. Jakmile začne hořčík hořet, vložíme ho do baňky s oxidem uhličitým.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section id="chemie" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Chemikálie</h2>
          <p className="exp-ux-prose" style={{ marginBottom: "1rem" }}>
            U každé látky jsou uvedeny piktogramy, stručné údaje o nebezpečí a odkaz na bezpečnostní list.
          </p>
          <div className="exp-ux-chem-grid">
            {CHEMICALS.map((c) => (
              <ChemCard key={c.name} {...c} />
            ))}
          </div>
        </section>

        <section id="didaktika" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Didaktická část</h2>
          <Accordion title="Vysvětlení podstaty pokusu" defaultOpen>
            <div className="exp-ux-prose">
              <p>Při teplotě plamene reaguje hořčík s oxidem uhličitým; vzniká bílý oxid hořečnatý a uhlík (saze):</p>
              <p className="exp-ux-eq">
                2 Mg + CO<sub>2</sub> → 2 MgO + C
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">Hořčík hoří i v oxidu uhličitém, vzniká bílý prášek a černá látka.</p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Kovový hořčík se využívá na přípravu tzv. bleskového prášku. Jedná se o pyrotechnickou směs emitující oslnivé
              světlo, která se používá při divadelních efektech, ohňostrojích a v minulosti se používal také pro záblesky
              pro účely fotografování.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Použít pouze nezbytně nutné množství kovového hořčíku. Hořčíkovou pásku uchopovat kovovými kleštěmi.
              Dodržovat na pracovním místě čistotu a pořádek.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">Jedná se o jednoduchý pokus bez nutnosti dalších pokynů pro použití pomůckového vybavení.</p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">Vzniklý oxid hořečnatý a saze likvidujeme spolu s tuhým komunálním odpadem.</p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <p className="exp-ux-prose">
              Při tomto pokusu se používá hořčík, který je hořlavý. Pro jeho zapálení je nutné použít tyčový zapalovač nebo
              hořící kahan.
            </p>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>
                Po celou dobu laboratorní práce je zakázáno vzdalovat se z pracovního místa nebo se věnovat jiné činnosti,
                která by mohla odvádět pozornost.
              </li>
              <li>
                Zamezit styku hořčíku s vodou (včetně hašení požáru) – dochází k uvolňování hořlavých plynů.
              </li>
              <li>
                Je zakázáno provádět tento pokus alternativním způsobem nebo za použití jiného pomůckového vybavení, než
                jak je uvedeno v tomto metodickém listě.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
