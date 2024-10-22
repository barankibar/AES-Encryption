import CryptoJS from "crypto-js";

export const createAESKey = (text, keySize) => {
  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(128 / 8); // 128-bit salt

  // Use the qrText as the passphrase for key derivation
  const passphrase = text;

  // Derive the key using PBKDF2 (Password-Based Key Derivation Function 2)
  const key = CryptoJS.PBKDF2(passphrase, salt, {
    keySize: keySize / 32, // Convert keySize to words (e.g., 128-bit = 4 words)
    iterations: 1000, // Number of iterations for PBKDF2
  });

  // Return the key as a hexadecimal string for use in encryption
  return key.toString(CryptoJS.enc.Hex);
};
