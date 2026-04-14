import { useMemo, type ComponentType, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteCreditsFooter from "../components/SiteCreditsFooter";
import { VividbooksLessonsSection } from "../components/VividbooksLessonsSection";
import { defaultCategorySlug, getExperiment } from "../data/catalog";
import HoreniAlkoholu from "./experiments/HoreniAlkoholu";
import HoreniFosforuVKysliku from "./experiments/HoreniFosforuVKysliku";
import HoreniHorciku from "./experiments/HoreniHorciku";
import EbedoxExperimentRichPage from "./experiments/EbedoxExperimentRichPage";
import HaseniHoricihoHorcikuOxidemUhlicitym from "./experiments/HaseniHoricihoHorcikuOxidemUhlicitym";
import PripravaAVlastnostiChloru from "./experiments/PripravaAVlastnostiChloru";
import PripravaAVlastnostiOxiduUhliciteho from "./experiments/PripravaAVlastnostiOxiduUhliciteho";
import PripravaBromu from "./experiments/PripravaBromu";
import PripravaChloriduAmonneho from "./experiments/PripravaChloriduAmonneho";
import PripravaEthynuAcetylenu from "./experiments/PripravaEthynuAcetylenu";
import PripravaJodu from "./experiments/PripravaJodu";
import PripravaVlastnostiSulfanu from "./experiments/PripravaVlastnostiSulfanu";
import ReakceSirySKyslikem from "./experiments/ReakceSirySKyslikem";
import ReakceZinkuSeSirou from "./experiments/ReakceZinkuSeSirou";
import "./experiment-detail.css";

/**
 * Ručně vypracované stránky (plné karty chemikálií, didaktika). Ostatní pokusy používají
 * EbedoxExperimentRichPage + data z fetch-ebedox-rich-content.mjs.
 */
const MANUAL_EXPERIMENT_PAGES: Record<string, ComponentType> = {
  "priprava-a-vlastnosti-sulfanu": PripravaVlastnostiSulfanu,
  "priprava-chloridu-amonneho": PripravaChloriduAmonneho,
  "priprava-ethynu-acetylenu": PripravaEthynuAcetylenu,
  "reakce-zinku-se-sirou": ReakceZinkuSeSirou,
  "horeni-horciku": HoreniHorciku,
  "horeni-alkoholu": HoreniAlkoholu,
  "reakce-siry-s-kyslikem": ReakceSirySKyslikem,
  "horeni-fosforu-v-kysliku": HoreniFosforuVKysliku,
  "priprava-a-vlastnosti-chloru": PripravaAVlastnostiChloru,
  "priprava-bromu": PripravaBromu,
  "priprava-jodu": PripravaJodu,
  "priprava-a-vlastnosti-oxidu-uhliciteho": PripravaAVlastnostiOxiduUhliciteho,
  "haseni-horiciho-horciku-oxidem-uhlicitym": HaseniHoricihoHorcikuOxidemUhlicitym,
};

export default function ExperimentDetail() {
  const { categorySlug, experimentSlug } = useParams<{
    categorySlug: string;
    experimentSlug: string;
  }>();

  const resolved = useMemo(() => {
    if (!categorySlug || !experimentSlug) return null;
    return getExperiment(categorySlug, experimentSlug) ?? null;
  }, [categorySlug, experimentSlug]);

  if (!categorySlug || !experimentSlug) {
    return <Navigate to={`/${defaultCategorySlug}`} replace />;
  }

  if (!resolved) {
    return <Navigate to={`/${categorySlug}`} replace />;
  }

  const { category, experiment } = resolved;
  const surfaceStyle = {
    "--hub-section-tab": category.folderTheme.tab,
  } as CSSProperties;

  const RichPage = experimentSlug
    ? MANUAL_EXPERIMENT_PAGES[experimentSlug] ?? EbedoxExperimentRichPage
    : undefined;

  return (
    <div className="experiment-detail" style={surfaceStyle}>
      <div className="experiment-detail__top">
        <Link className="experiment-detail__back" to={`/${category.slug}`}>
          ← Zpět na {category.title}
        </Link>

        {RichPage ? (
          <RichPage />
        ) : (
          <>
            <h1 className="experiment-detail__title">{experiment.title}</h1>
            <p className="experiment-detail__meta">Téma: {category.title}</p>
            <VividbooksLessonsSection
              experimentSlug={experimentSlug}
              experimentTitle={experiment.title}
              variant="compact"
            />
            <div className="experiment-detail__actions">
              <a
                className="experiment-detail__btn"
                href={experiment.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Otevřít metodický obsah na eBedox
              </a>
              <Link
                className="experiment-detail__btn experiment-detail__btn--ghost"
                to={`/${category.slug}`}
              >
                Další pokusy v tématu
              </Link>
            </div>
            <p className="experiment-detail__notice">
              Metodické listy, bezpečnostní upozornění a videa jsou na webu projektu eBedox. Tato aplikace slouží jako
              katalog a odkaz; při práci s chemikáliemi vždy postupujte podle oficiálního dokumentu a platných předpisů.
            </p>
          </>
        )}

        {RichPage ? (
          <p className="experiment-detail__notice experiment-detail__notice--after-rich">
            Obsah odpovídá materiálům na eBedox; při práci v laboratoři vždy používejte aktuální metodický list PDF a
            dodržujte BOZP.
          </p>
        ) : null}
      </div>
      <SiteCreditsFooter />
    </div>
  );
}
