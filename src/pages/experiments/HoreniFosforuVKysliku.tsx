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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/8_Horeni-fosforu-v-kysliku.pdf";
const YT_VIDEO_ID = "Hk_crkaM9CE";

const ghsThumbs: string[] = [
  `${U}/2021/06/Horlave-150x150.png`,
  `${U}/2021/06/Zirave-150x150.png`,
  `${U}/2021/06/Oxidujici-150x150.png`,
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
    name: "Lakmus",
    formula: (
      <>
        C<sub>28</sub>H<sub>24</sub>N<sub>2</sub>O<sub>7</sub>
      </>
    ),
    hazards: [],
    hazardText: ["Žádné nebezpečné vlastnosti"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Lakmus.pdf",
  },
  {
    name: "Kyslík",
    formula: (
      <>
        O<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Oxidujici-150x150.png`],
    hazardText: ["- Oxidující"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyslik-plynny.pdf",
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
  {
    name: "Fosfor (červený)",
    formula: <>P</>,
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/cerveny-fosfor.pdf",
  },
  {
    name: "Oxid fosforečný",
    formula: (
      <>
        P<sub>2</sub>O<sub>5</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-fosforecny.pdf",
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

export default function HoreniFosforuVKysliku() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Hoření fosforu v kyslíku";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Hoření fosforu v kyslíku";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Hoření fosforu v kyslíku</ExperimentPageTitle>

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
              <dd>Žáci 8. ročníku, žáci gymnázií</dd>
              <dt>Tematické celky</dt>
              <dd>Chemické prvky, chemické reakce, oxidy a peroxidy</dd>
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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Hoření fosforu v kyslíku" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl
              items={["- Laboratoř", "- Stabilní pracovní stůl", "- Digestoř", "- Přívod plynu"]}
            />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Skleněná baňka",
                "- Železná lžička (může být provlečena korkovým nebo gumovým uzávěrem baňky)",
                "- Laboratorní kahan",
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
                "- Miska nebo kbelík s vodou",
                "- Inertní posypový materiál (písek, bentonit nebo vermikulit)",
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> červený fosfor, kyslík, lakmus
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Příprava baňky</span>
                <p>
                  Připravíme skleněnou baňku s kyslíkem a vodou s několika kapkami lakmusu.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Zahřátí a zapálení fosforu</span>
                <p>
                  Na železné spalovací lžičce zahřejeme fosfor a necháme ho vzplanout.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Vložení do baňky a průběh reakce</span>
                <p>
                  Poté vložíme hořící fosfor do skleněné baňky s kyslíkem a vodou s lakmusem. Hořící fosfor po vložení do
                  baňky s kyslíkem hoří velmi intenzivně za vzniku oxidu fosforečného (bílé dýmy), který reaguje s vodou za
                  vzniku kyseliny fosforečné (to dokazuje změna zabarvení lakmusu).
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
              <p>Fosfor reaguje s kyslíkem za vzniku oxidu fosforečného:</p>
              <p className="exp-ux-eq">
                P<sub>4</sub> + 5 O<sub>2</sub> → 2 P<sub>2</sub>O<sub>5</sub>
              </p>
              <p>Ten reaguje s vodou za vzniku kyseliny fosforečné:</p>
              <p className="exp-ux-eq">
                P<sub>2</sub>O<sub>5</sub> + 3 H<sub>2</sub>O → 2 H<sub>3</sub>PO<sub>4</sub>
              </p>
              <p>Lakmus svým červeným zbarvením indikuje kyselé prostředí.</p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Zahřívaný fosfor vzplane a po vložení do baňky s kyslíkem dojde k velmi intenzivnímu hoření oslňujícím
              plamenem a reakci produktu hoření s vodou, identifikovaném zčervenáním lakmusu v reakční směsi.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Fosfor je nekovový chemický prvek, který hraje důležitou roli ve stavbě živých organismů. Často se vyskytuje
              také v anorganických sloučeninách v zemské kůře (např. fosfáty). Je známo velké množství jeho alotropních
              modifikací, nejznámějšími jsou bílý a červený fosfor.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství fosforu.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Přívodní hadice k hořákům musí být neporušené a musí být z jednoho kusu maximální délky 1,5 m.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Vzniklou kyselinu fosforečnou, dostatečně zředěnou vodou, můžeme vylít do výlevky.
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <div className="exp-ux-prose">
              <p>
                Fosfor je hořlavá tuhá látka. Při práci s plynovým kahanem dbát zvýšené opatrnosti – riziko popálení.
                Postup zapalování plynového kahanu: uzavřít přívod vzduchu do kahanu; uzavřít šroub přívodu plynu na kahanu;
                otevřít přívod plynu na pracovní místo; otevřít šroub přívodu plynu na kahanu; chvíli vyčkat, až plyn
                vytlačí vzduch z hadice kahanu; zapálený konec tyčkového zapalovače přiložit z boku k ústí kahanu; pomocí
                přívodu vzduchu seřídit požadovanou velikost a intenzitu plamene. Postup zhasnutí plamene: uzavřít přívod
                vzduchu na kahanu; uzavřít šroub přívodu plynu na kahanu; uzavřít přívod plynu na pracovní místo.
              </p>
            </div>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>Zapálený hořák kahanu nenechávat hořet bez dozoru.</li>
              <li>
                Prošlehne-li plamen dovnitř hořáku nebo dojde-li k pohlcení plamene, je třeba okamžitě uzavřít přívod plynu
                a hořák seřídit.
              </li>
              <li>Pro hašení nepoužívat sněhový hasicí přístroj (CO<sub>2</sub>).</li>
              <li>
                Při termickém rozkladu fosforu mohou vznikat nebezpečné hořlavé plyny, oxidy fosforu nebo fosfinů. S
                fosforem manipulovat opatrně, vyvarovat se nárazů a tření – nebezpečí výbuchu prachu uvnitř prachovnice.
                Fosfor se nesmí dostat do kanalizace.
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
