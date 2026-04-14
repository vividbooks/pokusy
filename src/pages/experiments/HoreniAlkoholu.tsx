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
const PDF = "https://ebedox.cz/wp-content/uploads/2022/09/6_Horeni-alkoholu-1.pdf";
const YT_VIDEO_ID = "RRjggoESxvw";

const ghsThumbs: string[] = [
  `${U}/2021/06/Horlave-150x150.png`,
  `${U}/2021/06/Vysoce-toxicke-150x150.png`,
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
  { label: "Čas", value: "10 min", tone: "time" },
  { label: "Míra rizika", value: "Významné (!!)", tone: "risk" },
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
    name: "Ethanol",
    formula: (
      <>
        C<sub>2</sub>H<sub>6</sub>O
      </>
    ),
    hazards: [`${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Ethanol.pdf",
  },
  {
    name: "n-Butanol",
    formula: (
      <>
        C<sub>4</sub>H<sub>10</sub>O
      </>
    ),
    hazards: [`${U}/2021/06/Drazdive-150x150.png`, `${U}/2021/06/Zirave-150x150.png`, `${U}/2021/06/Horlave-150x150.png`],
    hazardText: [
      "- Dráždivé nebo s narkotickými účinky",
      "- Žíravé a korozivní",
      "- Hořlavé nebo samozápalné",
    ],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/n-butanol.pdf",
  },
  {
    name: "Methanol",
    formula: <>CH<sub>4</sub>O</>,
    hazards: [`${U}/2021/06/Vysoce-toxicke-150x150.png`, `${U}/2021/06/Horlave-150x150.png`],
    hazardText: ["- Vysoce toxické", "- Hořlavé nebo samozápalné"],
    sds: "https://ebedox.cz/wp-content/uploads/2022/02/Methanol.pdf",
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

export default function HoreniAlkoholu() {
  const { categorySlug, experimentSlug } = useParams<{ categorySlug: string; experimentSlug: string }>();
  const experimentTitle = useMemo(() => {
    if (!categorySlug || !experimentSlug) return "Hoření alkoholů";
    return getExperiment(categorySlug, experimentSlug)?.experiment.title ?? "Hoření alkoholů";
  }, [categorySlug, experimentSlug]);

  return (
    <div className="exp-ux exp-ux--cols">
      <ExperimentPageTitle>Hoření alkoholů</ExperimentPageTitle>

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
            <YouTubeEmbed videoId={YT_VIDEO_ID} title="Instruktážní video — Hoření alkoholů" />
          </div>
        </section>

        <section id="vybaveni" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Praktické provedení pokusu</h2>

          <h3 className="exp-ux__subsection-title">Potřebné vybavení a pomůcky</h3>
          <Accordion title="Požadavky na pracovní místo" defaultOpen>
            <BulletUl items={["- Laboratoř", "- Digestoř", "- Nehořlavá podložka"]} />
          </Accordion>
          <Accordion title="Laboratorní pomůcky a přístroje">
            <BulletUl
              items={["- 3 porcelánové misky s korkovými podložkami", "- Laboratorní zapalovač"]}
            />
          </Accordion>
          <Accordion title="Ochranné pomůcky">
            <BulletUl
              items={[
                "- Pracovní obuv chránící před chemickými látkami",
                "- Ochranný oděv (plášť / zástěra na ochranu před ch. l.)",
                "- Obličejový štít",
                "- Rukavice z nitrilové pryže (vrstva 0,11 mm)",
                "- Maska s filtrem proti částicím, parám a plynům s vhodnou lícnicovou částí",
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
                "- Hadr a úklidové prostředky",
              ]}
            />
          </Accordion>

          <p className="exp-ux-inline-note">
            <strong>Použité chemikálie a další prostředky:</strong> methanol, ethanol, n-butanol
          </p>

          <h3 className="exp-ux__subsection-title">Pokyny pro provedení pokusu</h3>
          <div className="exp-ux-procedure">
            <p className="exp-ux-procedure__label">Pracovní postup</p>
            <ol className="exp-ux-procedure__steps">
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Příprava alkoholů v miskách</span>
                <p>
                  Do každé z porcelánových misek nalijeme 3 – 5 ml příslušného alkoholu.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Zapálení a pozorování plamenů</span>
                <p>
                  Zapálíme ho pomocí tyčového zapalovače a pozorujeme zbarvení plamene.
                </p>
              </li>
              <li className="exp-ux-procedure__step">
                <span className="exp-ux-procedure__step-title">Uhašení</span>
                <p>
                  Uhašení hořících alkoholů provedeme zamezením přístupu vzduchu tak, že na misky s hořícími látkami
                  položíme textilii buď z nehořlavého materiálu, anebo bavlněnou látku předem namočenou ve vodě.
                  Textilie musí být dostatečně velká – je nutné, aby přesahovala okraje misek alespoň o 5 cm.
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
            <p className="exp-ux-prose">
              Svítivost plamene při hoření alkoholu stoupá s počtem uhlíků v jeho molekule.
            </p>
          </Accordion>
          <Accordion title="Ověření správného provedení (výsledku)">
            <p className="exp-ux-prose">
              Pozorujeme, že páry methanolu a ethanolu ve směsi se vzduchem nad kapalinou se vznítí s mírným výbuchem,
              butanol se vznítí až po chvíli zahřívání. Methanol hoří téměř bezbarvým plamenem, konce plamene hořícího
              ethanolu jsou nažloutlé a plamen hořícího butanolu je žlutý. Pozorujeme také stoupající svítivost plamene v
              řadě – methanol, ethanol, n-butanol.
            </p>
          </Accordion>
          <Accordion title="Praktické souvislosti pokusu">
            <p className="exp-ux-prose">
              K rozlišení hořícího methanolu a ethanolu, které jsou za normálních podmínek bezbarvé kapaliny, můžeme
              použít zapálení jejich směsí s kyselinou boritou nebo boraxem (zelené zbarvení plamene u methanolu způsobuje
              hoření vzniklého trimethylesteru kyseliny borité). Obecně platí, že teplota plamene vznikajícího hořením
              alkoholů klesá s počtem uhlíků v jeho molekule. Čím je teplota nižší, tím lépe je plamen viditelný okem. To je
              také důvod, proč je hoření methanolu a ethanolu tak nebezpečné – jejich plamen není za podmínek běžného
              denního osvětlení dobře viditelný.
            </p>
          </Accordion>
        </section>

        <section id="bezpecnost" className="exp-ux__section">
          <h2 className="exp-ux__section-title">Pokyny pro bezpečné provedení pokusu</h2>
          <Accordion title="Práce s použitými látkami" defaultOpen>
            <p className="exp-ux-prose">
              Dodržovat na pracovním místě čistotu a pořádek. Použít pouze nezbytně nutné množství jednotlivých látek.
              Pracovat výlučně v digestoři. Zajistit řádné větrání laboratoře. Veškeré pracovní operace je nutno provádět
              za použití ochranných pracovních prostředků pro ochranu očí, obličeje a rukou. Zapalování obsahu misek
              provádět výlučně tyčkovým zapalovačem.
            </p>
          </Accordion>
          <Accordion title="Použití laboratorních pomůcek a přístrojů">
            <p className="exp-ux-prose">
              Doporučeno je přednostní použití laboratorního zapalovače. Zapalování hořící špejlí by mohlo způsobit
              vzplanutí par alkoholů mimo porcelánové misky.
            </p>
          </Accordion>
          <Accordion title="Likvidace odpadů">
            <p className="exp-ux-prose">
              Zbytek alkoholů můžeme nechat shořet nebo je uložíme do uzavřené odpadní nádoby s příslušným bezpečnostním
              označením a necháme zlikvidovat specializovanou firmou.
            </p>
          </Accordion>
          <Accordion title="Práce s hořlavinami a plyny">
            <p className="exp-ux-prose">
              Methanol a ethanol jsou vysoce hořlavé kapalné látky. Methanol a ethanol jsou těkavé látky vytvářející se
              vzduchem výbušné směsi s nízkou hodnotou dolní meze výbuchu. Před zahájením práce je nezbytné zajistit
              vhodné hasební prostředky (práškový hasicí přístroj). Při rozlití použitých látek je třeba ihned zhasnout
              plynové spotřebiče, vypnout elektrický proud a zajistit důkladné větrání. Pro sanaci je nutné použít inertní
              sorpční materiál.
            </p>
          </Accordion>

          <div className="exp-ux-warn">
            <h3 className="exp-ux-warn__title">Zakázané činnosti</h3>
            <ul className="exp-ux-warn__list">
              <li>
                Methanol je vysoce toxická látka – nutno s ní pracovat velmi obezřetně, zejména zamezit požití (byť i
                velmi malého množství) a předcházet možnosti záměny s jinou látkou (např. ethanolem nebo vodou).
              </li>
              <li>Methanol hoří bezbarvým plamenem. Methanol a ethanol jsou vysoce těkavé látky vytvářející se vzduchem výbušné směsi s nízkou hodnotou dolní meze výbuchu.</li>
              <li>Zamezit kontaktu použitých látek s kůží a očima, nevdechovat jejich výpary ani produkty hoření (kouř). Zamezit průniku použitých látek do životního prostředí (nesmí se dostat do kanalizace).</li>
              <li>Je zakázáno stírat louže rozlitého ethanolu hadry z umělých vláken nebo plastovými stěrkami – nebezpečí vzniku statické elektřiny. V případě požáru nehasit vodou.</li>
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
