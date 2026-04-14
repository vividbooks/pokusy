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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/7_Reakce-siry-s-kyslikem-1.pdf";
const YT_VIDEO_ID = "leJcM-v1EGM";

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
  { label: "Čas", value: "15 min", tone: "time" },
  { label: "Míra rizika", value: "Velmi vysoké (!!!)", tone: "risk" },
  { label: "Druh pokusu", value: "Demonstrační, prezentační (video ukázka)", tone: "type" },
  {
    label: "Možná nebezpečí",
    value: "Výbuch / požár, popálení (teplo / chlad)",
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
    name: "Kyselina siřičitá",
    formula: (
      <>
        H<sub>2</sub>SO<sub>3</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Kyslina-siricita.pdf",
  },
  {
    name: "Oxid siřičitý",
    formula: (
      <>
        SO<sub>2</sub>
      </>
    ),
    hazards: [`${U}/2021/06/Vysoce-toxicke-150x150.png`, `${U}/2021/06/Zirave-150x150.png`],
    hazardText: ["- Vysoce toxické", "- Žíravé a korozivní"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Oxid-siricity.pdf",
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

export default function ReakceSirySKyslikem() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Reakce síry s kyslíkem";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Reakce síry s kyslíkem";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Reakce síry s kyslíkem</ExperimentPageTitle>

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
              <dd>Chemické prvky, chemické reakce, oxidy a peroxidy, kyseliny a hydroxidy</dd>
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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Reakce síry s kyslíkem" />
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
                "- Přívod plynu",
                "- Nehořlavá podložka",
              ]}
            />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={[
                "- Skleněná baňka",
                "- Železná spalovací lžička (může být provlečená korkovým nebo gumovým uzávěrem baňky)",
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
                "- Práškový nebo sněhový hasicí přístroj",
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> síra, kyslík, lakmus
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
                <span className="exp-ux-procedure__step-title">Zahřátí a zapálení síry</span>
                <p>
                  Na železné spalovací lžičce zahřejeme síru a necháme ji vzplanout.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Vložení do baňky a průběh reakce</span>
                <p>
                  Poté ji vložíme do skleněné baňky s kyslíkem a vodou s lakmusem. Hořící síra po vložení do baňky s
                  kyslíkem hoří intenzivněji za vzniku oxidu siřičitého, který reaguje s vodou za vzniku kyseliny siřičité
                  (to dokazuje změna zabarvení lakmusu).
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
              <p>Síra reaguje s kyslíkem za vzniku oxidu siřičitého:</p>
              <p className="exp-ux-eq">
                S + O<sub>2</sub> → SO<sub>2</sub>
              </p>
              <p>Ten reaguje s vodou za vzniku kyseliny siřičité:</p>
              <p className="exp-ux-eq">
                SO<sub>2</sub> + H<sub>2</sub>O → H<sub>2</sub>SO<sub>3</sub>
              </p>
              <p>Lakmus svým červeným zbarvením indikuje kyselé prostředí.</p>
            </div>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Zahřívaná síra se nejprve taví a poté vzplane namodralým plamenem. Po vložení do baňky s kyslíkem dojde k
              zintenzivnění hoření a reakci produktu hoření s vodou, identifikovaném zčervenáním lakmusu v reakční směsi.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              Oxid siřičitý je bezbarvý, štiplavě páchnoucí, jedovatý plyn, s vyšší hustotou než vzduch. Má dezinfekční a
              bělicí účinky.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství síry.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Přívodní hadice k hořákům musí být neporušené a musí být z jednoho kusu maximální délky 1,5 m.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Vzniklou kyselinu siřičitou, dostatečně zředěnou vodou, můžeme vylít do výlevky.
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
              <li>Zapálený hořák kahanu nenechávat hořet bez dozoru.</li>
              <li>
                Prošlehne-li plamen dovnitř hořáku nebo dojde-li k pohlcení plamene, je třeba okamžitě uzavřít přívod plynu
                a hořák seřídit.
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
