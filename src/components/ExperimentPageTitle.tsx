import type { ReactNode } from "react";
import { publicUrl } from "../utils/publicUrl";

type ExperimentPageTitleProps = {
  children: ReactNode;
};

/** Logo Vividbooks + nadpis pokusu (stejný vzhled na všech stránkách s bohatým obsahem). */
export function ExperimentPageTitle({ children }: ExperimentPageTitleProps) {
  return (
    <div className="exp-ux__title-block">
      <img
        className="exp-ux__brand-logo"
        src={publicUrl("/vividbooks_logo.svg")}
        alt="Vividbooks"
        width={103}
        height={52}
        decoding="async"
      />
      <h1 className="exp-ux__title exp-ux__title--span">{children}</h1>
    </div>
  );
}
