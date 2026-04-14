import type { ReactNode } from "react";

type Props = {
  title: string;
  id?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/** Rozbalovací sekce — nativní <details>, funguje na dotyk i klávesnici. */
export function Accordion({ title, id, children, defaultOpen }: Props) {
  return (
    <details className="exp-ux-acc" id={id} open={defaultOpen}>
      <summary className="exp-ux-acc__summary">
        <span className="exp-ux-acc__title">{title}</span>
      </summary>
      <div className="exp-ux-acc__body">{children}</div>
    </details>
  );
}
