import React from "react";
import ReactDOM from "react-dom/client";
import App from "./notebook/App";
import "./notebook/notebook.css";

// One page with native anchor navigation; compatible with GitHub Pages subpaths.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
