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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/9_Priprava-a-vlastnosti-chloru.pdf";
const YT_VIDEO_ID = "2EtDul2Ggpc";

const ghsThumbs: string[] = [
  `${U}/2021/06/Vysoce-toxicke-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
  `${U}/2021/06/Oxidujici-150x150.png`,
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
  { label: "Čas", value: "15 min", tone: "time" },
  { label: "Míra rizika", value: "Velmi vysoké (!!!)", tone: "risk" },
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
    name: "Brom",
    formula: (
      <>
        Br<sub>2</sub>
      </>
    ),
    hazards: [
      `${U}/2021/06/Vysoce-toxicke-150x150.png`,
      `${U}/2021/06/Zirave-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: ["- Vysoce toxické", "- Žíravé a korozivní", "- Nebezpečné pro vodní prostředí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Brom.pdf",
  },
  {
    name: "Chlor",
    formula: (
      <>
        Cl<sub>2</sub>
      </>
    ),
    hazards: [
      `${U}/2021/06/Vysoce-toxicke-150x150.png`,
      `${U}/2021/06/Zirave-150x150.png`,
      `${U}/2021/06/Oxidujici-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: ["- Vysoce toxické", "- Žíravé a korozivní", "- Oxidující", "- Nebezpečné pro životní prostředí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Chlor-plyn.pdf",
  },
  {
    name: "Kyselina chlorovodíková 35 %",
    formula: <>HCl</>,
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyselina-chlorovodikova-35.pdf",
  },
  {
    name: "Jod",
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
  {
    name: "Bromid draselný",
    formula: <>KBr</>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Bromid-draselny.pdf",
  },
  {
    name: "Chlorid draselný",
    formula: <>KCl</>,
    hazards: [],
    hazardText: ["- Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Chlorid-draselny.pdf",
  },
  {
    name: "Chlornan draselný",
    formula: <>KClO</>,
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
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Chlornan-draselny.pdf",
  },
  {
    name: "Jodid draselný",
    formula: <>KI</>,
    hazards: [`${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`],
    hazardText: ["- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Jodid-draselny.pdf",
  },
  {
    name: "Manganistan draselný",
    formula: (
      <>
        KMnO<sub>4</sub>
      </>
    ),
    hazards: [
      `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
      `${U}/2021/06/Drazdive-150x150.png`,
      `${U}/2021/06/Zirave-150x150.png`,
      `${U}/2021/06/Oxidujici-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí",
      "- Dráždivé nebo s narkotickými účinky",
      "- Žíravé a korozivní",
      "- Oxidující",
      "- Nebezpečné pro životní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Manganistan-draselny.pdf",
  },
  {
    name: "Hydroxid draselný",
    formula: <>KOH</>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`, `${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky", "- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Hydroxid-draselny.pdf",
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

export default function PripravaAVlastnostiChloru() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Příprava a vlastnosti chloru";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Příprava a vlastnosti chloru";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Příprava a vlastnosti chloru</ExperimentPageTitle>

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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Příprava a vlastnosti chloru" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl items={["- Laboratoř", "- Stabilní pracovní stůl", "- Digestoř"]} />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Skleněná baňka",
                "- Dělící nálevka",
                "- 3 promývačky",
                "- Krátké hadičky k propojení skleněných částí aparatury",
                "- Skleněná trubička tvaru L",
                "- Malá nálevka",
                "- Skleněný válec",
                "- Barevný květ rostliny",
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
                "- Maska s filtrem proti částicím, parám a plynům s vhodnou lícnicovou částí",
              ]}
            />
          </Accordion>
          <Accordion title="Havarijní a sanační prostředky">
            <BulletUl
              items={[
                "- Lékárnička",
                "- Miska nebo kbelík s vodou",
                "- Inertní posypový materiál (písek, bentonit nebo vermikulit)",
                "- Hadr a úklidové prostředky",
                "- Neutralizační roztok",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> kyselina chlorovodíková, manganistan draselný,
            bromid draselný, jodid draselný
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Vývoj chloru v baňce</span>
                <p>
                  Z dělící nálevky přikapáváme kyselinu chlorovodíkovou na manganistan draselný ve skleněné baňce. Vzniká
                  plynný žlutozelený chlor, který zcela zaplní baňku a dále proniká do všech promývaček.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Projevy v promývačkách</span>
                <p>
                  V první promývačce odbarvujeme květ rostliny, ve druhé chlor reaguje s vodným roztokem bromidu
                  draselného za vzniku červenohnědých par bromu a ve třetí s vodným roztokem jodidu draselného za vzniku
                  pevného černofialového jódu.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Zachycení chloru</span>
                <p>Nezreagovaný chlor se jímá do skleněného válce s roztokem hydroxidu draselného.</p>
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
              <p>Chlor se připravuje oxidací kyseliny chlorovodíkové manganistanem draselným:</p>
              <p className="exp-ux-eq">
                16 HCl + 2 KMnO<sub>4</sub> → 5 Cl<sub>2</sub> + 2 MnCl<sub>2</sub> + 2 KCl + 8 H<sub>2</sub>O
              </p>
              <p>Vzniklý chlor reaguje s jodidem draselným za vzniku jódu:</p>
              <p className="exp-ux-eq">
                Cl<sub>2</sub> + 2 KI → I<sub>2</sub> + 2 KCl
              </p>
              <p>a s bromidem draselným za vzniku bromu:</p>
              <p className="exp-ux-eq">
                Cl<sub>2</sub> + 2 KBr → Br<sub>2</sub> + 2 KCl
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Po přikápnutí HCl na pevný manganistan draselný dochází k uvolňování žlutozelených par chloru. V
              promývačkách s KBr a KI dochází ke změně zbarvení a k uvolňování červenohnědých par bromu a pevného
              červenofialového jódu.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Chlor je velmi reaktivní plynná látka, která ochotně reaguje s dalšími látkami. Je toxický a proto je třeba
              při práci s plynným chlorem dodržovat přísná bezpečnostní opatření. Je znám i jako první použitá chemická
              bojová látka (1915). Používá se k dezinfekci pitné vody, protože i v malých koncentracích hubí bakterie a
              jeho nadbytek lze z vody snadno odstranit probubláním vzduchem. Uplatnění má také v papírenském a textilním
              průmyslu, kde se používá k bělení surovin.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použitou aparaturu je nutné sestavit pouze z kompatibilních
              částí. Při sestavování aparatur, zejména nasouvání hadiček na skleněné trubičky, nebo při zasouvání skleněných
              trubiček do pryžových zátek je nutné pracovat zvlášť opatrně – hrozí prasknutí a pořezání. Skleněné trubičky
              nutno uchopovat přes hadřík a spoje nejprve lehce natřít tukem. Použít pouze nezbytně nutné množství HCl a
              KMnO<sub>4</sub>. Lahev obsahující kyselinu chlorovodíkovou se musí přemísťovat uzavřená. Při odlévání nebo
              přelévání kyseliny chlorovodíkové musí být nádoby umístěny tak, aby nedošlo k jejich převrhnutí nebo rozbití.
              Rozlitou kyselinu je nutné ihned spláchnout vodou, popřípadě neutralizovat práškovou sodou a opět spláchnout
              vodou. Při manipulaci s kyselinou chlorovodíkovou nevdechovat výpary HCl. Rozsypaný hydroxid draselný nutno
              sesbírat pomocí smetáku a lopatky – nikdy nebrat KOH do rukou. Pracovat výlučně v digestoři – vznikající
              chlor je toxický plyn se žíravými vlastnostmi, vznikající brom je také toxický. Pro eliminaci úniku chloru je
              nezbytné na konec aparatury zařadit nádobu s neutralizačním roztokem hydroxidu draselného. Zajistit řádné
              větrání laboratoře.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">Opatrné sestavení těsnící aparatury a opatrná manipulace s kohoutem dělící nálevky.</p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Po ukončení pokusu otevřeme promývačky a v uzavřené digestoři necháme odsát plynné látky. Vzniklé roztoky
              látek v promývačkách a ve válci uložíme do uzavřených odpadních nádob s příslušným bezpečnostním označením a
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
              <li>Nepoužívat poškozené laboratorní sklo nebo nekompatibilní části.</li>
              <li>
                Zamezit kontaktu kyseliny chlorovodíkové se zinkem, mědí a mosazí – vzniká vodík, který je výbušný. Zamezit
                kontaktu kyseliny chlorovodíkové s louhy – může nastat prudká reakce. Zabránit kontaktu kyseliny
                chlorovodíkové s vodou – voda se nesmí dostat do kyseliny (prudká reakce). Zabránit kontaktu kůže a očí s
                žíravými látkami (HCl, KOH).
              </li>
              <li>Zamezit průniku manganistanu draselného do životního prostředí (nesmí se dostat do kanalizace).</li>
              <li>
                S bromidem draselným manipulovat tak, aby nemohlo dojít k jeho tepelnému rozkladu – může vznikat toxický
                bromovodík.
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
