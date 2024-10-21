import React from "react";
import QRScanner from "./components/QRScanner";
import { KeyProvider } from "./context/keyContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <KeyProvider>
              <Home />
            </KeyProvider>
          }
        />
        <Route
          path="/create-key"
          element={
            <KeyProvider>
              <QRScanner />
            </KeyProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
