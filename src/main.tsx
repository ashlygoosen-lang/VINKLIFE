import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import { initMotion, playIntro } from "./motion";

playIntro();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

initMotion();
