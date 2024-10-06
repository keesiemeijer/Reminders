import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import React from "react";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={ store }>
    <React.StrictMode>
      <PersistGate loading={ null } persistor={ persistor }>
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>
);
