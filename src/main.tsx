import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
import mock from "./services/various.service.ts";

if (process.env.NODE_ENV === "development") {
  mock.onAny().passThrough();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
