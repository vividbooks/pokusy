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
const PDF =
  "https://ebedox.cz/wp-content/uploads/2022/09/2_Priprava-chloridu-amonneho-1.pdf";
const YT_VIDEO_ID = "IO2Kht-kDh0";

const ghsThumbs: string[] = [
  `${U}/2021/06/Drazdive-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
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
  { label: "Čas", value: "5 min", tone: "time" },
  { label: "Míra rizika", value: "Zvýšené (!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační, prezentační (video ukázka)", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Poleptání / potřísnění, otrava (inhalace / požití), mechanické poranění",
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
    name: "Kyselina chlorovodíková 35 %",
    formula: <>HCl</>,
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyselina-chlorovodikova-35.pdf",
  },
  {
    name: "Amoniak, vodný roztok",
    formula: (
      <>
        NH<sub>3</sub> + aq
      </>
    ),
    hazards: [
      `${U}/2021/06/Drazdive-150x150.png`,
      `${U}/2021/06/Zirave-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Dráždivé nebo s narkotickými účinky",
      "- Žíravé a korozivní",
      "- Nebezpečné pro vodní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Amoniak.pdf",
  },
  {
    name: "Chlorid amonný",
    formula: (
      <>
        NH<sub>4</sub>Cl
      </>
    ),
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Chlorid-amonny.pdf",
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

export default function PripravaChloriduAmonneho() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Příprava chloridu amonného";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Příprava chloridu amonného";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Příprava chloridu amonného</ExperimentPageTitle>

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
              <dd>Kyseliny a hydroxidy, soli</dd>
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
            <YouTubeEmbed
              videoId={YT_VIDEO_ID}
              title="Instruktážní video — Příprava chloridu amonného"
            />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl
              items={["- Laboratoř", "- Stabilní pracovní stůl", "- Digestoř", "- Pracovní tác s vyvýšeným okrajem"]}
            />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- 2 promývačky",
                "- Skleněná trubička tvaru T",
                "- 4 krátké hadičky pro spojení jednotlivých částí aparatury",
                "- 2 gumové balonky",
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
                "- Inertní posypový materiál (písek, bentonit nebo vermikulit)",
                "- Hadr a úklidové prostředky",
                "- Neutralizační roztok",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> kyselina chlorovodíková, amoniak
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Sestavení aparatury</span>
                <p>
                  Sestavíme aparaturu. Volné vývody dvou promývacích baněk hadičkami připojíme na konce rovné části
                  trubičky T tak, aby volný konec trubičky směřoval nahoru. Na vývody baněk od zaváděcích trubiček
                  připojíme pryžové dmýchací balonky.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Naplnění promývacích baněk</span>
                <p>
                  Jednu baňku naplníme asi do jedné pětiny koncentrovanou kyselinou chlorovodíkovou, druhou stejným
                  objemem koncentrovaného roztoku amoniaku.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Dmýchání a vznik chloridu amonného</span>
                <p>
                  Uchopíme každý balonek jednou rukou a zároveň dmýchneme do obou baněk vzduch. V baňkách se proudem
                  vzduchu z roztoku uvolňuje plynný chlorovodík a plynný amoniak. Na volném horním konci trubičky
                  spolu reagují za vzniku bílého dýmu (chlorid amonný).
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
              <p>Chlorid amonný ve formě bílého dýmu vzniká reakcí plynného chlorovodíku a plynného amoniaku:</p>
              <p className="exp-ux-eq">
                NH<sub>3</sub> + HCl → NH<sub>4</sub>Cl
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Při synchronizovaném vhánění vzduchu do obou kapalin v promývačkách uniká z trubičky „tepající“ proud
              bílého dýmu.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Chlorid amonný (triviálně se označuje jako salmiak) je bílá krystalická látka. Rozpouští se ve vodě za
              vzniku slabě kyselého roztoku. V přírodě se vyskytuje jako nerost salmiak, který vzniká např. v hořících
              uhelných slojích nebo sopkách kondenzací plynů vznikajících při hoření. Využívá se i v potravinářství jako
              regulátor kyselosti, v dýmovnicích, k úpravě povrchu při pájení aj.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Lahve obsahující žíravé látky se musí přemísťovat uzavřené. Při odlévání nebo přelévání používaných látek
              musí být nádoby umístěny tak, aby nedošlo k jejich převrhnutí nebo rozbití. Veškeré pracovní operace se musí
              provádět za použití ochranných pracovních prostředků pro ochranu očí, obličeje a rukou. Rozlitou kyselinu
              je nutné ihned spláchnout vodou, popřípadě neutralizovat práškovou sodou a opět spláchnout vodou. Rozlitý
              roztok amoniaku ihned spláchnout vodou. Zajistit řádné větrání laboratoře.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použitou aparaturu je nutné sestavit pouze z kompatibilních
              částí. Při sestavování aparatur, zejména nasouvání hadiček na skleněné trubičky, nebo při zasouvání
              skleněných trubiček do pryžových zátek je nutné pracovat zvlášť opatrně – hrozí prasknutí a pořezání.
              Skleněné trubičky nutno uchopovat přes hadřík a spoje nejprve lehce natřít tukem. Před zahájením chemického
              pokusu zkontrolovat sestavenou aparaturu. Zvláštní pozornost je nutné věnovat prasklinám a rýhám ve skle.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Použité látky (koncentrované vodné roztoky HCl a NH<sub>3</sub>) je možné uchovat pro další využití v
              řádně označených nádobách. Vzniklý chlorid amonný necháme v digestoři usadit a poté digestoř uklidíme.
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <p className="exp-ux-prose">Při tomto pokusu se nepoužívají hořlaviny ani technické plyny.</p>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>
                Po celou dobu laboratorní práce je zakázáno vzdalovat se z pracovního místa nebo se věnovat jiné
                činnosti, která by mohla odvádět pozornost.
              </li>
              <li>Nepoužívat poškozené laboratorní sklo nebo nekompatibilní části.</li>
              <li>Zabránit kontaktu s použitými látkami, nevdechovat výpary.</li>
              <li>
                Zamezit kontaktu kyseliny chlorovodíkové se zinkem, mědí a mosazí – vzniká vodík, který je výbušný.
              </li>
              <li>Zamezit kontaktu kyseliny chlorovodíkové s louhy – může nastat prudká reakce.</li>
              <li>
                Zabránit kontaktu kyseliny chlorovodíkové s vodou – voda se nesmí dostat do kyseliny (prudká reakce).
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
