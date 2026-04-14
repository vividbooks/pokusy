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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/11_Priprava-jodu.pdf";
const YT_VIDEO_ID = "WlBVrV72RlQ";

const ghsThumbs: string[] = [
  `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
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
  { label: "Čas", value: "5 min", tone: "time" },
  { label: "Míra rizika", value: "Zvýšené (!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Poleptání / otrava / mechanické poranění",
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
    name: "Kyselina sírová 96 %",
    formula: (
      <>
        H<sub>2</sub>SO<sub>4</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyselina-sirova-96.pdf",
  },
  {
    name: "Jodid draselný",
    formula: <>KI</>,
    hazards: [`${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`],
    hazardText: ["- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Jodid-draselny.pdf",
  },
  {
    name: "Oxid manganičitý",
    formula: <>MnO<sub>2</sub></>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-manganicity.pdf",
  },
  {
    name: "Hydrogenuhličitan sodný",
    formula: <>NaHCO<sub>3</sub></>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/hydrogenuhlicitan-sodny.pdf",
  },
  {
    name: "Jód",
    formula: (
      <>
        I<sub>2</sub>
      </>
    ),
    hazards: [
      `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
      `${U}/2021/06/Drazdive-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí",
      "- Dráždivé nebo s narkotickými účinky",
      "- Nebezpečné pro životní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Jod.pdf",
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

export default function PripravaJodu() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Příprava jodu";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Příprava jodu";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Příprava jodu</ExperimentPageTitle>

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
              <dd>Žáci 8. ročníku, žáci středních škol, žáci gymnázií</dd>
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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Příprava jodu" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl items={["- Laboratoř", "- Stabilní pracovní stůl", "- Digestoř"]} />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl items={["- Skleněná baňka", "- Vata namočená v roztoku hydrogenuhličitanu sodného nebo uhličitanu sodného"]} />
          </Accordion>
          <Accordion title="Ochranné pomůcky">
            <BulletUl
              items={[
                "- Pracovní obuv chránící před chemickými látkami",
                "- Ochranný oděv (plášť / zástěra na ochranu před ch. l.)",
                "- Ochranné brýle",
                "- Rukavice z nitrilové pryže (vrstva 0,11 mm)",
                "- Rukavice z butylové pryže (vrstva 0,7 mm)",
              ]}
            />
          </Accordion>
          <Accordion title="Havarijní a sanační prostředky">
            <BulletUl
              items={[
                "- Lékárnička",
                "- Inertní posypový materiál (písek, bentonit nebo vermikulit)",
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> jodid draselný, oxid manganičitý, kyselina sírová,
            nasycený roztok uhličitanu nebo hydrogenuhličitanu sodného
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Směs v baňce a přidání kyseliny</span>
                <p>
                  Do baňky s jodidem draselným a oxidem manganičitým nalijeme malé množství koncentrované kyseliny sírové a
                  pozorujeme uvolňování temně fialových par jodu.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Uzavření baňky</span>
                <p>Baňku uzavřeme vatou namočenou v hydrogenuhličitanu sodném.</p>
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
                Jod lze připravit redoxní reakcí jodidů s oxidem manganičitým a kyselinou sírovou (rovnice pro jodid
                draselný, v souladu s praktickým postupem):
              </p>
              <p className="exp-ux-eq">
                2 KI + MnO<sub>2</sub> + 2 H<sub>2</sub>SO<sub>4</sub> → MnSO<sub>4</sub> + K<sub>2</sub>SO<sub>4</sub>{" "}
                + I<sub>2</sub> + 2 H<sub>2</sub>O
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Přilitím kyseliny sírové na směs jodidu draselného s oxidem manganičitým dochází k uvolňování temně fialových
              par jodu.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Jod je vzácný prvek, který se v přírodě vyskytuje jen ve sloučeninách. Tvoří tmavě fialové destičkovité
              krystalky. Jde o důležitý biogenní prvek, jehož přítomnost v potravě je nezbytná pro správný vývoj organismu
              a fungování štítné žlázy.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství látek. Zajistit řádné
              větrání laboratoře. Lahev obsahující kyselinu sírovou se musí přemísťovat uzavřená. Při odlévání nebo
              přelévání kyseliny sírové musí být nádoby umístěny tak, aby nedošlo k jejich převrhnutí nebo rozbití. Rozlitou
              kyselinu je nutné ihned spláchnout vodou, popřípadě neutralizovat práškovou sodou a opět spláchnout vodou.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">Standardní práce se skleněným laboratorním nádobím.</p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Zbytky a odpady obsahující jod uložíme do uzavřené odpadní nádoby s příslušným bezpečnostním označením a
              necháme zlikvidovat specializovanou firmou.
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <p className="exp-ux-prose">Při tomto pokusu se nepoužívají hořlaviny ani technické plyny.</p>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>
                Po celou dobu laboratorní práce je zakázáno vzdalovat se z pracovního místa nebo se věnovat jiné činnosti,
                která by mohla odvádět pozornost.
              </li>
              <li>Nepoužívat poškozené laboratorní sklo.</li>
              <li>
                Zamezit kontaktu použitých látek s kůží a očima. Nevdechovat výpary kyseliny sírové ani plynný jod
                vznikající při reakci.
              </li>
              <li>
                Zabránit kontaktu kyseliny sírové s vodou – voda se nesmí dostat do kyseliny (prudká reakce). Zamezit
                kontaktu kyseliny sírové s kovy – vzniká vodík (nebezpečí výbuchu). Zabránit úniku použitých látek do
                životního prostředí.
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
