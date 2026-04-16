import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthGate } from "./components/auth/AuthGate";
import { defaultCategorySlug } from "./data/catalog";
import CatalogHome from "./pages/CatalogHome";
import ExperimentDetail from "./pages/ExperimentDetail";

const routerBasename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <AuthGate>
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to={`/${defaultCategorySlug}`} replace />} />
          <Route path="/:categorySlug" element={<CatalogHome />} />
          <Route path="/:categorySlug/:experimentSlug" element={<ExperimentDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthGate>
  );
}
