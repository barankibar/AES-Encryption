import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRScanner = ({ onQRCodeScanned }) => {
  const handleScan = (result) => {
    if (result) {
      // Extract the `rawValue`
      onQRCodeScanned(result.rawValue);
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error: ", error);
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
