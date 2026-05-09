import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

// HashRouter is used (not BrowserRouter) so the app works on GitHub Pages
// without server-side URL rewrites. URLs look like /#/ instead of /
// — every refresh / deep link resolves to index.html.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
