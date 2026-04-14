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
  "https://ebedox.cz/wp-content/uploads/2022/09/1_Priprava-a-vlastnosti-sulfanu-1.pdf";
const YT_VIDEO_ID = "v222qG7XWdM";

const ghsThumbs: string[] = [
  `${U}/2021/06/Vysoce-toxicke-150x150.png`,
  `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
  `${U}/2021/06/Drazdive-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
  `${U}/2021/06/Horlave-150x150.png`,
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

const SULFAN_QUICK_FACTS: QuickFact[] = [
  { label: "Čas", value: "10 min", tone: "time" },
  { label: "Míra rizika", value: "Významné (!!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační, prezentační", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Poleptání, otrava (inhalace / požití), mechanické poranění",
    tone: "hazard",
  },
];

type Chem = {
  name: string;
  formula: ReactNode;
  hazards: string[];
  hazardText: string[];
  sds: string;
  wide?: boolean;
};

const CHEMICALS: Chem[] = [
  {
    name: "Bromid kademnatý",
    formula: (
      <>
        CdBr<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Bromid-kademnaty_EN.pdf",
  },
  {
    name: "Sulfid kademnatý",
    formula: <>CdS</>,
    hazards: [
      `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí",
      "- Nebezpečné pro životní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Sulfid-kademnaty.pdf",
  },
  {
    name: "Sulfid měďnatý",
    formula: <>CuS</>,
    hazards: [],
    hazardText: ["- Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Sulfid-mednaty.pdf",
  },
  {
    name: "Síran měďnatý",
    formula: (
      <>
        CuSO<sub>4</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`],
    hazardText: ["- Nebezpečné pro životní prostředí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Siran-mednaty.pdf",
  },
  {
    name: "Sulfid železnatý",
    formula: <>FeS</>,
    hazards: [`${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`],
    hazardText: ["- Nebezpečné pro životní prostředí"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Sulfid-zeleznaty.pdf",
  },
  {
    name: "Sirovodík",
    formula: (
      <>
        H<sub>2</sub>S
      </>
    ),
    hazards: [
      `${U}/2021/06/Vysoce-toxicke-150x150.png`,
      `${U}/2021/06/Horlave-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Vysoce toxické",
      "- Hořlavé a samozápalné",
      "- Nebezpečné pro vodní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Sirovodik.pdf",
  },
  {
    name: "Kyselina chlorovodíková 35 %",
    formula: <>HCl</>,
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyselina-chlorovodikova-35.pdf",
  },
  {
    name: "Hydroxid draselný",
    formula: <>KOH</>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`, `${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky", "- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Hydroxid-draselny.pdf",
  },
  {
    name: "Sulfid olovnatý",
    formula: <>PbS</>,
    hazards: [
      `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpeční při vdechnutí",
      "- Nebezpečné pro životní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Sulfid-olovnaty.pdf",
  },
  {
    name: "Síran olovnatý",
    formula: (
      <>
        PbSO<sub>4</sub>
      </>
    ),
    hazards: [
      `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
      `${U}/2021/06/Nebezpecne-pro-zivotni-prostredi-150x150.png`,
    ],
    hazardText: [
      "- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí",
      "- Nebezpečné pro vodní prostředí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Siran-olovnaty.pdf",
    wide: true,
  },
];

function ChemCard({ name, formula, hazards, hazardText, sds, wide }: Chem) {
  return (
    <article className={`exp-ux-chem${wide ? " exp-ux-chem--wide" : ""}`}>
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

export default function PripravaVlastnostiSulfanu() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Příprava a vlastnosti sulfanu";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Příprava a vlastnosti sulfanu";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Příprava a vlastnosti sulfanu</ExperimentPageTitle>

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

        <ExperimentQuickFactsInfographic facts={SULFAN_QUICK_FACTS} pdfHref={PDF} />
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
            <dd>Chemické prvky, chemické reakce, kyseliny a hydroxidy, soli</dd>
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
            title="Instruktážní video — Příprava a vlastnosti sulfanu"
          />
        </div>
      </section>

      <section id="vybaveni" className="exp-ux__section">
        <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

        <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
        <Accordion title="Požadavky na pracovní místo" defaultOpen>
          <BulletUl items={["- Laboratoř", "- Stabilní pracovní stůl", "- Digestoř", "- Pracovní tác s vyvýšeným okrajem"]} />
        </Accordion>
        <Accordion title="Laboratorní pomůcky a přístroje">
          <BulletUl
            items={[
              "- Kippův přístroj",
              "- 3 promývačky",
              "- 5 krátkých hadiček",
              "- skleněná nálevka",
              "- skleněná trubička ohnutá do pravého úhlu",
              "- skleněný válec",
            ]}
          />
        </Accordion>
        <Accordion title="Ochranné pomůcky">
          <BulletUl
            items={[
              "- Pracovní obuv chránící před chemickými látkami",
              "- Ochranný oděv (plášť / zástěra na ochranu před ch. l.)",
              "- Ochranné brýle",
              "- Rukavice latexové (vrstva 0,6 mm)",
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
          <strong>Použité chemikálie a další prostředky:</strong> sulfid železnatý, kyselina chlorovodíková (1 : 1),
          bromid kademnatý, síran měďnatý, dusičnan olovnatý, hydroxid draselný
        </p>

        <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
        <div className="exp-ux-procedure">
          <p className="exp-ux-procedure__label">Pracovní postup</p>
          <ol className="exp-ux-procedure__steps">
            <li className="exp-ux-procedure__step">
              <span className="exp-ux-procedure__step-title">Příprava Kippova přístroje</span>
              <p>
                Do střední části Kippova přístroje vložíme kousky sulfidu železnatého. Do jeho horní části nalijeme tolik
                roztoku kyseliny chlorovodíkové, až je ve střední části sulfid zaplaven a uzavřeme kohoutek. Při uzavření
                kohoutku vznikající plyn vytlačí kyselinu do horní nádoby a reakce přestane probíhat.
              </p>
            </li>
            <li className="exp-ux-procedure__step">
              <span className="exp-ux-procedure__step-title">Promývací baňky a roztoky solí</span>
              <p>
                Připravíme tři promývací baňky. Do první dáme roztok olovnaté soli, do druhé roztok měďnaté soli a do
                třetí roztok kademnaté soli. Roztoků dáme vždy takové množství, aby po uzavření baňky byl konec vnitřní
                trubičky ponořen asi 1 cm pod hladinu kapaliny.
              </p>
            </li>
            <li className="exp-ux-procedure__step">
              <span className="exp-ux-procedure__step-title">Zapojení baněk do soustavy</span>
              <p>
                První baňku hadičkou připojíme ke Kippově přístroji a za ní připojíme další dvě baňky.
              </p>
            </li>
            <li className="exp-ux-procedure__step">
              <span className="exp-ux-procedure__step-title">Zakončení aparatury a absorpce</span>
              <p>
                Na poslední baňku připojíme hadičkou trubičku ohnutou do pravého úhlu, na vnější konec trubičky připojíme
                stopku malé nálevky. Pod nálevku zasuneme laboratorní válec (nálevka by měla svým ústím zasahovat asi 4 cm
                nad dno válce). Do válce nalijeme tolik roztoku hydroxidu draselného, aby jeho hladina zasahovala 3 až 4 mm
                nad ústí nálevky.
              </p>
            </li>
            <li className="exp-ux-procedure__step">
              <span className="exp-ux-procedure__step-title">Průběh reakce a pozorování</span>
              <p>
                Pozvolna otevřeme kohoutek Kippova přístroje. Kyselina zaplaví sulfid v jeho střední části a začne probíhat
                reakce za vývoje plynu. Plyn prochází aparaturou. V první promývačce se tvoří černá sraženina, ve druhé
                také černá sraženina a ve třetí vzniká sraženina žlutá. Přebytečný plyn je pohlcován v roztoku hydroxidu na
                konci aparatury.
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
            <ChemCard key={c.name + String(c.wide)} {...c} />
          ))}
        </div>
      </section>

      <section id="didaktika" className="exp-ux__section">
        <h2 className="exp-ux__section-title">Didaktická část</h2>
        <Accordion title="Vysvětlení podstaty pokusu" defaultOpen>
          <div className="exp-ux-prose">
            <p>Sulfan se připravuje reakcí sulfidu železnatého s kyselinou chlorovodíkovou:</p>
            <p className="exp-ux-eq">
              FeS + 2 HCl → H<sub>2</sub>S + FeCl<sub>2</sub>
            </p>
            <p>
              Sulfan reaguje s roztokem olovnaté soli za vzniku černé sraženiny sulfidu olovnatého, s roztokem měďnaté
              soli za vzniku černé sraženiny sulfidu měďnatého a s roztokem kademnaté soli vzniká žlutá sraženina
              sulfidu kademnatého. S roztokem hydroxidu draselného reaguje sulfan za vzniku sulfidu draselného a vody.
            </p>
          </div>
        </Accordion>
        <Accordion title="Ověření správného provedení (výsledku)">
          <p className="exp-ux-prose">
            V promývačkách s vodnými roztoky solí dochází ke změně zbarvení, které identifikuje vznikající soli kyseliny
            sulfanové – sulfidy. I přes uzavřenou aparaturu je cítit zápach vznikajícího sulfanu.
          </p>
        </Accordion>
        <Accordion title="Praktické souvislosti pokusu">
          <p className="exp-ux-prose">
            Sulfan je toxický plyn, patří mezi tzv. „krevní jedy“. Je bezbarvý, při nízkých koncentracích zapáchá po
            zkažených vejcích.
          </p>
        </Accordion>
      </section>

      <section id="bezpecnost" className="exp-ux__section">
        <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
        <Accordion title="Práce s použitými látkami" defaultOpen>
          <p className="exp-ux-prose">
            Lahev obsahující kyselinu chlorovodíkovou se musí přemísťovat uzavřená. Při odlévání nebo přelévání kyseliny
            chlorovodíkové musí být nádoby umístěny tak, aby nedošlo k jejich převrhnutí nebo rozbití. Veškeré operace s
            chemikáliemi provádět za použití ochranných pracovních prostředků pro ochranu očí, obličeje a rukou.
          </p>
        </Accordion>
        <Accordion title="Použití laboratorních pomůcek a přístrojů">
          <p className="exp-ux-prose">
            Dodržovat na pracovním místě čistotu a pořádek. Použitou aparaturu je nutné sestavit pouze z kompatibilních
            částí. Při sestavování aparatur, zejména nasouvání hadiček na skleněné trubičky, nebo při zasouvání skleněných
            trubiček do pryžových zátek je nutné pracovat zvlášť opatrně – hrozí prasknutí a pořezání. Skleněné trubičky
            nutno uchopovat přes hadřík a spoje nejprve lehce natřít tukem. Před zahájením chemického pokusu zkontrolovat
            sestavenou aparaturu. Zvláštní pozornost je nutné věnovat prasklinám a rýhám ve skle.
          </p>
        </Accordion>
        <Accordion title="Likvidace odpadů">
          <p className="exp-ux-prose">
            Zbytek kapalných látek v Kippově přístroji můžeme zlikvidovat vylitím do výlevky po dostatečném zředění
            vodou. Nezreagovaný sulfid železnatý můžeme po oschnutí využít při dalších pokusech. Roztoky vzniklých sulfidů
            v promývačkách uložíme do uzavřených odpadních lahví s příslušným bezpečnostním označením a necháme
            zlikvidovat specializovanou firmou.
          </p>
        </Accordion>
        <Accordion title="Práce s hořlavinami a plyny">
          <p className="exp-ux-prose">Při tomto pokusu se nepoužívají hořlaviny ani technické plyny.</p>
        </Accordion>

        <div className="exp-ux-warn">
          <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
          <ul className="exp-ux-warn__list">
            <li>Nepoužívat poškozené laboratorní sklo nebo nekompatibilní části.</li>
            <li>
              Po celou dobu laboratorní práce je zakázáno vzdalovat se z pracovního místa nebo se věnovat jiné činnosti,
              která by mohla odvádět pozornost.
            </li>
            <li>
              Zamezit kontaktu kyseliny chlorovodíkové se zinkem, mědí a mosazí – vzniká vodík, který je výbušný.
            </li>
            <li>Zamezit kontaktu kyseliny chlorovodíkové s louhy – může nastat prudká reakce.</li>
            <li>
              Nenaklánět se nad reakční směs – z kyseliny chlorovodíkové se mohou odpařovat silně leptavé páry těžší jak
              vzduch.
            </li>
            <li>
              Zabránit kontaktu kyseliny chlorovodíkové s vodou – voda se nesmí dostat do kyseliny (prudká reakce).
            </li>
            <li>
              Je zakázáno provádět tento pokus alternativním způsobem nebo za použití jiného pomůckového vybavení, než jak
              je uvedeno v tomto metodickém listě.
            </li>
          </ul>
        </div>
      </section>
      </div>
    </div>
  );
}
