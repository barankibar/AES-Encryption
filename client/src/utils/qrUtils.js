import CryptoJS from "crypto-js";

export const processQRData = (data) => {
  if (data) {
    return CryptoJS.SHA256(data).toString();
  }
  return null;
};
