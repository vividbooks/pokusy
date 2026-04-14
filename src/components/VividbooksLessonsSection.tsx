import { useEffect, useState } from "react";
import type { VividbooksPanelData } from "../data/vividbooksResolve";
import { loadVividbooksPanelDataForExperiment } from "../data/vividbooksResolve";
import { VividbooksLessonsPanel } from "./VividbooksLessonsPanel";

type Props = {
  experimentSlug: string;
  experimentTitle: string;
  /** Kompaktní blok (nad „Shrnutím“ na bohatém detailu). */
  variant?: "default" | "compact";
};

/**
 * Načte manifesty Vividbooks v samostatném chunku na stránce detailu pokusu.
 */
export function VividbooksLessonsSection({ experimentSlug, experimentTitle, variant = "default" }: Props) {
  const [data, setData] = useState<VividbooksPanelData | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "ready">("idle");

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    setData(null);

    void loadVividbooksPanelDataForExperiment(experimentSlug, experimentTitle).then((d) => {
      if (cancelled) return;
      setData(d);
      setPhase("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [experimentSlug, experimentTitle]);

  if (phase === "loading" || data === null) {
    return (
      <p
        className={
          variant === "compact"
            ? "experiment-detail__vividbooks-loading experiment-detail__vividbooks-loading--compact"
            : "experiment-detail__vividbooks-loading"
        }
        aria-live="polite"
      >
        Načítám související lekce Vividbooks…
      </p>
    );
  }

  return (
    <VividbooksLessonsPanel
      data={data}
      variant={variant}
      id={variant === "compact" ? "vividbooks" : undefined}
    />
  );
}
