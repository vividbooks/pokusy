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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/12_Priprava-a-vlastnosti-oxidu-uhliciteho.pdf";
const YT_VIDEO_ID = "G4wVD4fuVZ0";

const ghsThumbs: string[] = [
  `${U}/2021/06/Drazdive-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
  `${U}/2021/06/Horlave-150x150.png`,
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
  { label: "Míra rizika", value: "Významné (!!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Popálení / poleptání / otrava / mechanické poranění",
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
    name: "Uhličitan vápenatý",
    formula: <>CaCO<sub>3</sub></>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Uhlicitan-vapenaty.pdf",
  },
  {
    name: "Oxid vápenatý",
    formula: <>CaO</>,
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/09/Oxid_vapenaty_new.pdf",
  },
  {
    name: "Kyselina chlorovodíková 35 %",
    formula: <>HCl</>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`, `${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky", "- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyselina-chlorovodikova-35.pdf",
  },
  {
    name: "Oxid uhličitý",
    formula: <>CO<sub>2</sub></>,
    hazards: [],
    hazardText: ["- Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-uhlicity.pdf",
  },
  {
    name: "Chlorid vápenatý",
    formula: <>CaCl<sub>2</sub></>,
    hazards: [`${U}/2021/06/Drazdive-150x150.png`],
    hazardText: ["- Dráždivé nebo s narkotickými účinky"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Chlorid-vapenaty.pdf",
  },
  {
    name: "Voda",
    formula: (
      <>
        H<sub>2</sub>O
      </>
    ),
    hazards: [],
    hazardText: ["- Žádné nebezpečné vlastnosti"],
    sds: "",
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

export default function PripravaAVlastnostiOxiduUhliciteho() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Příprava a vlastnosti oxidu uhličitého";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Příprava a vlastnosti oxidu uhličitého";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Příprava a vlastnosti oxidu uhličitého</ExperimentPageTitle>

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
              <dd>Oxidy, peroxidy</dd>
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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Příprava a vlastnosti oxidu uhličitého" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl items={["- Laboratoř", "- Stabilní pracovní stůl", "- Nehořlavá podložka"]} />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Kippův přístroj",
                "- 2 promývací baňky (250 ml)",
                "- Varná baňka s rovným dnem (1000 ml)",
                "- Skleněná trubička ohnutá do pravého úhlu",
                "- Kahan",
                "- Zapalovač",
                "- Špejle",
                "- Spojovací hadičky",
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
                "- Inertní posypový materiál (písek, bentonit nebo vermikulit)",
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> 5% roztok kyseliny chlorovodíkové, roztok lakmusu,
            uhličitan vápenatý, vápenná voda
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Kippův přístroj a zapojení promývacích baňek</span>
                <p>
                  Do střední části Kippova přístroje vložíme kusový uhličitan vápenatý a do horní části nalijeme tolik
                  roztoku kyseliny chlorovodíkové, až je uhličitan zaplaven. Uzavřeme kohoutek. Vyvíjející se plyn
                  vytlačí roztok kyseliny do horní části přístroje, a tím se reaktanty oddělí a reakce přestane probíhat. K
                  vývodu přístroje hadičkou připojíme promývací baňku s roztokem lakmusu a k ní další promývací baňku s
                  vápennou vodou (kapaliny v baňkách v takovém množství, že hladina dosahuje 2 až 3 cm nad konec vnitřní
                  trubičky). K druhé promývací baňce připojíme trubičku ohnutou do pravého úhlu. Trubička volným koncem
                  zasahuje ke dnu varné baňky.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Ověření přítomnosti CO₂ a průběh reakce</span>
                <p>
                  Nejdříve ověříme, že hořící špejle po zasunutí do baňky na konci aparatury hoří i v baňce. Pozvolna
                  otevíráme kohoutek Kippova přístroje a kyselina chlorovodíková zaplaví uhličitan vápenatý. Dochází k
                  vývoji plynu, který probublává roztoky v baňkách. Fialová barva roztoku lakmusu se mění na červenou. Z
                  roztoku vápenné vody se vylučuje bílá sraženina uhličitanu vápenatého. Do baňky na konci aparatury opět
                  zasuneme hořící špejli a plamen zhasne.
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
              <p>Reakcí kyseliny chlorovodíkové s uhličitanem vápenatým vzniká plynný oxid uhličitý, roztok chloridu vápenatého a voda (vyvážená rovnice):</p>
              <p className="exp-ux-eq">
                2 HCl + CaCO<sub>3</sub> → CaCl<sub>2</sub> + H<sub>2</sub>O + CO<sub>2</sub>
              </p>
              <p>
                Zčervenání roztoku lakmusu dokazuje vznik kyseliny. Reakcí oxidu uhličitého s vodou vzniká kyselina
                uhličitá. Oxid uhličitý reaguje s roztokem hydroxidu vápenatého (vápenná voda) za vzniku bílé sraženiny
                uhličitanu vápenatého a vody. Tato reakce se používá k důkazu oxidu uhličitého. Oxid uhličitý má větší
                hustotu než vzduch, proto ode dna naplňuje baňku, vytlačuje vzduch, až je nádoba oxidem uhličitým zcela
                naplněna.
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Nejdříve ověříme, že hořící špejle po zasunutí do baňky na konci aparatury hoří i v baňce. Po otevření
              kohoutku dochází k vývoji plynu; lakmus se barví červeně, ve vápenné vodě vzniká bílá sraženina. Hořící
              špejle v naplněné baňce zhasne.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Oxid uhličitý hasí plamen. Pro své hasicí účinky se používá jako náplň do sněhových hasicích přístrojů.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství jednotlivých látek.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Použitou aparaturu je nutné sestavit pouze z kompatibilních částí. Při sestavování aparatur, zejména
              nasouvání hadiček na skleněné trubičky, nebo při zasouvání skleněných trubiček do pryžových zátek je nutné
              pracovat zvlášť opatrně – hrozí prasknutí a pořezání. Skleněné trubičky nutno uchopovat přes hadřík a spoje
              nejprve lehce natřít tukem. Před zahájením chemického pokusu zkontrolovat sestavenou aparaturu. Zvláštní
              pozornost je nutné věnovat prasklinám a rýhám ve skle.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Roztoky z promývacích lahví po naředění vodou vylijeme do výlevky. Nezreagovaný uhličitan vápenatý po
              opláchnutí a oschnutí uložíme k dalšímu použití. Kyselinu chlorovodíkovou uložíme do označené lahve k dalšímu
              využití pro tento pokus.
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
              <li>Zabránit kontaktu s použitými látkami, nevdechovat výpary.</li>
              <li>
                Zamezit kontaktu kyseliny chlorovodíkové se zinkem, mědí a mosazí – vzniká vodík, který je výbušný. Zamezit
                kontaktu kyseliny chlorovodíkové s louhy – může nastat prudká reakce. Nenaklánět se nad reakční směs – z
                kyseliny chlorovodíkové se mohou odpařovat silně leptavé páry těžší jak vzduch. Zabránit kontaktu kyseliny
                chlorovodíkové s vodou – voda se nesmí dostat do kyseliny (prudká reakce).
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
