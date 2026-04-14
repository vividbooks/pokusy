import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { defaultCategorySlug } from "./data/catalog";
import CatalogHome from "./pages/CatalogHome";
import ExperimentDetail from "./pages/ExperimentDetail";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultCategorySlug}`} replace />} />
        <Route path="/:categorySlug" element={<CatalogHome />} />
        <Route path="/:categorySlug/:experimentSlug" element={<ExperimentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
