import { createContext, useState } from "react";

export const keyContext = createContext();

export const KeyProvider = ({ children }) => {
  const [key, setKey] = useState(null);

  return (
    <keyContext.Provider value={{ key, setKey }}>
      {children}
    </keyContext.Provider>
  );
};
