import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { TableProvider } from "./context/TableContext";

ReactDOM.createRoot(
  document.getElementById(
    "root"
  ) as HTMLElement
).render(
  <React.StrictMode>
    <TableProvider>
      <App />
    </TableProvider>
  </React.StrictMode>
);