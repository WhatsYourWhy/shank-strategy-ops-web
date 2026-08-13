import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// The build prerenders real markup into #root (see scripts/generate-route-html.ts),
// so hydrate it rather than throwing it away and re-rendering.
hydrateRoot(document.getElementById("root")!, <App />);
