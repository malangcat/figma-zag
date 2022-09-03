import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "./ui.css";

const root = createRoot(document.getElementById("react-page")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
