import { createContext, useState } from "react";

export const keyContext = createContext();

export const KeyProvider = ({ children }) => {
  const [key, setKey] = useState(null);
  const [qrText, setQrText] = useState("");

  return (
    <keyContext.Provider value={{ key, setKey, qrText, setQrText }}>
      {children}
    </keyContext.Provider>
  );
};
