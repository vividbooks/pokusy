import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";
import { publicUrl } from "./utils/publicUrl";
import "@mantine/core/styles.css";
import "./index.css";

const theme = createTheme({
  primaryColor: "blue",
  radius: { md: "12px", lg: "16px" },
  fontFamily: "'Fenomen Sans', ui-sans-serif, system-ui, sans-serif",
});

const cooperFont = document.createElement("style");
cooperFont.textContent = `@font-face{font-family:"Cooper Light";src:url("${publicUrl("/fonts/Cooper-Light.otf")}") format("opentype");font-weight:400;font-style:normal;font-display:swap;}`;
document.head.appendChild(cooperFont);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
);
