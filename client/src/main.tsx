import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MemberstackProvider } from "./context/MemberstackProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberstackProvider>
      <App />
    </MemberstackProvider>
  </StrictMode>
);
