import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { publicUrl } from "./utils/publicUrl";
import "./index.css";

const cooperFont = document.createElement("style");
cooperFont.textContent = `@font-face{font-family:"Cooper Light";src:url("${publicUrl("/fonts/Cooper-Light.otf")}") format("opentype");font-weight:400;font-style:normal;font-display:swap;}`;
document.head.appendChild(cooperFont);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
