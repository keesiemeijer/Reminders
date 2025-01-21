import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store";
import React from "react";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Scroll to top on every navigation
import ScrollToTop from "./components/scrollToTop";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);

root.render(
    <Provider store={store}>
        <React.StrictMode>
            <BrowserRouter basename="/Reminders">
                <PersistGate loading={null} persistor={persistor}>
                    <ScrollToTop />
                    <App />
                </PersistGate>
            </BrowserRouter>
        </React.StrictMode>
    </Provider>
);
