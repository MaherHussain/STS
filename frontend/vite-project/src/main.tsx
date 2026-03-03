import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/providers/AuthProvider.tsx";
import ReactQueryProvider from "./utils/providers/ReactQueryProvider.tsx";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>,
);
