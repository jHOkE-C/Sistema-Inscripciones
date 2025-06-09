import App from "./App.tsx";
import "./index.css";
import { AppProviders } from "./providers/AppProviders.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
