import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import { store } from "./store/store.js";
import { navigationConfig } from "./shared/config/navigationConfig.js";
import { validateNavConfig } from "./shared/utils/validateNavConfig.js";
import QueryProvider from "./providers/QueryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <AuthProvider>
          {validateNavConfig(navigationConfig)}
          <App />
        </AuthProvider>
      </QueryProvider>
    </Provider>
  </StrictMode>,
);
