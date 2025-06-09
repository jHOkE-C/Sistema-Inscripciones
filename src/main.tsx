// Antes (no existe default export en 'react-dom/client'):
import ReactDOM from "react-dom/client";

// Mejor así:
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { AppProviders } from "./providers/AppProviders.tsx";

const container = document.getElementById("root");
if (!container) throw new Error("No se encontró el elemento #root");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
