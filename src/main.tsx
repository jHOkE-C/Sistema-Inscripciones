import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppProviders } from "./providers/AppProviders.tsx";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </AppProviders>
  </React.StrictMode>
);
