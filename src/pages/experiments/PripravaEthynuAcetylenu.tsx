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
  "https://ebedox.cz/wp-content/uploads/2022/09/3_Priprava-ethynu-acetylenu-1.pdf";
const YT_VIDEO_ID = "Eb3gcNaGZFo";

const ghsThumbs: string[] = [
  `${U}/2021/06/Horlave-150x150.png`,
  `${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
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
  /** Bez odkazu na BSL (např. voda). */
  sds?: string;
};

const CHEMICALS: Chem[] = [
  {
    name: "Fenolftalein",
    formula: (
      <>
        C<sub>20</sub>H<sub>14</sub>O<sub>4</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Karcinogenni-poskozujici-dychaci-cesty-150x150.png`],
    hazardText: [
      "- Karcinogenní, mutagenní, toxické pro reprodukci nebo nebezpečné při vdechnutí",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/fenolftalein.pdf",
  },
  {
    name: "Ethyn",
    formula: (
      <>
        C<sub>2</sub>H<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé nebo samozápalné", "- Výbušné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Ethyn.pdf",
  },
  {
    name: "Hydroxid vápenatý",
    formula: (
      <>
        Ca(OH)<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Hydroxid-vapenaty.pdf",
  },
  {
    name: "Karbid vápenatý",
    formula: (
      <>
        CaC<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/karbid-vabniku.pdf",
  },
  {
    name: "Voda",
    formula: (
      <>
        H<sub>2</sub>O
      </>
    ),
    hazards: [],
    hazardText: ["Žádné nebezpečné vlastnosti"],
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

export default function PripravaEthynuAcetylenu() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Příprava ethynu (acetylenu)";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Příprava ethynu (acetylenu)";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Příprava ethynu (acetylenu)</ExperimentPageTitle>

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
              <dd>Žáci 9. ročníku, žáci středních škol, žáci gymnázií, účastníci zájmových kroužků</dd>
              <dt>Tematické celky</dt>
              <dd>Uhlovodíky a deriváty uhlovodíků</dd>
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
              title="Instruktážní video — Příprava ethynu (acetylenu)"
            />
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
                "- Pracovní tác s vyvýšeným okrajem",
              ]}
            />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Skleněná baňka se širokým hrdlem",
                "- Laboratorní kleště",
                "- Laboratorní zapalovač (nebo špejle a zápalky)",
              ]}
            />
          </Accordion>
          <Accordion title="Ochranné pomůcky">
            <BulletUl
              items={[
                "- Pracovní obuv chránící před chemickými látkami",
                "- Ochranný oděv (plášť / zástěra na ochranu před ch. l.)",
                "- Obličejový štít",
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
            <strong>Použité chemikálie a další prostředky:</strong> karbid vápenatý, voda, fenolftalein
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Příprava baňky s vodou a indikátorem</span>
                <p>
                  Do baňky na bílé podložce nalijeme asi do čtvrtiny jejího objemu vodu a přidáme několik kapek roztoku
                  fenolftaleinu.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Příprava karbidu</span>
                <p>
                  Na misku připravíme jeden až dva kousky karbidu vápenatého o velikosti fazole.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Vložení karbidu a průběh reakce</span>
                <p>
                  Chemickými kleštěmi uchopíme kousek karbidu a vložíme ho do baňky s vodou a roztokem fenolftaleinu.
                  Probíhá prudká reakce za vývoje plynu; roztok se zbarvuje červeně (hydroxid vápenatý).
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Zapálení ethynu</span>
                <p>
                  K ústí baňky přiložíme hořící špejli. S malým výbuchem se plyny u ústí baňky vznítí a hoří čadivým
                  plamenem. Na vnitřní stěně hrdla baňky se usazují saze.
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
              <p>Ethyn lze připravit reakcí karbidu vápenatého s vodou:</p>
              <p className="exp-ux-eq">
                CaC<sub>2</sub> + 2 H<sub>2</sub>O → C<sub>2</sub>H<sub>2</sub> + Ca(OH)<sub>2</sub>
              </p>
              <p>
                Červené zbarvení roztoku indikátoru dokazuje vznik hydroxidu vápenatého. Ethyn tvoří ve směsi se vzduchem
                výbušnou směs. Při hoření se vzdušným kyslíkem vzniká uhlík (saze).
              </p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Uvolňující se bublinky ethynu z reakční směsi, červené zabarvení směsi v baňce, svítivý plamen a výbuch po
              zapálení vznikajícího plynu u ústí baňky, černé saze na stěnách baňky.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Ethyn na vzduchu volně hoří žlutým plamenem. V případě, že dojde k iniciaci ethynu uvnitř uzavřeného
              prostoru, dochází k detonaci – dojde k mžikovému vyhoření ethynu ve směsi se vzduchem a vzniku zplodin
              hoření, které mají větší objem než původní směs. Ethyn se díky vysoké teplotě plamene používá k autogennímu
              kyslíko-acetylenovému sváření a řezání kovů. Pokud hoření acetylenu za použití směšovací trysky probíhá při
              stechiometrickém poměru s kyslíkem, má plamen bílou až namodralou barvu a také nejvyšší dosažitelnou teplotu
              (až 3100 °C). Toho se využívá pro svařování ocelí. Při hoření acetylenu s nadbytkem kyslíku má plamen
              schopnost propalovat svařovaný materiál (oxidační plamen určený pro řezání). Pokud je při hoření přebytek
              acetylenu vůči kyslíku, vzniká redukční plamen, který se používá pro svařování litin a hliníku. Svítivost
              plamene hořícího ethynu se využívala v přenosných lampách – karbidkách (např. havíři, jeskyňáři).
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství karbidu vápníku a pouze
              v podobě malých kousků. Karbid vápníku uchopovat kovovými kleštěmi.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Karbid vápníku je na vzduchu samozápalný (díky reakci se vzdušnou vlhkostí), takže je nutné po odebrání
              potřebného množství karbidu zásobní lahev ihned řádně uzavřít. Místo laboratorního zapalovače je možné k
              zapálení acetylenu použít dlouhou hořící špejli.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Zbylou kapalinu je možné zředěnou vylít do výlevky. Nezreagovaný karbid vápníku je možné po dokonalém
              oschnutí uložit k dalšímu využití.
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <p className="exp-ux-prose">
              Při reakci vzniká výbušný plyn – ethyn. Při práci s ním je nutné pracovat v digestoři. Aby nemohlo dojít k
              velkému výbuchu s následným požárem, je nutné pro reakci použít pouze malé množství karbidu vápníku.
            </p>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>Karbid vápníku nebrat holou rukou.</li>
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
