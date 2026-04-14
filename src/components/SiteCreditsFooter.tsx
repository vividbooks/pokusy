import { useState } from "react";
import "./site-credits-footer.css";

const PARTNER_LOGOS = [
  {
    src: "https://ebedox.cz/wp-content/uploads/2021/09/FBMI_logo.png",
    alt: "Fakulta biomedicínského inženýrství ČVUT v Praze",
  },
  {
    src: "https://ebedox.cz/wp-content/uploads/2021/09/Karlovka_Logo.png",
    alt: "Pedagogická fakulta Univerzity Karlovy",
  },
  {
    src: "https://ebedox.cz/wp-content/uploads/2021/09/ustav_logo.png",
    alt: "ZÚBOZ — znalecký ústav bezpečnosti a ochrany zdraví",
  },
] as const;

const BEDOX_WORDMARK =
  "https://ebedox.cz/wp-content/uploads/2020/03/BEDOXFinalAquarineBoldBezVyplneLargePNG.png";

export default function SiteCreditsFooter() {
  const [open, setOpen] = useState(true);

  return (
    <footer className="site-credits" lang="cs">
      <details
        className="site-credits__details"
        open={open}
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        <summary className="site-credits__summary">Credits</summary>
        <div className="site-credits__body">
          <div className="site-credits__logos" aria-label="Partneři projektu eBedox">
            {PARTNER_LOGOS.map(({ src, alt }) => (
              <img
                key={src}
                className="site-credits__logo-img"
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <div className="site-credits__bedox-row">
            <img
              className="site-credits__bedox-img"
              src={BEDOX_WORDMARK}
              alt="eBedox"
              loading="lazy"
              decoding="async"
            />
            <span className="site-credits__copyright">
              Copyright © 2021 eBedox. Všechna práva vyhrazena.
            </span>
          </div>
          <p>
            Metodické materiály k pokusům pocházejí z projektu{" "}
            <a href="https://ebedox.cz/" target="_blank" rel="noopener noreferrer">
              eBedox
            </a>{" "}
            (použití v souladu se smlouvou).
          </p>
        </div>
      </details>
    </footer>
  );
}
