import CryptoJS from "crypto-js";

export const createAESKey = (text, keySize) => {
  // Hash the text to ensure a consistent key
  const hashed = CryptoJS.SHA256(text);

  // Convert the hashed result to a WordArray and adjust the key size
  // keySize is in bits (e.g., 128, 192, 256), so divide by 8 to get bytes
  const key = hashed.toString(CryptoJS.enc.Hex).substring(0, keySize / 4);

  return key;
};
