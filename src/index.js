import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { FirebaseProvider } from "./context/FirebaseProvider";
import { RoomDataProvider } from "./context/RoomDataProvider";

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <RoomDataProvider>
        <App />
      </RoomDataProvider>
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
