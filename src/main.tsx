import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppProviders } from "./providers/AppProviders.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  
    <AppProviders>
      <App />
    </AppProviders>
  
);
