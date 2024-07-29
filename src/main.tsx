import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

import { App } from "./App";
import "./index.css";
import { PluginGate } from "./feature/plugin/PluginGate";
import { PluginThemeProvider } from "./feature/plugin/PluginThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <App />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>
);
