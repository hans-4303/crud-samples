import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
import usersMock from "./services/users.service.ts";

if (process.env.NODE_ENV === "development") {
  usersMock.onAny().passThrough();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
