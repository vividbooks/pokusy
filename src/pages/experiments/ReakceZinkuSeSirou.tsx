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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/4_Reakce-zinku-se-sirou-1.pdf";
const YT_VIDEO_ID = "E1R48hche5Q";

const ghsThumbs: string[] = [
  `${U}/2021/06/Horlave-150x150.png`,
  `${U}/2021/06/Drazdive-150x150.png`,
  `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
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
  { label: "Čas", value: "10 min", tone: "time" },
  { label: "Míra rizika", value: "Velmi vysoké (!!!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační, prezentační (video ukázka)", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Výbuch / požár, popálení (teplo / chlad), mechanické poranění",
    tone: "hazard",
  },
];

type Chem = {
  name: string;
  formula: ReactNode;
  hazards: string[];
  hazardText: string[];
  sds?: string;
};

const CHEMICALS: Chem[] = [
  {
    name: "Síra",
    formula: <>S</>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`, `${U}/2021/06/Horlave-150x150.png`],
    hazardText: [
      "- Dráždivé nebo s narkotickými účinky",
      "- Hořlavé nebo samozápalné",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/sira.pdf",
  },
  {
    name: "Zinek práškový pyroforický",
    formula: <>Zn</>,
    hazards: [`${U}/2021/06/Horlave-150x150.png`, `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`],
    hazardText: ["- Hořlavé a samozápalné", "- Nebezpečné pro vodní prostředí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Zinek-prasek.pdf",
  },
  {
    name: "Sulfid zinečnatý",
    formula: <>ZnS</>,
    hazards: [],
    hazardText: ["Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Sulfid-zinecnaty.pdf",
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
      {sds ? (
        <a className="exp-ux-chem__sds" href={sds} target="_blank" rel="noopener noreferrer">
          Bezpečnostní list (PDF)
        </a>
      ) : null}
    </article>
  );
}

export default function ReakceZinkuSeSirou() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Reakce zinku se sírou";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Reakce zinku se sírou";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Reakce zinku se sírou</ExperimentPageTitle>

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
              <dd>Žáci 8. ročníku, žáci 9. ročníku, žáci středních škol, žáci gymnázií</dd>
              <dt>Tematické celky</dt>
              <dd>Chemické prvky, chemické reakce</dd>
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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Reakce zinku se sírou" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl
              items={[
                "- Laboratoř",
                "- Stabilní pracovní stůl",
                "- Digestoř",
                "- Nehořlavá podložka",
              ]}
            />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Nehořlavá podložka (keramická síťka)",
                "- Trojnožka",
                "- Tyčový zapalovač",
                "- Laboratorní lžička",
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
                "- Miska nebo kbelík s vodou",
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> práškový zinek, prášková síra
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Příprava směsi</span>
                <p>
                  Připravíme směs práškového zinku a práškové síry v poměru hmotností 2 : 1.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Násyp na síťku</span>
                <p>
                  Dvě až tři lžičky směsi nasypeme do středu keramické síťky položené na trojnožce.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Zapálení a průběh reakce</span>
                <p>
                  Plamen zapalovače přiložíme k hromádce připravené směsi. S oslnivým zábleskem proběhne
                  exotermická reakce.
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
              <p>Zinek reaguje se sírou za zvýšené teploty za vzniku sulfidu zinečnatého. Po zahřátí a zapálení směsi dochází k bouřlivé reakci doprovázené výrazným světelným (záblesk) i tepelným efektem.</p>
              <p className="exp-ux-eq">Zn + S → ZnS</p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Po zapálení reakční směsi dojde k bouřlivé reakci s výrazným zábleskem.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Pokus lze využít k demonstraci chemické změny. Rozdíl ve vlastnostech výchozích látek (směsi
              práškového zinku a práškové síry) a produktu (vzniklého sulfidu zinečnatého) lze ukázat ve dvou
              zkumavkách s vodou: do první nasypeme trochu reakční směsi (zinek klesá ke dnu a síra plave na
              hladině) a do druhé výsledný produkt reakce (nedojde k rozdělení na výchozí látky).
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství látky. Při
              manipulaci se sírou dbát na to, aby nedošlo ke kontaktu s kůží. Stojánek s reakční směsí umístit
              dál od okraje pracovního stolu.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Vhodné je použití laboratorního zapalovače z důvodu nutnosti delšího ohřevu směsi než dojde k jejímu
              vzplanutí.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Vzniklý sulfid zinečnatý po vychladnutí uložíme do uzavřené odpadní nádoby s příslušným
              bezpečnostním označením a necháme zlikvidovat specializovanou firmou (H411 toxický pro vodní
              organismy, s dlouhodobými účinky).
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <p className="exp-ux-prose">
              Se sírou manipulovat se zvýšenou opatrností a mimo dosah zdrojů zapálení (při přípravě reakční
              směsi). Při zapalování reakční směsi je nutné mít stažené sklo digestoře, protože po zapálení
              dochází k rychlému vzplanutí a rozletu žhavých částic. Za účelem ochrany před vznikem popálenin je
              nutné použít rukavice a mít upnuté rukávy. Reakční směs zapalovat výlučně tyčkovým zapalovačem.
            </p>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>Vyvarovat se zvíření kovového zinku – při styku se vzduchem se může samovolně vznítit.</li>
              <li>
                Je zakázáno provádět tento pokus alternativním způsobem nebo za použití jiného pomůckového
                vybavení, než jak je uvedeno v tomto metodickém listě.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
