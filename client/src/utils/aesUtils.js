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

export const encryptFile = (fileContent, key) => {
  return CryptoJS.AES.encrypt(fileContent, key).toString();
};

export const decryptFile = (encryptedContent, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, key);

  // Çözülmüş veriyi Base64 formatında string olarak al
  const decryptedBase64 = bytes.toString(CryptoJS.enc.Base64);

  // Base64 verisini binary hale getir
  const binaryString = atob(decryptedBase64);

  const len = binaryString.length;
  const bytesArray = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytesArray[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytesArray], { type: "application/octet-stream" });
};
