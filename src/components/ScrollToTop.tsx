import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Po každém přechodu na jinou stránku scroll nahoru (jinak zůstane pozice z předchozí stránky). */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
