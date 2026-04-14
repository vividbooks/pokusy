import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteCreditsFooter from "../components/SiteCreditsFooter";
import { ExperimentCard } from "../components/ExperimentCard";
import {
  defaultCategorySlug,
  experimentCategories,
  getExperimentCategory,
} from "../data/catalog";
import { buildVividbooksCatalogMeta } from "../data/vividbooksExperimentPrimaryBook";
import { categoryThemeCssVars } from "../utils/categoryThemeCss";
import "./catalog-home.css";

export default function CatalogHome() {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const category = useMemo(() => {
    if (!categorySlug) return experimentCategories[0];
    return getExperimentCategory(categorySlug) ?? null;
  }, [categorySlug]);

  if (categorySlug && !category) {
    return <Navigate to={`/${defaultCategorySlug}`} replace />;
  }

  const active = category ?? experimentCategories[0];

  const [selectedVividbooksBookId, setSelectedVividbooksBookId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedVividbooksBookId(null);
  }, [active.slug]);

  const vividbooksMeta = useMemo(
    () => buildVividbooksCatalogMeta(active.experiments),
    [active.experiments],
  );

  const filteredExperiments = useMemo(() => {
    if (selectedVividbooksBookId === null) return active.experiments;
    return active.experiments.filter(
      (e) => vividbooksMeta.slugToBook.get(e.slug)?.bookId === selectedVividbooksBookId,
    );
  }, [active.experiments, selectedVividbooksBookId, vividbooksMeta]);

  const hubSurfaceStyle = {
    "--hub-section-tab": active.folderTheme.tab,
  } as CSSProperties;

  return (
    <div className="hub" style={hubSurfaceStyle}>
      <div className="hub__top">
        <header className="hub__header">
          <h1 className="hub__site-title">{active.pageHeadline}</h1>
          <nav className="hub__vb-filters" aria-label="Filtrovat podle učebnice Vividbooks">
            <span className="hub__vb-filters-label">Vividbooks</span>
            <div className="hub__vb-chips">
              {vividbooksMeta.bookOptions.map((opt) => (
                <button
                  key={opt.bookId}
                  type="button"
                  className={`hub__vb-chip${selectedVividbooksBookId === opt.bookId ? " is-active" : ""}`}
                  onClick={() =>
                    setSelectedVividbooksBookId((cur) =>
                      cur === opt.bookId ? null : opt.bookId,
                    )
                  }
                  aria-pressed={selectedVividbooksBookId === opt.bookId}
                  title={
                    selectedVividbooksBookId === opt.bookId
                      ? `${opt.bookName} — zrušit filtr`
                      : opt.bookName
                  }
                >
                  <span className="hub__vb-chip-name">{opt.bookName}</span>
                  <span className="hub__vb-chip-count" aria-hidden>
                    {opt.slugCount}
                  </span>
                </button>
              ))}
            </div>
          </nav>
          <nav className="hub__pills" aria-label="Témata pokusů">
            {experimentCategories.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className={`hub__pill${c.slug === active.slug ? " is-active" : ""}`}
                style={categoryThemeCssVars(c.folderTheme)}
              >
                {c.title}
              </Link>
            ))}
          </nav>
        </header>

        <section className="hub__section" aria-labelledby="hub-section-title">
          <h2 id="hub-section-title" className="hub__section-title">
            {active.title}
            {selectedVividbooksBookId !== null && (
              <span className="hub__section-filter-hint">
                {" "}
                — zobrazeno {filteredExperiments.length} z {active.experiments.length}
              </span>
            )}
          </h2>
          <ul className="hub__subgrid">
            {filteredExperiments.map((exp) => (
              <li key={exp.slug}>
                <ExperimentCard experiment={exp} categorySlug={active.slug} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SiteCreditsFooter />
    </div>
  );
}
