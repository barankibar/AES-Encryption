import React, { useContext } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { keyContext } from "../context/keyContext";

const QRScanner = () => {
  const { setKey } = useContext(keyContext);

  const handleScan = (result) => {
    if (result) {
      const { rawValue } = result;
      console.log("Scanned QR code:", result.rawValue);
      setKey(rawValue);
    }
  };

  const handleError = (error) => {
    console.error("Error scanning QR code:", error);
  };

  return (
    <div>
      <Scanner
        onScan={handleScan}
        onError={handleError}
        constraints={{ facingMode: "environment" }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default QRScanner;
