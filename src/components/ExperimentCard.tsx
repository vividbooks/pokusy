import { Link } from "react-router-dom";
import type { ExperimentItem } from "../types";

type Props = {
  experiment: ExperimentItem;
  categorySlug: string;
};

export function ExperimentCard({ experiment, categorySlug }: Props) {
  const thumbUrl = experiment.thumbnailUrl;

  return (
    <Link to={`/${categorySlug}/${experiment.slug}`} className="hub__subcard">
      <div className="hub__subcard-visual">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt=""
            className="hub__subcard-img"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="hub__subcard-footer">
        <span className="hub__subcard-label">{experiment.title}</span>
        <span className="hub__subcard-arrow" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
