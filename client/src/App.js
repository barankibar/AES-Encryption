import React from "react";
import QRScanner from "./components/QRScanner";
import { KeyProvider } from "./context/keyContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Console from "./components/Home/Console";
import FileDecryptor from "./components/FileDecryptor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <KeyProvider>
              <Home>
                <Console />
              </Home>
            </KeyProvider>
          }
        />
        <Route
          path="/create-key"
          element={
            <KeyProvider>
              <QRScanner redirect="/" />
            </KeyProvider>
          }
        />
        <Route
          path="/get-key"
          element={
            <KeyProvider>
              <QRScanner redirect="/decrypt" />
            </KeyProvider>
          }
        />
        <Route
          path="/decrypt"
          element={
            <KeyProvider>
              <Home>
                <FileDecryptor />
              </Home>
            </KeyProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
