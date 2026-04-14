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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/5_Horeni-horciku-1.pdf";
const YT_VIDEO_ID = "JdvffehlX7c";

const ghsThumbs: string[] = [
  `${U}/2021/06/Horlave-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
  `${U}/2021/06/Vysoce-toxicke-150x150.png`,
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
    value: "Výbuch / požár, popálení, otrava (inhalace / požití), mechanické poranění",
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
    name: "Vodík",
    formula: (
      <>
        H<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/vodik.pdf",
  },
  {
    name: "Hořčík",
    formula: <>Mg</>,
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Horcik.pdf",
  },
  {
    name: "Nitrid hořečnatý",
    formula: (
      <>
        Mg<sub>3</sub>N<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Zirave-150x150.png`, `${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Žíravé a korozivní", "- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Nitrid-horecnaty_EN.pdf",
  },
  {
    name: "Oxid hořečnatý",
    formula: (
      <>
        MgO
      </>
    ),
    hazards: [],
    hazardText: ["Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-horecnaty.pdf",
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

export default function HoreniHorciku() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Hoření hořčíku";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Hoření hořčíku";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Hoření hořčíku</ExperimentPageTitle>

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
              <dd>Kyseliny a hydroxidy, chemické reakce, oxidy a peroxidy</dd>
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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Hoření hořčíku" />
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
                "- Přívod plynu",
                "- Nehořlavá podložka",
              ]}
            />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Laboratorní kahan",
                "- Laboratorní kleště",
                "- Keramická miska",
                "- Trojnožka",
                "- Nehořlavá podložka (keramická síťka)",
                "- Střička s vodou",
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
                "- Filtrační polomaska (respirátor)",
              ]}
            />
          </Accordion>
          <Accordion title="Havarijní a sanační prostředky">
            <BulletUl
              items={[
                "- Lékárnička",
                "- Práškový nebo sněhový hasicí přístroj",
                "- Hasicí přikrývka",
                "- Inertní posypový materiál (písek, bentonit nebo vermikulit)",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> hořčík (páska), hořčík (hobliny), voda
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Příprava a zapálení hořčíkové pásky</span>
                <p>
                  Připravíme si hořčíkovou pásku na nehořlavé podložce, chemické kleště, kahan a trojnožku s
                  keramickou síťkou, na kterou nasypeme 3 až 4 lžičky hořčíkových hoblin. Jeden konec hořčíkové
                  pásky uchopíme do chemických kleští a druhý konec vložíme do plamene kahanu. Hořčík se po zahřátí
                  vznítí a hoří oslnivým plamenem.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Hoření hoblin</span>
                <p>
                  Plamenem kahanu zahříváme na keramické síťce hořčíkové hobliny. Jakmile se vznítí, odstavíme kahan.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Reakce s vodou</span>
                <p>
                  Hořící hořčík se pokusíme uhasit vstříknutím vody ze střičky do plamene. Místo uhašení se plamen ještě
                  výrazně zvětší.
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
              <p>
                Hořčík hoří na vzduchu oslňujícím plamenem. Po zapálení reaguje s dusíkem a kyslíkem ze vzduchu, za
                vzniku oxidu hořečnatého a nitridu hořečnatého:
              </p>
              <p className="exp-ux-eq">5 Mg + O<sub>2</sub> + N<sub>2</sub> → MgO + Mg<sub>3</sub>N<sub>2</sub></p>
              <p>
                Po přikápnutí vody k hořícímu hořčíku nedochází k uhašení plamene, ale naopak k zintenzivnění hoření.
                To je způsobeno vysokou teplotou plamene, při které dochází k rozkladu vody na vodík a kyslík, který
                podporuje hoření. Navíc dochází také k reakci rozžhaveného hořčíku s vodou, za vzniku oxidu hořečnatého
                a dále hydroxidu hořečnatého. Ve všech případech vzniká také vodík, který je hořlavý.
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Po zapálení hořčíku pozorujeme oslňující plamen. Stříknutím vody k hořícímu hořčíku dojde k zintenzivnění
              hoření.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Hořčík je lehký, středně tvrdý, stříbrolesklý kov, který se využívá při výrobě lehkých a pevných slitin. Je
              také vhodným redukčním činidlem v organické syntéze a při pyrotechnických aplikacích.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Použít pouze nezbytně nutné množství kovového hořčíku. Hořčíkovou pásku uchopovat kovovými kleštěmi,
              kovový hořčík v podobě kousků nabírat laboratorní lžící.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Přívodní hadice k plynovému kahanu musí být neporušená a musí být z jednoho kusu maximální délky 1,5 m.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Produkty hoření hořčíku po vychladnutí uložíme do uzavřené odpadní nádoby s příslušným bezpečnostním
              označením a necháme zlikvidovat specializovanou firmou.
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <div className="exp-ux-prose">
              <p>
                Při práci s plynovým kahanem dbát zvýšené opatrnosti – riziko popálení. Postup zapalování plynového
                kahanu: uzavřít přívod vzduchu do kahanu; uzavřít šroub přívodu plynu na kahanu; otevřít přívod plynu na
                pracovní místo; otevřít šroub přívodu plynu na kahanu; chvíli vyčkat, až plyn vytlačí vzduch z hadice
                kahanu; zapálený konec tyčkového zapalovače přiložit z boku k ústí kahanu; pomocí přívodu vzduchu
                seřídit požadovanou velikost a intenzitu plamene. Postup zhasnutí plamene: uzavřít přívod vzduchu na
                kahanu; uzavřít šroub přívodu plynu na kahanu; uzavřít přívod plynu na pracovní místo.
              </p>
            </div>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>Po celou dobu laboratorní práce je zakázáno vzdalovat se z pracovního místa nebo se věnovat jiné činnosti, která by mohla odvádět pozornost.</li>
              <li>Zamezit styku hořčíku s vodou (včetně hašení požáru) – dochází k uvolňování hořlavých plynů.</li>
              <li>V blízkosti zapáleného hořáku kahanu se nesmí vyskytovat hořlavé předměty. Hořící kahan nesmí být ponechán bez dozoru.</li>
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
